import cors from "cors";
import express from "express";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";
import { apiLimiter } from "./middlewares/rate-limiter.middleware";
import routes from "./routes";
import { CronService } from "./services/cron.service";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(apiLimiter);

// Health Check (before routes, no rate limiting)
app.get("/health", (req, res) => {
  res.json({
    success: true,
    data: {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
});

// Routes
app.use("/", routes);

// Base Route
app.get("/", (req, res) => {
  res.json({
    name: "CM Events API",
    version: "1.0.0",
    status: "running",
    tech: "Node.js + Express + PostgreSQL",
    endpoints: [
      "/health",
      "/events",
      "/events/:id",
      "/months",
      "/stats",
      "/search",
      "/upcoming",
      "/map",
      "/places",
      "/places/:id",
      "/places/categories",
      "/places/types",
      "/places/search",
      "/scrape/status",
      "/admin/login",
      "/admin/dashboard",
      "/admin/events",
    ],
  });
});

// Error Handlers (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize Cron Job
CronService.initCronJob();

export default app;
