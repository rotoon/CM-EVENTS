/**
 * Event Repository using Prisma ORM
 *
 * NOTE: This file is for future use when Prisma v7 + Express compatibility is resolved.
 * Currently using pg pool version: event.repository.ts
 *
 * To switch to Prisma:
 * 1. Rename event.repository.ts to event.repository.pg.ts
 * 2. Rename this file to event.repository.ts
 */

import { getCategoryKeywords } from "../../config/categories";
import prisma, { event_images, events } from "../../lib/prisma";
import { dbLogger } from "../../utils/logger";

// ============================================================================
// Types (re-export from Prisma)
// ============================================================================

export type EventRow = events;
export type EventImage = event_images;

export interface EventFilters {
  month?: string;
  category?: string;
  limit?: number;
  offset?: number;
  is_ended?: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

// ============================================================================
// Event Repository (Prisma)
// ============================================================================

export class EventRepository {
  /**
   * Get paginated events with optional filters
   */
  static async findAll(
    filters: EventFilters
  ): Promise<PaginatedResult<EventRow>> {
    const { month, category, is_ended, limit = 20, offset = 0 } = filters;

    dbLogger.debug({ filters }, "Finding events with filters");

    // Build where conditions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereConditions: any = {
      is_fully_scraped: true,
      description: { not: null },
    };

    // Filter by ended status if provided
    if (is_ended !== undefined) {
      whereConditions.is_ended = is_ended;
    }

    // Month filter
    if (month) {
      whereConditions.month_wrapped = { contains: `"${month}"` };
    }

    // Category filter (keyword search)
    if (category) {
      const keywords = getCategoryKeywords(category);
      whereConditions.OR = keywords.flatMap((keyword) => [
        { title: { contains: keyword, mode: "insensitive" } },
        { description: { contains: keyword, mode: "insensitive" } },
        { location: { contains: keyword, mode: "insensitive" } },
      ]);
    }

    // Count total matching events
    const total = await prisma.events.count({
      where: whereConditions,
    });

    // Fetch paginated events sorted by end_date DESC (latest end date first)
    const eventsList = await prisma.events.findMany({
      where: whereConditions,
      orderBy: { end_date: { sort: "desc", nulls: "last" } },
      skip: offset,
      take: limit,
    });

    dbLogger.info({ total, returned: eventsList.length }, "Events fetched");

    return {
      data: eventsList,
      total,
      limit,
      offset,
      hasMore: offset + eventsList.length < total,
    };
  }

  /**
   * Find event by ID
   */
  static async findById(id: number): Promise<EventRow | null> {
    dbLogger.debug({ id }, "Finding event by ID");

    const event = await prisma.events.findUnique({
      where: { id },
    });

    if (!event) {
      dbLogger.warn({ id }, "Event not found");
    }

    return event;
  }

  /**
   * Get images for an event
   */
  static async findImagesByEventId(eventId: number): Promise<EventImage[]> {
    return prisma.event_images.findMany({
      where: { event_id: eventId },
    });
  }

  /**
   * Search events by query
   */
  static async search(query: string, limit: number = 50): Promise<EventRow[]> {
    dbLogger.debug({ query }, "Searching events");

    const eventsList = await prisma.events.findMany({
      where: {
        is_fully_scraped: true,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { location: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: { id: "desc" },
      take: limit,
    });

    dbLogger.info({ query, found: eventsList.length }, "Search completed");
    return eventsList;
  }

  /**
   * Get events for map (with coordinates)
   */
  static async findForMap() {
    return prisma.events.findMany({
      where: {
        latitude: { not: null },
        longitude: { not: null },
      },
      select: {
        id: true,
        title: true,
        latitude: true,
        longitude: true,
        location: true,
        cover_image_url: true,
      },
    });
  }

  /**
   * Get upcoming events
   */
  static async findUpcoming(limit: number = 20): Promise<EventRow[]> {
    return prisma.events.findMany({
      where: { is_fully_scraped: true },
      orderBy: { id: "desc" },
      take: limit,
    });
  }

  /**
   * Get unique months from all events
   */
  static async findAllMonths(): Promise<string[]> {
    const results = await prisma.events.findMany({
      where: { month_wrapped: { not: null } },
      select: { month_wrapped: true },
    });

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

    for (const row of results) {
      try {
        const months = JSON.parse(row.month_wrapped!) as string[];
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
        const m = row.month_wrapped!;
        if (/^\d{4}-\d{2}$/.test(m)) {
          monthSet.add(m);
        } else if (THAI_MONTH_TO_INDEX[m]) {
          const monthIndex = THAI_MONTH_TO_INDEX[m];
          monthSet.add(`${currentYear}-${String(monthIndex).padStart(2, "0")}`);
        }
      }
    }

    return Array.from(monthSet).sort((a, b) => b.localeCompare(a));
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

    const [total, fullyScraped] = await Promise.all([
      prisma.events.count(),
      prisma.events.count({ where: { is_fully_scraped: true } }),
    ]);

    return { total, fullyScraped, pending: total - fullyScraped };
  }

  // ============================================================================
  // Write Operations (for scrapers)
  // ============================================================================

  /**
   * Upsert event (insert or update)
   */
  static async upsert(data: {
    sourceUrl: string;
    title: string;
    coverImageUrl?: string;
    location?: string;
    dateText?: string;
    monthWrapped?: string;
  }) {
    return prisma.events.upsert({
      where: { source_url: data.sourceUrl },
      update: {
        title: data.title,
        cover_image_url: data.coverImageUrl,
        location: data.location,
        date_text: data.dateText,
        month_wrapped: data.monthWrapped,
        last_updated_at: new Date(),
      },
      create: {
        source_url: data.sourceUrl,
        title: data.title,
        cover_image_url: data.coverImageUrl,
        location: data.location,
        date_text: data.dateText,
        month_wrapped: data.monthWrapped,
      },
    });
  }

  /**
   * Update event details (for detail scraper)
   */
  static async updateDetails(
    id: number,
    data: {
      coverImageUrl?: string;
      description?: string;
      descriptionMarkdown?: string;
      timeText?: string;
      latitude?: number;
      longitude?: number;
      googleMapsUrl?: string;
      facebookUrl?: string;
      isEnded?: boolean;
    }
  ) {
    return prisma.events.update({
      where: { id },
      data: {
        cover_image_url: data.coverImageUrl,
        description: data.description,
        description_markdown: data.descriptionMarkdown,
        time_text: data.timeText,
        latitude: data.latitude,
        longitude: data.longitude,
        google_maps_url: data.googleMapsUrl,
        facebook_url: data.facebookUrl,
        is_ended: data.isEnded,
        is_fully_scraped: true,
        last_updated_at: new Date(),
      },
    });
  }

  /**
   * Get events that need detail scraping
   */
  static async findPendingScrape(limit: number = 10) {
    return prisma.events.findMany({
      where: { is_fully_scraped: false },
      orderBy: { id: "desc" },
      take: limit,
      select: { id: true, source_url: true },
    });
  }

  /**
   * Delete all images for an event
   */
  static async deleteImagesByEventId(eventId: number) {
    return prisma.event_images.deleteMany({
      where: { event_id: eventId },
    });
  }

  /**
   * Create multiple images
   */
  static async createImages(eventId: number, imageUrls: string[]) {
    return prisma.event_images.createMany({
      data: imageUrls.map((url) => ({
        event_id: eventId,
        image_url: url,
      })),
    });
  }
  /**
   * Sync event status (mark past events as ended)
   */
  static async syncEventStatus() {
    const now = new Date();
    // Using raw query or updateMany if supported fully.
    // Logic: update events where end_date < now AND (is_ended = false OR is_ended is null)
    const result = await prisma.events.updateMany({
      where: {
        end_date: { lt: now },
        OR: [{ is_ended: false }, { is_ended: null }],
      },
      data: {
        is_ended: true,
      },
    });

    return result.count;
  }
}
