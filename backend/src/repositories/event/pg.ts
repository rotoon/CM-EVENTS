import { getCategoryKeywords } from "../../config/categories";
import pool from "../../config/database";
import { getEndDateTimestamp } from "../../utils/date.util";
import { dbLogger } from "../../utils/logger";

// ============================================================================
// Types
// ============================================================================

export interface EventFilters {
  month?: string;
  category?: string;
  limit?: number;
  offset?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface EventRow {
  id: number;
  source_url: string;
  title: string;
  description: string | null;
  location: string | null;
  date_text: string | null;
  month_wrapped: string | null;
  cover_image_url: string | null;
  time_text: string | null;
  latitude: number | null;
  longitude: number | null;
  google_maps_url: string | null;
  facebook_url: string | null;
  is_ended: boolean;
  is_fully_scraped: boolean;
  description_markdown: string | null;
}

export interface EventImage {
  id: number;
  event_id: number;
  image_url: string;
}

// ============================================================================
// Event Repository
// ============================================================================

export class EventRepository {
  /**
   * Get paginated events with optional filters
   */
  static async findAll(
    filters: EventFilters
  ): Promise<PaginatedResult<EventRow>> {
    const { month, category, limit = 20, offset = 0 } = filters;

    dbLogger.debug({ filters }, "Finding events with filters");

    let query = `
      SELECT * FROM events 
      WHERE is_fully_scraped = TRUE AND description IS NOT NULL
    `;
    const params: (string | number)[] = [];
    let paramIndex = 1;

    if (month) {
      query += ` AND month_wrapped LIKE $${paramIndex}`;
      params.push(`%"${month}"%`);
      paramIndex++;
    }

    if (category) {
      const keywords = getCategoryKeywords(category);
      const conditions = keywords
        .map(
          (_, i) =>
            `(title ILIKE $${paramIndex + i} OR description ILIKE $${
              paramIndex + i
            } OR location ILIKE $${paramIndex + i})`
        )
        .join(" OR ");

      query += ` AND (${conditions})`;
      keywords.forEach((k) => params.push(`%${k}%`));
      paramIndex += keywords.length;
    }

    const client = await pool.connect();
    try {
      const result = await client.query(query, params);
      let events = result.rows as EventRow[];

      // Sort by End Date DESC (Latest first)
      events.sort((a, b) => {
        const endA = getEndDateTimestamp(a.date_text || "");
        const endB = getEndDateTimestamp(b.date_text || "");
        return endB - endA;
      });

      const total = events.length;
      const slicedEvents = events.slice(offset, offset + limit);

      dbLogger.info({ total, returned: slicedEvents.length }, "Events fetched");

      return {
        data: slicedEvents,
        total,
        limit,
        offset,
        hasMore: offset + slicedEvents.length < total,
      };
    } finally {
      client.release();
    }
  }

  /**
   * Find event by ID
   */
  static async findById(id: number): Promise<EventRow | null> {
    dbLogger.debug({ id }, "Finding event by ID");

    const client = await pool.connect();
    try {
      const result = await client.query("SELECT * FROM events WHERE id = $1", [
        id,
      ]);

      if (result.rows.length === 0) {
        dbLogger.warn({ id }, "Event not found");
        return null;
      }

      return result.rows[0] as EventRow;
    } finally {
      client.release();
    }
  }

  /**
   * Get images for an event
   */
  static async findImagesByEventId(eventId: number): Promise<EventImage[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        "SELECT * FROM event_images WHERE event_id = $1",
        [eventId]
      );
      return result.rows as EventImage[];
    } finally {
      client.release();
    }
  }

  /**
   * Search events by query
   */
  static async search(query: string, limit: number = 50): Promise<EventRow[]> {
    dbLogger.debug({ query }, "Searching events");

    const client = await pool.connect();
    try {
      const searchPattern = `%${query}%`;
      const result = await client.query(
        `SELECT * FROM events 
         WHERE (title ILIKE $1 OR description ILIKE $1 OR location ILIKE $1)
         AND is_fully_scraped = TRUE
         ORDER BY id DESC LIMIT $2`,
        [searchPattern, limit]
      );

      dbLogger.info({ query, found: result.rows.length }, "Search completed");
      return result.rows as EventRow[];
    } finally {
      client.release();
    }
  }

  /**
   * Get events for map (with coordinates)
   */
  static async findForMap(): Promise<
    Pick<
      EventRow,
      "id" | "title" | "latitude" | "longitude" | "location" | "cover_image_url"
    >[]
  > {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT id, title, latitude, longitude, location, cover_image_url 
        FROM events
        WHERE latitude IS NOT NULL AND longitude IS NOT NULL
      `);
      return result.rows;
    } finally {
      client.release();
    }
  }

  /**
   * Get upcoming events
   */
  static async findUpcoming(limit: number = 20): Promise<EventRow[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT * FROM events 
         WHERE is_fully_scraped = TRUE
         ORDER BY id DESC LIMIT $1`,
        [limit]
      );
      return result.rows as EventRow[];
    } finally {
      client.release();
    }
  }

  /**
   * Get unique months from all events
   */
  static async findAllMonths(): Promise<string[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT month_wrapped FROM events 
        WHERE month_wrapped IS NOT NULL
      `);

      const THAI_MONTH_TO_INDEX: Record<string, number> = {
        มกราคม: 1,
        กุมภาพันธ์: 2,
        มีนาคม: 3,
        เมษายน: 4,
        พฤษภาคม: 5,
        มิถุนายน: 6,
        กรกฎาคม: 7,
        สิงหาคม: 8,
        กันยายน: 9,
        ตุลาคม: 10,
        พฤศจิกายน: 11,
        ธันวาคม: 12,
      };

      const monthSet = new Set<string>();
      const currentYear = new Date().getFullYear();

      for (const row of result.rows) {
        try {
          const months = JSON.parse(row.month_wrapped) as string[];
          months.forEach((m) => {
            if (/^\d{4}-\d{2}$/.test(m)) {
              monthSet.add(m);
            } else if (THAI_MONTH_TO_INDEX[m]) {
              const monthIndex = THAI_MONTH_TO_INDEX[m];
              monthSet.add(
                `${currentYear}-${String(monthIndex).padStart(2, "0")}`
              );
            }
          });
        } catch {
          const m = row.month_wrapped;
          if (/^\d{4}-\d{2}$/.test(m)) {
            monthSet.add(m);
          } else if (THAI_MONTH_TO_INDEX[m]) {
            const monthIndex = THAI_MONTH_TO_INDEX[m];
            monthSet.add(
              `${currentYear}-${String(monthIndex).padStart(2, "0")}`
            );
          }
        }
      }

      return Array.from(monthSet).sort((a, b) => b.localeCompare(a));
    } finally {
      client.release();
    }
  }

  /**
   * Get event stats
   */
  static async getStats(): Promise<{
    total: number;
    fullyScraped: number;
    pending: number;
  }> {
    dbLogger.debug("Fetching stats");

    const client = await pool.connect();
    try {
      const totalResult = await client.query(
        "SELECT COUNT(*) as count FROM events"
      );
      const scrapedResult = await client.query(
        "SELECT COUNT(*) as count FROM events WHERE is_fully_scraped = TRUE"
      );

      const total = parseInt(totalResult.rows[0].count);
      const fullyScraped = parseInt(scrapedResult.rows[0].count);

      return { total, fullyScraped, pending: total - fullyScraped };
    } finally {
      client.release();
    }
  }
}
