import { Request, Response } from "express";
import pool from "../config/database";
import { error, success } from "../utils/response.util";

import { getEndDateTimestamp } from "../utils/date.util";

import { CATEGORIES, getCategoryKeywords } from "../config/categories";

export class EventController {
  static async getCategories(req: Request, res: Response) {
    res.json(success(CATEGORIES));
  }

  static async getEvents(req: Request, res: Response) {
    try {
      const { month, category, limit = "20", offset = "0" } = req.query;
      const limitNum = Number(limit);
      const offsetNum = Number(offset);

      let query = `
        SELECT * FROM events 
        WHERE is_fully_scraped = TRUE AND description IS NOT NULL
      `;
      const params: (string | number)[] = [];
      let paramIndex = 1;

      if (month && typeof month === "string") {
        query += ` AND month_wrapped LIKE $${paramIndex}`;
        params.push(`%"${month}"%`);
        paramIndex++;
      }

      if (category && typeof category === "string") {
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

      // No ORDER BY or LIMIT in SQL - we sort in memory

      const client = await pool.connect();
      try {
        const result = await client.query(query, params);
        let events = result.rows;

        // Sort by End Date DESC (Latest first)
        events.sort((a, b) => {
          const endA = getEndDateTimestamp(a.date_text);
          const endB = getEndDateTimestamp(b.date_text);
          return endB - endA;
        });

        const total = events.length;
        const slicedEvents = events.slice(offsetNum, offsetNum + limitNum);

        const mappedEvents = slicedEvents.map((e) => ({
          ...e,
          image: e.cover_image_url,
        }));

        res.json(
          success({
            events: mappedEvents,
            pagination: {
              total: total,
              limit: limitNum,
              offset: offsetNum,
              hasMore: offsetNum + slicedEvents.length < total,
            },
          })
        );
      } finally {
        client.release();
      }
    } catch (err) {
      console.error(err);
      res.status(500).json(error("Failed to fetch events"));
    }
  }

  static async getEventById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const client = await pool.connect();
      try {
        const result = await client.query(
          "SELECT * FROM events WHERE id = $1",
          [id]
        );

        if (result.rows.length === 0) {
          res.status(404).json(error("Event not found"));
          return;
        }

        const event = result.rows[0];
        res.json(
          success({
            ...event,
            image: event.cover_image_url,
          })
        );
      } finally {
        client.release();
      }
    } catch (err) {
      console.error(err);
      res.status(500).json(error("Failed to fetch event"));
    }
  }

  static async getMonths(req: Request, res: Response) {
    try {
      const client = await pool.connect();
      try {
        const result = await client.query(`
          SELECT month_wrapped FROM events 
          WHERE month_wrapped IS NOT NULL
        `);

        // Extract unique months from all JSON arrays
        const monthSet = new Set<string>();
        for (const row of result.rows) {
          try {
            const months = JSON.parse(row.month_wrapped) as string[];
            months.forEach((m) => monthSet.add(m));
          } catch {
            if (row.month_wrapped) {
              monthSet.add(row.month_wrapped);
            }
          }
        }

        // Sort descending
        const sortedMonths = Array.from(monthSet).sort((a, b) =>
          b.localeCompare(a)
        );

        res.json(success(sortedMonths));
      } finally {
        client.release();
      }
    } catch (err) {
      console.error(err);
      res.status(500).json(error("Failed to fetch months"));
    }
  }

  static async getStats(req: Request, res: Response) {
    try {
      console.log("Debug: Fetching stats...");
      const client = await pool.connect();
      console.log("Debug: Pool connected for stats");
      try {
        const totalResult = await client.query(
          "SELECT COUNT(*) as count FROM events"
        );
        const scrapedResult = await client.query(
          "SELECT COUNT(*) as count FROM events WHERE is_fully_scraped = TRUE"
        );

        const total = parseInt(totalResult.rows[0].count);
        const fullyScraped = parseInt(scrapedResult.rows[0].count);

        res.json(
          success({
            total,
            fullyScraped,
            pending: total - fullyScraped,
          })
        );
      } finally {
        client.release();
      }
    } catch (err) {
      console.error(err);
      res.status(500).json(error("Failed to fetch stats"));
    }
  }

  static async searchEvents(req: Request, res: Response) {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") {
        res.status(400).json(error("Query parameter 'q' is required"));
        return;
      }

      const client = await pool.connect();
      try {
        const searchPattern = `%${q}%`;
        const result = await client.query(
          `SELECT * FROM events 
           WHERE (title ILIKE $1 OR description ILIKE $1 OR location ILIKE $1)
           AND is_fully_scraped = TRUE
           ORDER BY id DESC LIMIT 50`,
          [searchPattern]
        );

        res.json(
          success(
            result.rows.map((e) => ({
              ...e,
              image: e.cover_image_url,
            }))
          )
        );
      } finally {
        client.release();
      }
    } catch (err) {
      console.error(err);
      res.status(500).json(error("Search failed"));
    }
  }

  static async getUpcomingEvents(req: Request, res: Response) {
    try {
      const client = await pool.connect();
      try {
        const result = await client.query(`
          SELECT * FROM events 
          WHERE is_fully_scraped = TRUE
          ORDER BY id DESC LIMIT 20
        `);

        res.json(
          success(
            result.rows.map((e) => ({
              ...e,
              image: e.cover_image_url,
            }))
          )
        );
      } finally {
        client.release();
      }
    } catch (err) {
      console.error(err);
      res.status(500).json(error("Failed to fetch upcoming events"));
    }
  }

  static async getMapEvents(req: Request, res: Response) {
    try {
      const client = await pool.connect();
      try {
        const result = await client.query(`
          SELECT id, title, latitude, longitude, location, cover_image_url 
          FROM events
          WHERE latitude IS NOT NULL AND longitude IS NOT NULL
        `);
        res.json(success(result.rows));
      } finally {
        client.release();
      }
    } catch {
      res.json(success([]));
    }
  }
}
