/**
 * Place Routes
 * API routes สำหรับ Places
 */

import { Router } from "express";
import { placeController } from "../controllers/place.controller";

const router = Router();

// GET /places/categories - ดึง categories ทั้งหมด (ต้องอยู่ก่อน /:id)
router.get("/categories", placeController.getCategories);

// GET /places/types - ดึง place types ทั้งหมด
router.get("/types", placeController.getPlaceTypes);

// GET /places/search - ค้นหา places
router.get("/search", placeController.searchPlaces);

// GET /places - ดึงรายการ places
router.get("/", placeController.getPlaces);

// GET /places/:id - ดึง place ตาม ID
router.get("/:id", placeController.getPlaceById);

export default router;
