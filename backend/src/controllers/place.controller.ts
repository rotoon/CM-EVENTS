/**
 * Place Controller
 * API handlers สำหรับ Places
 */

import type { Request, Response } from "express";
import { placeRepository } from "../repositories/place.repository";
import type { PlaceFilters } from "../types/place.interface";
import { errorResponse, successResponse } from "../utils/response.util";

export const placeController = {
  /**
   * GET /places
   * ดึงรายการ places พร้อม pagination และ filters
   */
  async getPlaces(req: Request, res: Response) {
    try {
      const filters: PlaceFilters = {
        place_type: req.query.place_type as string | undefined,
        category: req.query.category as string | undefined,
        search: req.query.search as string | undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
      };

      const result = await placeRepository.findMany(filters);

      return successResponse(res, result, "Places retrieved successfully");
    } catch (error) {
      console.error("Error fetching places:", error);
      return errorResponse(res, "Failed to fetch places", 500);
    }
  },

  /**
   * GET /places/:id
   * ดึง place ตาม ID
   */
  async getPlaceById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return errorResponse(res, "Invalid place ID", 400);
      }

      const place = await placeRepository.findById(id);

      if (!place) {
        return errorResponse(res, "Place not found", 404);
      }

      return successResponse(res, place, "Place retrieved successfully");
    } catch (error) {
      console.error("Error fetching place:", error);
      return errorResponse(res, "Failed to fetch place", 500);
    }
  },

  /**
   * GET /places/categories
   * ดึง categories ทั้งหมดพร้อมจำนวน
   * @query place_type - (optional) filter categories เฉพาะ place_type นี้
   */
  async getCategories(req: Request, res: Response) {
    try {
      const place_type = req.query.place_type as string | undefined;
      const categories = await placeRepository.getCategories(place_type);
      return successResponse(
        res,
        categories,
        "Categories retrieved successfully"
      );
    } catch (error) {
      console.error("Error fetching categories:", error);
      return errorResponse(res, "Failed to fetch categories", 500);
    }
  },

  /**
   * GET /places/types
   * ดึง place types พร้อมจำนวน
   */
  async getPlaceTypes(_req: Request, res: Response) {
    try {
      const types = await placeRepository.getPlaceTypes();
      return successResponse(res, types, "Place types retrieved successfully");
    } catch (error) {
      console.error("Error fetching place types:", error);
      return errorResponse(res, "Failed to fetch place types", 500);
    }
  },

  /**
   * GET /places/search
   * ค้นหา places
   */
  async searchPlaces(req: Request, res: Response) {
    try {
      const query = req.query.q as string;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      if (!query || query.trim().length === 0) {
        return errorResponse(res, "Search query is required", 400);
      }

      const results = await placeRepository.search(query, limit);
      return successResponse(res, results, "Search completed");
    } catch (error) {
      console.error("Error searching places:", error);
      return errorResponse(res, "Failed to search places", 500);
    }
  },
};
