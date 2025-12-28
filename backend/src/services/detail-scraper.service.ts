import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import * as cheerio from "cheerio";
import "dotenv/config";
import prisma from "../lib/prisma";
import { scraperLogger } from "../utils/logger";

// ============================================================================
// Constants
// ============================================================================
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
];

interface EventDetail {
  id: number;
  source_url: string;
}

function getRandomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

// ============================================================================
// AI Enhancement (Gemini)
// ============================================================================
async function rewriteDescriptionWithAI(
  model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]>,
  rawHTML: string
): Promise<string> {
  if (!rawHTML || rawHTML.length < 50) return rawHTML || "";

  try {
    const prompt = `
    Rewrite the following event description into clean, engaging markdown.
    - Extract key details: Highlights, Agenda (if any), Price/Tickets.
    - Keep it concise but informative.
    - Format with headers, bullet points, and bold text.
    - Remove any "Share this event" or irrelevant footer text.
    - Translate strictly to Thai language if the original is English.
    
    Raw HTML content:
    ${rawHTML.substring(0, 8000)} -- truncated
    `;

    const result = await model.generateContent(prompt);
    const markdown = result.response.text().trim();
    return markdown || rawHTML;
  } catch (err: unknown) {
    scraperLogger.warn({ err }, "AI rewrite failed");
    return rawHTML;
  }
}

// ============================================================================
// Scrape Event Detail
// ============================================================================
async function scrapeEventDetail(
  model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]>,
  event: EventDetail
) {
  scraperLogger.debug(
    { eventId: event.id, url: event.source_url },
    "Scraping detail"
  );

  try {
    const { data } = await axios.get(event.source_url, {
      headers: { "User-Agent": getRandomUserAgent() },
    });

    const $ = cheerio.load(data);

    const bannerSrc = $("img.activity-image").attr("src") || "";
    const descriptionHtml =
      $(".activity-description").html() ||
      $(".description").html() ||
      $("article").html() ||
      "";

    const timeText = $(".activity-time").text().trim() || "";
    const mapLink = $('a[href*="google.com/maps"]').attr("href") || "";
    const facebookLink = $('a[href*="facebook.com"]').attr("href") || "";

    let lat: number | null = null;
    let lng: number | null = null;
    const scriptContent = $("script").text();
    const latMatch = scriptContent.match(/lat["']?:\s*([0-9.]+)/);
    const lngMatch = scriptContent.match(/lng["']?:\s*([0-9.]+)/);
    if (latMatch) lat = parseFloat(latMatch[1]);
    if (lngMatch) lng = parseFloat(lngMatch[1]);

    const isEnded = /Event has ended|จบกิจกรรมแล้ว/i.test(data);

    // Collect all image URLs from the page
    const imageUrls = new Set<string>();

    // 1. Banner image
    if (bannerSrc) imageUrls.add(bannerSrc);

    // 2. Gallery images
    $(".gallery img, .event-gallery img, .activity-gallery img").each(
      (_, el) => {
        const src = $(el).attr("src") || $(el).attr("data-src");
        if (src && src.startsWith("http")) imageUrls.add(src);
      }
    );

    // 3. Images inside description
    $(".activity-description img, .description img, article img").each(
      (_, el) => {
        const src = $(el).attr("src") || $(el).attr("data-src");
        if (src && src.startsWith("http")) imageUrls.add(src);
      }
    );

    // 4. Lightbox/carousel images
    $('a[href*=".jpg"], a[href*=".png"], a[href*=".webp"]').each((_, el) => {
      const href = $(el).attr("href");
      if (href && href.startsWith("http")) imageUrls.add(href);
    });

    scraperLogger.debug(
      { eventId: event.id, images: imageUrls.size },
      "Found images"
    );

    const enhancedDescription = await rewriteDescriptionWithAI(
      model,
      descriptionHtml
    );

    // Update event details using Prisma
    await prisma.events.update({
      where: { id: event.id },
      data: {
        cover_image_url: bannerSrc || undefined,
        description: descriptionHtml.replace(/<[^>]*>?/gm, "").trim(),
        description_markdown: enhancedDescription,
        time_text: timeText,
        latitude: lat,
        longitude: lng,
        google_maps_url: mapLink,
        facebook_url: facebookLink,
        is_ended: isEnded,
        is_fully_scraped: true,
        last_updated_at: new Date(),
      },
    });

    // Delete existing images for this event
    await prisma.event_images.deleteMany({
      where: { event_id: event.id },
    });

    // Insert new images
    if (imageUrls.size > 0) {
      await prisma.event_images.createMany({
        data: Array.from(imageUrls).map((url) => ({
          event_id: event.id,
          image_url: url,
        })),
      });
    }

    scraperLogger.info(
      { eventId: event.id, images: imageUrls.size },
      "Detail saved"
    );

    return true;
  } catch (err: unknown) {
    scraperLogger.error({ err, eventId: event.id }, "Failed to scrape detail");
    return false;
  }
}

// ============================================================================
// Main Runner
// ============================================================================
export async function runDetailScraper(limit: number = 10) {
  if (!process.env.GEMINI_API_KEY) {
    scraperLogger.error("Missing GEMINI_API_KEY. Skipping detail scraper.");
    return { scraped: 0, remaining: 0 };
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const rows = await prisma.events.findMany({
    where: { is_fully_scraped: false },
    orderBy: { id: "desc" },
    take: limit,
    select: { id: true, source_url: true },
  });

  if (rows.length === 0) {
    scraperLogger.info("All events have been fully scraped");
    return { scraped: 0, remaining: 0 };
  }

  scraperLogger.info({ count: rows.length }, "Events needing detail scraping");

  let totalScraped = 0;

  for (const event of rows) {
    const success = await scrapeEventDetail(model, event as EventDetail);
    if (success) {
      totalScraped++;
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  const remaining = await prisma.events.count({
    where: { is_fully_scraped: false },
  });

  scraperLogger.info(
    { scraped: totalScraped, remaining },
    "Detail scrape batch completed"
  );
  return { scraped: totalScraped, remaining };
}
