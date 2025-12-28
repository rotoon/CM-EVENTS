import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { GeminiService } from "../services/gemini.service";
import { PerplexityService } from "../services/perplexity.service";
import { ITripPlannerService } from "../types/trip-planner.interface";
import { error, success } from "../utils/response.util";

const getTripService = (): ITripPlannerService => {
  const provider = process.env.TRIP_PLANNER_PROVIDER || "perplexity";
  console.log(`Using Trip Planner Provider: ${provider}`);
  if (provider === "gemini") {
    return new GeminiService();
  }
  return new PerplexityService();
};

export class TripController {
  static async planTrip(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, days, travelerProfile } = req.body;

      // 1. Basic Validation
      if (!startDate || !days || !travelerProfile) {
        res
          .status(400)
          .json(
            error("Missing required fields: startDate, days, travelerProfile")
          );
        return;
      }

      // 2. Fetch Active Events from DB
      console.time("DB:FetchEvents");
      const activeEvents = await prisma.events.findMany({
        where: {
          is_ended: false,
        },
        select: {
          id: true,
          title: true,
          location: true,
          date_text: true,
          time_text: true,
          latitude: true,
          longitude: true,
          google_maps_url: true,
          source_url: true,
          cover_image_url: true,
          is_ended: true,
          description: true,
        },
        take: 20, // Limit to avoid blowing up context window
      });
      console.timeEnd("DB:FetchEvents");

      // Map to cleaner interface for AI
      const localEventsForAI = activeEvents.map((e: any) => ({
        id: e.id,
        title: e.title,
        location: e.location,
        dateText: e.date_text,
        timeText: e.time_text,
        latitude: e.latitude,
        longitude: e.longitude,
        // Exclude URLs to save tokens and speed up AI inference.
        // We will hydrate them back in step 4.
        // googleMapsUrl: e.google_maps_url,
        // sourceUrl: e.source_url,
        // coverImageUrl: e.cover_image_url,
        isEnded: e.is_ended,
      }));

      // 3. Call AI Service
      console.time("AI:GenerateItinerary");
      const tripService = getTripService();
      const criteria = { startDate, days, travelerProfile };
      const itinerary = await tripService.generateItinerary(
        criteria,
        localEventsForAI
      );
      console.timeEnd("AI:GenerateItinerary");

      // 4. Post-Process Strategy: Override / Enrich from DB
      if (itinerary.days && Array.isArray(itinerary.days)) {
        for (const day of itinerary.days) {
          if (day.items && Array.isArray(day.items)) {
            for (const item of day.items) {
              if (
                item.place &&
                item.place.isFromHiveDatabase &&
                item.place.eventId
              ) {
                const dbEvent = activeEvents.find(
                  (e: any) => e.id === item.place.eventId
                );
                if (dbEvent) {
                  // Override critical fields to ensure truth
                  item.place.title = dbEvent.title;
                  item.place.locationText =
                    dbEvent.location || item.place.locationText;
                  item.place.latitude = dbEvent.latitude || item.place.latitude;
                  item.place.longitude =
                    dbEvent.longitude || item.place.longitude;
                  item.place.googleMapsUrl =
                    dbEvent.google_maps_url || item.place.googleMapsUrl;
                  item.place.coverImageUrl =
                    dbEvent.cover_image_url || item.place.coverImageUrl;
                }
              }
            }
          }
        }
      }

      res.json(success(itinerary, "Trip itinerary generated successfully"));
    } catch (err) {
      console.error("Plan Trip Error:", err);
      res.status(500).json(error("Failed to generate trip itinerary"));
    }
  }
}
