import Database from "better-sqlite3";
import cors from "cors";
import express, { type Request, type Response } from "express";
import { runDetailScraper } from "../detail-scraper";
import { runScraper } from "../scraper";

// ============================================================================
// Cron Job: Scrape every 12 hours (at 00:00 and 12:00)
// ============================================================================
const TWELVE_HOURS = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

let lastScrapeTime: Date | null = null;
let isScraperRunning = false;
let lastDetailScrapeTime: Date | null = null;

async function scheduledScrape() {
  if (isScraperRunning) {
    console.log("⏳ Scraper is already running, skipping...");
    return;
  }

  try {
    isScraperRunning = true;

    // Step 1: Scrape event list
    console.log("\n⏰ Scheduled scrape starting...");
    const listResult = await runScraper();
    lastScrapeTime = new Date();
    console.log(
      `✅ List scrape completed at ${lastScrapeTime.toLocaleString("th-TH")}`
    );

    // Step 2: Scrape event details (batch of 10)
    console.log("📚 Starting detail scrape...");
    const detailResult = await runDetailScraper(10);
    lastDetailScrapeTime = new Date();
    console.log(
      `✅ Detail scrape completed at ${lastDetailScrapeTime.toLocaleString(
        "th-TH"
      )}`
    );
    console.log(
      `   Scraped: ${detailResult.scraped}, Remaining: ${detailResult.remaining}`
    );

    return { list: listResult, detail: detailResult };
  } catch (error) {
    console.error("❌ Scheduled scrape failed:", error);
  } finally {
    isScraperRunning = false;
  }
}

// Initial scheduled run (check every minute)
setInterval(() => {
  const now = new Date();
  if (
    (now.getHours() === 0 || now.getHours() === 12) &&
    now.getMinutes() === 0
  ) {
    scheduledScrape();
  }
}, 60 * 1000);

console.log(`\n📅 Cron scheduled: Scraper will run every 12 hours`);
console.log(`   - List scraper: scrape event listings`);
console.log(`   - Detail scraper: scrape event details with AI (10 per batch)`);

// ============================================================================
// Database Connection (using better-sqlite3)
// ============================================================================
const DB_PATH = process.env.DB_PATH || "events.db";
const db = new Database(DB_PATH, { readonly: true });

// ============================================================================
// Types
// ============================================================================
interface EventRow {
  id: number;
  title: string;
  source_url: string;
  image: string;
  location: string;
  date_text: string;
  month_wrapped: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  latitude?: number;
  longitude?: number;
  facebook_url?: string;
  gallery_images?: string; // JSON string
  is_fully_scraped: number;
}

// ============================================================================
// Express App Setup
// ============================================================================
const app = express();
app.use(cors());
app.use(express.json());

// Helper for success response
const success = (data: any = null, message = "Success") => ({
  success: true,
  message,
  data,
  timestamp: new Date().toISOString(),
});

// Helper for error response
const error = (message = "Internal Server Error") => ({
  success: false,
  message,
  timestamp: new Date().toISOString(),
});

// GET / - API Info
app.get("/", (req: Request, res: Response) => {
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

// GET /events - Get filtered events
app.get("/events", (req: Request, res: Response) => {
  try {
    const { month, limit = "20", offset = "0" } = req.query;
    const limitNum = Number(limit);
    const offsetNum = Number(offset);

    let query =
      "SELECT * FROM events WHERE is_fully_scraped = 1 AND description IS NOT NULL";
    const params: any[] = [];

    if (month && typeof month === "string") {
      query += " AND month_wrapped = ?";
      params.push(month);
    }

    query += " ORDER BY month_wrapped DESC, id DESC LIMIT ? OFFSET ?";
    params.push(limitNum, offsetNum);

    // Count query
    let countQuery =
      "SELECT COUNT(*) as count FROM events WHERE is_fully_scraped = 1 AND description IS NOT NULL";
    const countParams: any[] = [];

    if (month && typeof month === "string") {
      countQuery += " AND month_wrapped = ?";
      countParams.push(month);
    }

    const { count } = db.prepare(countQuery).get(...countParams) as {
      count: number;
    };
    const events = db.prepare(query).all(...params) as EventRow[];

    // Parse JSON fields
    const parsedEvents = events.map((e) => ({
      ...e,
      gallery_images: e.gallery_images ? JSON.parse(e.gallery_images) : [],
    }));

    res.json(
      success({
        events: parsedEvents,
        pagination: {
          total: count,
          limit: limitNum,
          offset: offsetNum,
          hasMore: offsetNum + events.length < count,
        },
      })
    );
  } catch (err) {
    console.error(err);
    res.status(500).json(error("Failed to fetch events"));
  }
});

// GET /events/:id - Get single event
app.get("/events/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = db.prepare("SELECT * FROM events WHERE id = ?").get(id) as
      | EventRow
      | undefined;

    if (!event) {
      res.status(404).json(error("Event not found"));
      return;
    }

    res.json(
      success({
        ...event,
        gallery_images: event.gallery_images
          ? JSON.parse(event.gallery_images)
          : [],
      })
    );
  } catch (err) {
    console.error(err);
    res.status(500).json(error("Failed to fetch event"));
  }
});

// GET /months - Get available months
app.get("/months", (req: Request, res: Response) => {
  try {
    const months = db
      .prepare(
        `SELECT DISTINCT month_wrapped FROM events 
         WHERE month_wrapped IS NOT NULL 
         ORDER BY month_wrapped DESC`
      )
      .all() as { month_wrapped: string }[];

    res.json(success(months.map((m) => m.month_wrapped)));
  } catch (err) {
    console.error(err);
    res.status(500).json(error("Failed to fetch months"));
  }
});

// GET /stats - Get statistics
app.get("/stats", (req: Request, res: Response) => {
  try {
    const totalEvents = db
      .prepare("SELECT COUNT(*) as count FROM events")
      .get() as { count: number };
    const scrapedEvents = db
      .prepare(
        "SELECT COUNT(*) as count FROM events WHERE is_fully_scraped = 1"
      )
      .get() as { count: number };

    res.json(
      success({
        total: totalEvents.count,
        fullyScraped: scrapedEvents.count,
        pending: totalEvents.count - scrapedEvents.count,
      })
    );
  } catch (err) {
    console.error(err);
    res.status(500).json(error("Failed to fetch stats"));
  }
});

// GET /search - Search events
app.get("/search", (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== "string") {
      res.status(400).json(error("Query parameter 'q' is required"));
      return;
    }

    const events = db
      .prepare(
        `SELECT * FROM events 
         WHERE (title LIKE ? OR description LIKE ? OR location LIKE ?)
         AND is_fully_scraped = 1
         ORDER BY id DESC LIMIT 50`
      )
      .all(`%${q}%`, `%${q}%`, `%${q}%`) as EventRow[];

    res.json(
      success(
        events.map((e) => ({
          ...e,
          gallery_images: e.gallery_images ? JSON.parse(e.gallery_images) : [],
        }))
      )
    );
  } catch (err) {
    console.error(err);
    res.status(500).json(error("Search failed"));
  }
});

// GET /upcoming - Get upcoming events
app.get("/upcoming", (req: Request, res: Response) => {
  try {
    // Simple logic: return latest 20 fully scraped events
    const events = db
      .prepare(
        `SELECT * FROM events 
         WHERE is_fully_scraped = 1
         ORDER BY month_wrapped DESC, id DESC LIMIT 20`
      )
      .all() as EventRow[];

    res.json(
      success(
        events.map((e) => ({
          ...e,
          gallery_images: e.gallery_images ? JSON.parse(e.gallery_images) : [],
        }))
      )
    );
  } catch (err) {
    console.error(err);
    res.status(500).json(error("Failed to fetch upcoming events"));
  }
});

// GET /map - Get events with coordinates
app.get("/map", (req: Request, res: Response) => {
  try {
    const events = db
      .prepare(
        `SELECT id, title, latitude, longitude, location, cover_image_url 
         FROM events
         WHERE latitude IS NOT NULL AND longitude IS NOT NULL`
      )
      .all();
    res.json(success(events));
  } catch (err) {
    // If table doesn't have lat/long columns yet, return empty list
    res.json(success([]));
  }
});

// POST /scrape - Trigger manual scrape
app.post("/scrape", async (req: Request, res: Response) => {
  if (isScraperRunning) {
    res.status(409).json(error("Scraper is already running"));
    return;
  }

  // Run in background
  scheduledScrape();

  res.json(
    success(
      {
        startedAt: new Date().toISOString(),
      },
      "Scraper started in background"
    )
  );
});

// GET /scrape/status - Get scraper status
app.get("/scrape/status", (req: Request, res: Response) => {
  res.json(
    success({
      isRunning: isScraperRunning,
      lastScrapeTime: lastScrapeTime?.toISOString() || null,
      nextScheduledRun: lastScrapeTime
        ? new Date(lastScrapeTime.getTime() + TWELVE_HOURS).toISOString()
        : null,
      intervalHours: 12,
    })
  );
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`
🦊 Events API is running at http://localhost:${PORT}

📚 Endpoints:
   GET  /               - API Info
   GET  /events         - List events
   GET  /events/:id     - Get event detail
   GET  /months         - List months
   GET  /stats          - Statistics
   GET  /search         - Search
   GET  /upcoming       - Upcoming events
   POST /scrape         - Trigger scrape
   GET  /scrape/status  - Scraper status
`);
});
