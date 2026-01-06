import { Request, Response } from "express";
import { AdminRequest, verifyAdminLogin } from "../middlewares/auth.middleware";
import { EventRepository } from "../repositories";
import { httpLogger } from "../utils/logger";
import { error, success } from "../utils/response.util";

/**
 * Admin Controller - Handles admin HTTP requests
 * CRUD operations for events + dashboard stats
 */
export class AdminController {
  /**
   * Admin Login
   */
  static async login(req: Request, res: Response) {
    try {
      const { password } = req.body;

      if (!password) {
        res.status(400).json(error("Password is required"));
        return;
      }

      const token = verifyAdminLogin(password);

      if (!token) {
        res.status(401).json(error("Invalid password"));
        return;
      }

      res.json(success({ token }));
    } catch (err) {
      httpLogger.error({ err }, "Login failed");
      res.status(500).json(error("Login failed"));
    }
  }

  /**
   * Get dashboard statistics
   */
  static async getDashboard(req: AdminRequest, res: Response) {
    try {
      const stats = await EventRepository.getStats();
      const recentEvents = await EventRepository.findUpcoming(5);

      res.json(
        success({
          stats,
          recentEvents: recentEvents.map((e) => ({
            id: e.id,
            title: e.title,
            location: e.location,
            cover_image_url: e.cover_image_url,
            date_text: e.date_text,
          })),
        })
      );
    } catch (err) {
      httpLogger.error({ err }, "Failed to fetch dashboard");
      res.status(500).json(error("Failed to fetch dashboard"));
    }
  }

  /**
   * Get all events (paginated) for admin
   */
  static async getEvents(req: AdminRequest, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      const search = req.query.search as string;
      const month = req.query.month as string;
      const category = req.query.category as string;
      const status = req.query.status as string; // active or ended

      let is_ended: boolean | undefined;
      if (status === "ended") is_ended = true;
      if (status === "active") is_ended = false;

      let result;
      if (search) {
        const events = await EventRepository.search(search, limit);
        result = {
          data: events,
          total: events.length,
          limit,
          offset: 0,
          hasMore: false,
        };
      } else {
        result = await EventRepository.findAll({
          limit,
          offset,
          month,
          category,
          is_ended,
        });
      }

      res.json(
        success({
          events: result.data,
          pagination: {
            total: result.total,
            limit: result.limit,
            offset: result.offset,
            hasMore: result.hasMore,
          },
        })
      );
    } catch (err) {
      httpLogger.error({ err }, "Failed to fetch admin events");
      res.status(500).json(error("Failed to fetch events"));
    }
  }

  /**
   * Get all available months for filtering
   */
  static async getEventMonths(req: AdminRequest, res: Response) {
    try {
      const months = await EventRepository.findAllMonths();
      res.json(success(months));
    } catch (err) {
      httpLogger.error({ err }, "Failed to fetch event months");
      res.status(500).json(error("Failed to fetch event months"));
    }
  }

  /**
   * Get single event for editing
   */
  static async getEvent(req: AdminRequest, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const event = await EventRepository.findById(id);

      if (!event) {
        res.status(404).json(error("Event not found"));
        return;
      }

      const images = await EventRepository.findImagesByEventId(id);

      res.json(success({ ...event, images }));
    } catch (err) {
      httpLogger.error({ err }, "Failed to fetch event");
      res.status(500).json(error("Failed to fetch event"));
    }
  }

  /**
   * Create new event
   */
  static async createEvent(req: AdminRequest, res: Response) {
    try {
      const {
        title,
        description,
        location,
        date_text,
        time_text,
        cover_image_url,
        latitude,
        longitude,
        google_maps_url,
        facebook_url,
      } = req.body;

      if (!title) {
        res.status(400).json(error("Title is required"));
        return;
      }

      // Generate a unique source_url for manually created events
      const sourceUrl = `admin://manual/${Date.now()}`;

      const event = await EventRepository.upsert({
        sourceUrl,
        title,
        coverImageUrl: cover_image_url,
        location,
        dateText: date_text,
      });

      // Update with additional details
      if (event.id) {
        await EventRepository.updateDetails(event.id, {
          description,
          timeText: time_text,
          latitude: latitude ? parseFloat(latitude) : undefined,
          longitude: longitude ? parseFloat(longitude) : undefined,
          googleMapsUrl: google_maps_url,
          facebookUrl: facebook_url,
        });
      }

      const created = await EventRepository.findById(event.id);
      res.status(201).json(success(created));
    } catch (err) {
      httpLogger.error({ err }, "Failed to create event");
      res.status(500).json(error("Failed to create event"));
    }
  }

  /**
   * Update event
   */
  static async updateEvent(req: AdminRequest, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const existing = await EventRepository.findById(id);

      if (!existing) {
        res.status(404).json(error("Event not found"));
        return;
      }

      const {
        title,
        description,
        location,
        date_text,
        time_text,
        cover_image_url,
        latitude,
        longitude,
        google_maps_url,
        facebook_url,
        is_ended,
      } = req.body;

      await EventRepository.updateDetails(id, {
        coverImageUrl: cover_image_url,
        description,
        timeText: time_text,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        googleMapsUrl: google_maps_url,
        facebookUrl: facebook_url,
        isEnded: is_ended,
      });

      // Note: title, location, date_text require raw SQL update
      // For now, we use upsert with existing source_url
      if (title || location || date_text) {
        await EventRepository.upsert({
          sourceUrl: existing.source_url,
          title: title || existing.title,
          location: location || existing.location || undefined,
          dateText: date_text || existing.date_text || undefined,
          coverImageUrl:
            cover_image_url || existing.cover_image_url || undefined,
        });
      }

      // Handle images syncing
      // We do a full replace for simplicity: delete all and re-create
      const { images } = req.body;
      if (Array.isArray(images)) {
        await EventRepository.deleteImagesByEventId(id);
        if (images.length > 0) {
          await EventRepository.createImages(id, images);
        }
      }

      const updated = await EventRepository.findById(id);
      res.json(success(updated));
    } catch (err) {
      httpLogger.error({ err }, "Failed to update event");
      res.status(500).json(error("Failed to update event"));
    }
  }

  /**
   * Delete event
   */
  static async deleteEvent(req: AdminRequest, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const existing = await EventRepository.findById(id);

      if (!existing) {
        res.status(404).json(error("Event not found"));
        return;
      }

      // Delete images first (foreign key constraint)
      await EventRepository.deleteImagesByEventId(id);

      // Delete event using Prisma
      const prisma = (await import("../lib/prisma")).default;
      await prisma.events.delete({ where: { id } });

      res.json(success({ message: "Event deleted successfully" }));
    } catch (err) {
      httpLogger.error({ err }, "Failed to delete event");
      res.status(500).json(error("Failed to delete event"));
    }
  }

  /**
   * Sync event status
   */
  static async syncEventStatus(req: AdminRequest, res: Response) {
    try {
      const updatedCount = await EventRepository.syncEventStatus();
      res.json(
        success({ message: `Synced ${updatedCount} events`, updatedCount })
      );
    } catch (err) {
      httpLogger.error({ err }, "Failed to sync event status");
      res.status(500).json(error("Failed to sync event status"));
    }
  }
}
