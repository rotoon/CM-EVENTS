import { Router } from "express";
import { EventController } from "../controllers/event.controller";
import { ScraperController } from "../controllers/scraper.controller";

const router = Router();

// Event Routes
router.get("/events", EventController.getEvents);
router.get("/events/:id", EventController.getEventById);
router.get("/months", EventController.getMonths);
router.get("/stats", EventController.getStats);
router.get("/search", EventController.searchEvents);
router.get("/upcoming", EventController.getUpcomingEvents);
router.get("/map", EventController.getMapEvents);

// Scraper Routes
router.post("/scrape", ScraperController.triggerScrape);
router.get("/scrape/status", ScraperController.getStatus);

export default router;
