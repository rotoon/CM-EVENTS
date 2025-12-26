import { cors } from "@elysiajs/cors";
import { Database } from "bun:sqlite";
import { Elysia, t } from "elysia";

// ============================================================================
// Database Connection (using Bun's built-in SQLite)
// ============================================================================
const db = new Database("events.db", { readonly: true });

// ============================================================================
// Types
// ============================================================================
interface Event {
  id: number;
  source_url: string;
  title: string;
  description: string | null;
  description_markdown: string | null;
  location: string | null;
  date_text: string | null;
  time_text: string | null;
  month_wrapped: string | null;
  cover_image_url: string | null;
  latitude: number | null;
  longitude: number | null;
  google_maps_url: string | null;
  facebook_url: string | null;
  is_ended: number | null;
  first_scraped_at: string | null;
  last_updated_at: string | null;
  is_fully_scraped: number | null;
}

interface EventImage {
  id: number;
  event_id: number;
  image_url: string;
  is_cover: number | null;
  created_at: string | null;
}

// ============================================================================
// Helper: Parse month_wrapped JSON array
// ============================================================================
function parseMonthWrapped(monthWrapped: string | null): string[] {
  if (!monthWrapped) return [];
  try {
    const parsed = JSON.parse(monthWrapped);
    return Array.isArray(parsed) ? parsed : [monthWrapped];
  } catch {
    return [monthWrapped];
  }
}

// ============================================================================
// Helper: Parse Thai date for sorting
// ============================================================================
const THAI_MONTHS: Record<string, number> = {
  มกราคม: 0,
  กุมภาพันธ์: 1,
  มีนาคม: 2,
  เมษายน: 3,
  พฤษภาคม: 4,
  มิถุนายน: 5,
  กรกฎาคม: 6,
  สิงหาคม: 7,
  กันยายน: 8,
  ตุลาคม: 9,
  พฤศจิกายน: 10,
  ธันวาคม: 11,
};

function parseThaiDate(dateStr: string): number | null {
  const pattern =
    /(\d{1,2})\s+(มกราคม|กุมภาพันธ์|มีนาคม|เมษายน|พฤษภาคม|มิถุนายน|กรกฎาคม|สิงหาคม|กันยายน|ตุลาคม|พฤศจิกายน|ธันวาคม)\s+(\d{4})/;
  const match = dateStr.match(pattern);

  if (!match) return null;

  const day = parseInt(match[1]);
  const monthName = match[2];
  const buddhistYear = parseInt(match[3]);

  const month = THAI_MONTHS[monthName];
  const gregorianYear = buddhistYear - 543;

  return new Date(gregorianYear, month, day).getTime();
}

function getEndDateTimestamp(dateText: string | null): number {
  if (!dateText) return 0;
  const parts = dateText.split(/\s*[-–]\s*/);
  const endDateStr = parts[parts.length - 1];
  return parseThaiDate(endDateStr) || 0;
}

function sortByEndDate(events: Event[]): Event[] {
  return [...events].sort((a, b) => {
    const endA = getEndDateTimestamp(a.date_text);
    const endB = getEndDateTimestamp(b.date_text);
    return endB - endA; // Farthest end date first
  });
}

// ============================================================================
// API Server
// ============================================================================
const app = new Elysia()
  .use(cors())

  // GET / - API Info
  .get("/", () => ({
    name: "CM Events API",
    version: "1.0.0",
    endpoints: [
      "GET /events",
      "GET /events/:id",
      "GET /months",
      "GET /stats",
      "GET /search",
      "GET /upcoming",
      "GET /map",
    ],
  }))

  // GET /events - ดึง events ทั้งหมด (with pagination, sorted by end date)
  .get(
    "/events",
    ({ query }) => {
      const { month, page = "1", limit = "20" } = query;

      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // Max 100 per page

      // Build WHERE clause
      let whereSql = "";
      const whereParams: (string | number | null)[] = [];

      if (month) {
        whereSql = ` WHERE month_wrapped LIKE ?`;
        whereParams.push(`%"${month}"%`);
      }

      // Get all matching events (for sorting)
      const dataSql = `SELECT * FROM events${whereSql}`;
      const stmt = db.prepare(dataSql);
      const allEvents = stmt.all(...whereParams) as Event[];

      // Sort by end date (farthest end date first)
      const sortedEvents = sortByEndDate(allEvents);

      // Apply pagination after sorting
      const total = sortedEvents.length;
      const totalPages = Math.ceil(total / limitNum);
      const offset = (pageNum - 1) * limitNum;
      const paginatedEvents = sortedEvents.slice(offset, offset + limitNum);

      return {
        data: paginatedEvents,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1,
        },
      };
    },
    {
      query: t.Object({
        month: t.Optional(t.String()),
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
      }),
    }
  )

  // GET /events/:id - ดึง event ตาม ID พร้อม images
  .get(
    "/events/:id",
    ({ params: { id } }) => {
      const eventStmt = db.prepare("SELECT * FROM events WHERE id = ?");
      const event = eventStmt.get(parseInt(id)) as Event | undefined;

      if (!event) {
        return { error: "Event not found", status: 404 };
      }

      const imagesStmt = db.prepare(
        "SELECT * FROM event_images WHERE event_id = ?"
      );
      const images = imagesStmt.all(parseInt(id)) as EventImage[];

      return { data: { ...event, images } };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )

  // GET /months - ดึงรายการเดือนที่มี events
  .get("/months", () => {
    const stmt = db.prepare(
      "SELECT month_wrapped FROM events WHERE month_wrapped IS NOT NULL"
    );
    const results = stmt.all() as { month_wrapped: string }[];

    const monthSet = new Set<string>();
    for (const row of results) {
      const months = parseMonthWrapped(row.month_wrapped);
      months.forEach((m) => monthSet.add(m));
    }

    return { data: Array.from(monthSet).sort().reverse() };
  })

  // GET /stats - ดึงสถิติ events
  .get("/stats", () => {
    // Total events
    const totalStmt = db.prepare("SELECT COUNT(*) as count FROM events");
    const totalResult = totalStmt.get() as { count: number };

    // Events by month
    const monthStmt = db.prepare(
      "SELECT month_wrapped FROM events WHERE month_wrapped IS NOT NULL"
    );
    const monthResults = monthStmt.all() as { month_wrapped: string }[];

    const monthCounts: Record<string, number> = {};
    for (const row of monthResults) {
      const months = parseMonthWrapped(row.month_wrapped);
      for (const m of months) {
        monthCounts[m] = (monthCounts[m] || 0) + 1;
      }
    }
    const eventsByMonth = Object.entries(monthCounts)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => b.month.localeCompare(a.month));

    // Top locations
    const locationStmt = db.prepare(
      "SELECT location, COUNT(*) as count FROM events WHERE location IS NOT NULL AND location != '' GROUP BY location ORDER BY count DESC LIMIT 10"
    );
    const locations = locationStmt.all() as {
      location: string;
      count: number;
    }[];

    // With GPS
    const gpsStmt = db.prepare(
      "SELECT COUNT(*) as count FROM events WHERE latitude IS NOT NULL"
    );
    const gpsResult = gpsStmt.get() as { count: number };

    // With Facebook
    const fbStmt = db.prepare(
      "SELECT COUNT(*) as count FROM events WHERE facebook_url IS NOT NULL"
    );
    const fbResult = fbStmt.get() as { count: number };

    return {
      data: {
        totalEvents: totalResult.count,
        eventsWithGPS: gpsResult.count,
        eventsWithFacebook: fbResult.count,
        eventsByMonth,
        topLocations: locations,
      },
    };
  })

  // GET /search - ค้นหา events
  .get(
    "/search",
    ({ query }) => {
      const { q, limit = "20" } = query;

      if (!q || q.length < 2) {
        return { data: [], message: "Query must be at least 2 characters" };
      }

      const searchTerm = `%${q}%`;
      const stmt = db.prepare(
        "SELECT * FROM events WHERE title LIKE ? OR description LIKE ? OR location LIKE ? ORDER BY id DESC LIMIT ?"
      );
      const events = stmt.all(
        searchTerm,
        searchTerm,
        searchTerm,
        parseInt(limit)
      ) as Event[];

      return { data: events };
    },
    {
      query: t.Object({
        q: t.Optional(t.String()),
        limit: t.Optional(t.String()),
      }),
    }
  )

  // GET /upcoming - ดึง events ที่ยังไม่สิ้นสุด
  .get("/upcoming", () => {
    const stmt = db.prepare(
      "SELECT * FROM events WHERE is_ended = 0 ORDER BY id DESC"
    );
    const events = stmt.all() as Event[];
    return { data: events };
  })

  // GET /map - ดึง events ที่มี GPS
  .get("/map", () => {
    const stmt = db.prepare(
      "SELECT id, title, location, latitude, longitude, cover_image_url, date_text FROM events WHERE latitude IS NOT NULL AND longitude IS NOT NULL"
    );
    const events = stmt.all() as Partial<Event>[];
    return { data: events };
  })

  .listen(3001);

console.log(`
🦊 Events API is running at http://localhost:${app.server?.port}

📚 Endpoints:
   GET /               - API Info
   GET /events         - ดึง events (?month=2025-12&limit=20&offset=0)
   GET /events/:id     - ดึง event ตาม ID พร้อม images
   GET /months         - ดึงรายการเดือนที่มี events
   GET /stats          - ดึงสถิติ events
   GET /search         - ค้นหา events (?q=Christmas)
   GET /upcoming       - ดึง events ที่ยังไม่สิ้นสุด
   GET /map            - ดึง events ที่มี GPS coordinates
`);
