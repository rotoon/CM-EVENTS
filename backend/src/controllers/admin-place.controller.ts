/**
 * Admin Place Controller
 * HTTP handlers สำหรับ Admin Places CRUD
 */

import type { Response } from "express";
import type { AdminRequest } from "../middlewares/auth.middleware";
import { placeRepository } from "../repositories/place.repository";
import { httpLogger } from "../utils/logger";
import { error, success } from "../utils/response.util";

export class AdminPlaceController {
  /**
   * GET /admin/places/dashboard
   * ดึงสถิติ Places สำหรับ Dashboard
   */
  static async getDashboard(_req: AdminRequest, res: Response) {
    try {
      const stats = await placeRepository.getStats();
      const recentPlaces = await placeRepository.findAllAdmin({ limit: 5 });

      res.json(
        success({
          stats,
          recentPlaces: recentPlaces.data.map((p) => ({
            id: p.id,
            name: p.name,
            place_type: p.place_type,
            cover_image_url: p.cover_image_url,
            category_names: p.category_names,
          })),
        })
      );
    } catch (err) {
      httpLogger.error({ err }, "Failed to fetch places dashboard");
      res.status(500).json(error("Failed to fetch dashboard"));
    }
  }

  /**
   * GET /admin/places
   * ดึงรายการ Places พร้อม pagination และ search
   */
  static async getPlaces(req: AdminRequest, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      const search = req.query.search as string;
      const place_type = req.query.place_type as string;

      const result = await placeRepository.findAllAdmin({
        limit,
        offset,
        search,
        place_type,
      });

      res.json(
        success({
          places: result.data,
          pagination: result.pagination,
        })
      );
    } catch (err) {
      httpLogger.error({ err }, "Failed to fetch admin places");
      res.status(500).json(error("Failed to fetch places"));
    }
  }

  /**
   * GET /admin/places/:id
   * ดึง Place เดียวพร้อม images
   */
  static async getPlace(req: AdminRequest, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const place = await placeRepository.findById(id);

      if (!place) {
        res.status(404).json(error("Place not found"));
        return;
      }

      res.json(success(place));
    } catch (err) {
      httpLogger.error({ err }, "Failed to fetch place");
      res.status(500).json(error("Failed to fetch place"));
    }
  }

  /**
   * POST /admin/places
   * สร้าง Place ใหม่
   */
  static async createPlace(req: AdminRequest, res: Response) {
    try {
      const {
        name,
        place_type,
        description,
        instagram_url,
        latitude,
        longitude,
        google_maps_url,
        cover_image_url,
        categories,
      } = req.body;

      if (!name || !place_type) {
        res.status(400).json(error("Name and place_type are required"));
        return;
      }

      const place = await placeRepository.create({
        name,
        place_type,
        description,
        instagram_url,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        google_maps_url,
        cover_image_url,
        categories,
      });

      res.status(201).json(success(place));
    } catch (err) {
      httpLogger.error({ err }, "Failed to create place");
      res.status(500).json(error("Failed to create place"));
    }
  }

  /**
   * PUT /admin/places/:id
   * อัพเดท Place
   */
  static async updatePlace(req: AdminRequest, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const existing = await placeRepository.findById(id);

      if (!existing) {
        res.status(404).json(error("Place not found"));
        return;
      }

      const {
        name,
        place_type,
        description,
        instagram_url,
        latitude,
        longitude,
        google_maps_url,
        cover_image_url,
        categories,
      } = req.body;

      const place = await placeRepository.update(id, {
        name,
        place_type,
        description,
        instagram_url,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        google_maps_url,
        cover_image_url,
        categories,
      });

      res.json(success(place));
    } catch (err) {
      httpLogger.error({ err }, "Failed to update place");
      res.status(500).json(error("Failed to update place"));
    }
  }

  /**
   * DELETE /admin/places/:id
   * ลบ Place
   */
  static async deletePlace(req: AdminRequest, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const existing = await placeRepository.findById(id);

      if (!existing) {
        res.status(404).json(error("Place not found"));
        return;
      }

      const deleted = await placeRepository.delete(id);

      if (!deleted) {
        res.status(500).json(error("Failed to delete place"));
        return;
      }

      res.json(success({ message: "Place deleted successfully" }));
    } catch (err) {
      httpLogger.error({ err }, "Failed to delete place");
      res.status(500).json(error("Failed to delete place"));
    }
  }
}
