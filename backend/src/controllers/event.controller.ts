import { Request, Response } from "express";
import { CATEGORIES } from "../config/categories";
import { EventRepository } from "../repositories";
import { httpLogger } from "../utils/logger";
import { error, success } from "../utils/response.util";

/**
 * Event Controller - Handles HTTP requests
 * Business logic only, database queries delegated to EventRepository
 */
export class EventController {
  static async getCategories(req: Request, res: Response) {
    res.json(success(CATEGORIES));
  }

  static async getEvents(req: Request, res: Response) {
    try {
      // Use validated query params if available, otherwise fallback to raw query
      const validated = req.validated?.query as
        | {
            month?: string;
            category?: string;
            limit?: number;
            offset?: number;
          }
        | undefined;

      const result = await EventRepository.findAll({
        month: validated?.month || (req.query.month as string | undefined),
        category:
          validated?.category || (req.query.category as string | undefined),
        limit: validated?.limit ?? 20,
        offset: validated?.offset ?? 0,
      });

      const mappedEvents = result.data.map((e) => ({
        ...e,
        image: e.cover_image_url,
      }));

      res.json(
        success({
          events: mappedEvents,
          pagination: {
            total: result.total,
            limit: result.limit,
            offset: result.offset,
            hasMore: result.hasMore,
          },
        })
      );
    } catch (err) {
      console.error("getEvents error:", err);
      httpLogger.error({ err }, "Failed to fetch events");
      res.status(500).json(error("Failed to fetch events"));
    }
  }

  static async getEventById(req: Request, res: Response) {
    try {
      // Use validated params if available
      const validated = req.validated?.params as { id?: number } | undefined;
      const eventId = validated?.id ?? parseInt(req.params.id, 10);

      const event = await EventRepository.findById(eventId);

      if (!event) {
        res.status(404).json(error("Event not found"));
        return;
      }

      const images = await EventRepository.findImagesByEventId(eventId);

      res.json(
        success({
          ...event,
          image: event.cover_image_url,
          images,
        })
      );
    } catch (err) {
      httpLogger.error({ err }, "Failed to fetch event");
      res.status(500).json(error("Failed to fetch event"));
    }
  }

  static async getMonths(req: Request, res: Response) {
    try {
      const months = await EventRepository.findAllMonths();
      res.json(success(months));
    } catch (err) {
      httpLogger.error({ err }, "Failed to fetch months");
      res.status(500).json(error("Failed to fetch months"));
    }
  }

  static async getStats(req: Request, res: Response) {
    try {
      console.log("getStats: starting...");
      const stats = await EventRepository.getStats();
      console.log("getStats: success", stats);
      res.json(success(stats));
    } catch (err) {
      console.error("getStats error:", err);
      httpLogger.error({ err }, "Failed to fetch stats");
      res.status(500).json(error("Failed to fetch stats"));
    }
  }

  static async searchEvents(req: Request, res: Response) {
    try {
      const { q } = req.query;

      if (!q || typeof q !== "string") {
        res.status(400).json(error("Query parameter 'q' is required"));
        return;
      }

      const events = await EventRepository.search(q);

      res.json(
        success(
          events.map((e) => ({
            ...e,
            image: e.cover_image_url,
          }))
        )
      );
    } catch (err) {
      httpLogger.error({ err }, "Search failed");
      res.status(500).json(error("Search failed"));
    }
  }

  static async getUpcomingEvents(req: Request, res: Response) {
    try {
      const events = await EventRepository.findUpcoming();

      res.json(
        success(
          events.map((e) => ({
            ...e,
            image: e.cover_image_url,
          }))
        )
      );
    } catch (err) {
      httpLogger.error({ err }, "Failed to fetch upcoming events");
      res.status(500).json(error("Failed to fetch upcoming events"));
    }
  }

  static async getMapEvents(req: Request, res: Response) {
    try {
      const events = await EventRepository.findForMap();
      res.json(success(events));
    } catch (err) {
      httpLogger.error({ err }, "Failed to fetch map events");
      res.json(success([]));
    }
  }
}
