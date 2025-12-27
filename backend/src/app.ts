import cors from "cors";
import express from "express";
import routes from "./routes";
import { CronService } from "./services/cron.service";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/", routes);

// Base Route
app.get("/", (req, res) => {
  res.json({
    name: "CM Events API",
    version: "1.0.0",
    status: "running",
    tech: "Node.js + Express + SQLite",
    endpoints: [
      "/events",
      "/events/:id",
      "/months",
      "/stats",
      "/search",
      "/upcoming",
      "/map",
      "/scrape/status",
    ],
  });
});

// Initialize Cron Job
CronService.initCronJob();

export default app;
