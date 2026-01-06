import { Router } from "express";
import { AdminPlaceController } from "../controllers/admin-place.controller";
import { AdminController } from "../controllers/admin.controller";
import { requireAdmin } from "../middlewares/auth.middleware";

const router = Router();

// Public route - Login
router.post("/login", AdminController.login);

// Protected routes - require admin authentication
// Events
router.get("/dashboard", requireAdmin, AdminController.getDashboard);
router.get("/events/months", requireAdmin, AdminController.getEventMonths);
router.post(
  "/events/sync-status",
  requireAdmin,
  AdminController.syncEventStatus
);
router.get("/events", requireAdmin, AdminController.getEvents);
router.get("/events/:id", requireAdmin, AdminController.getEvent);
router.post("/events", requireAdmin, AdminController.createEvent);
router.put("/events/:id", requireAdmin, AdminController.updateEvent);
router.delete("/events/:id", requireAdmin, AdminController.deleteEvent);

// Places
router.get(
  "/places/dashboard",
  requireAdmin,
  AdminPlaceController.getDashboard
);
router.get("/places", requireAdmin, AdminPlaceController.getPlaces);
router.get("/places/:id", requireAdmin, AdminPlaceController.getPlace);
router.post("/places", requireAdmin, AdminPlaceController.createPlace);
router.put("/places/:id", requireAdmin, AdminPlaceController.updatePlace);
router.delete("/places/:id", requireAdmin, AdminPlaceController.deletePlace);

export default router;
