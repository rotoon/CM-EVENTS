import { Request, Response } from "express";
import db from "../config/database";
import { EventRow } from "../types";
import { error, success } from "../utils/response.util";

export class EventController {
  static async getEvents(req: Request, res: Response) {
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

      const mappedEvents = events.map((e) => ({
        ...e,
        image: e.cover_image_url,
      }));

      res.json(
        success({
          events: mappedEvents,
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
  }

  static async getEventById(req: Request, res: Response) {
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
          image: event.cover_image_url,
        })
      );
    } catch (err) {
      console.error(err);
      res.status(500).json(error("Failed to fetch event"));
    }
  }

  static async getMonths(req: Request, res: Response) {
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
  }

  static async getStats(req: Request, res: Response) {
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
  }

  static async searchEvents(req: Request, res: Response) {
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
            image: e.cover_image_url,
          }))
        )
      );
    } catch (err) {
      console.error(err);
      res.status(500).json(error("Search failed"));
    }
  }

  static async getUpcomingEvents(req: Request, res: Response) {
    try {
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
            image: e.cover_image_url,
          }))
        )
      );
    } catch (err) {
      console.error(err);
      res.status(500).json(error("Failed to fetch upcoming events"));
    }
  }

  static async getMapEvents(req: Request, res: Response) {
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
      res.json(success([]));
    }
  }
}
