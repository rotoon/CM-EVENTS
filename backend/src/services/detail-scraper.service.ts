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

function getBrowserHeaders(url: string) {
  const parsedUrl = new URL(url);
  return {
    "User-Agent": getRandomUserAgent(),
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "th-TH,th;q=0.9,en-US;q=0.8,en;q=0.7",
    "Accept-Encoding": "gzip, deflate, br",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    "Sec-Ch-Ua":
      '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"macOS"',
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
    Referer: `${parsedUrl.protocol}//${parsedUrl.host}/`,
  };
}

// ============================================================================
// AI Enhancement (Gemini)
// ============================================================================
async function rewriteDescriptionWithAI(
  model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]>,
  rawHTML: string,
): Promise<string> {
  if (!rawHTML || rawHTML.length < 50) return rawHTML || "";

  try {
    const prompt = `
    Rewrite the following event description into clean, engaging markdown.
    - Extract key details: Highlights, Agenda (if any).
    - Keep it concise but informative.
    - Format with headers, bullet points, and bold text.
    - Remove any "Share this event" or irrelevant footer text.
    - Translate strictly to Thai language if the original is English.
    
    Raw HTML content:
    ${rawHTML.substring(0, 15000)} -- truncated
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
  event: EventDetail,
) {
  scraperLogger.debug(
    { eventId: event.id, url: event.source_url },
    "Scraping detail",
  );

  try {
    const { data } = await axios.get(event.source_url, {
      headers: getBrowserHeaders(event.source_url),
    });

    const $ = cheerio.load(data);

    // 1. JSON-LD Extraction (Best for Lat/Lng)
    let lat: number | null = null;
    let lng: number | null = null;
    const jsonLdContent = $('script[type="application/ld+json"]').html();

    if (jsonLdContent) {
      try {
        const jsonLd = JSON.parse(jsonLdContent);
        if (jsonLd && jsonLd.geo) {
          lat = parseFloat(jsonLd.geo.latitude);
          lng = parseFloat(jsonLd.geo.longitude);
        } else if (jsonLd && Array.isArray(jsonLd)) {
          // Sometimes it's an array
          const eventSchema = jsonLd.find(
            (item: any) =>
              item["@type"] === "Event" && item.location && item.location.geo,
          );
          if (eventSchema) {
            lat = parseFloat(eventSchema.location.geo.latitude);
            lng = parseFloat(eventSchema.location.geo.longitude);
          }
        }
      } catch (e) {
        scraperLogger.warn({ err: e }, "Failed to parse JSON-LD");
      }
    }

    // Fallback: Regex from scripts (L.marker or setView)
    if (!lat || !lng) {
      const scriptContent = $("script").text();
      // Look for L.marker([lat, lng]) or setView([lat, lng])
      const geoMatch = scriptContent.match(/\[([0-9.]+),\s*([0-9.]+)\]/);
      if (geoMatch) {
        lat = parseFloat(geoMatch[1]);
        lng = parseFloat(geoMatch[2]);
      }
    }

    // 2. Metadata (Time, Map, FB)
    let timeText = "";
    // Time is usually in the first ul.list-unstyled inside section.pb-3
    const timeLi = $("section.pb-3 ul.list-unstyled li").filter(
      (_, el) => $(el).find(".bi-calendar3-week").length > 0,
    );
    if (timeLi.length) {
      timeText = timeLi.text().trim().replace(/\s+/g, " "); // Clean excessive whitespace
    }

    const mapLink = $('a[href*="maps.google.com"]').attr("href") || "";
    const facebookLink = $('a[href*="facebook.com"]').attr("href") || "";

    // 3. Description Extraction
    // Logic: Get section.pb-3 text but REMOVE the metadata parts
    const contentSection = $("section.pb-3").clone();

    // Remove known garbage elements from the clone
    contentSection.find("h3").remove(); // Title
    contentSection.find("ul.list-unstyled").remove(); // Metadata (Time, Location, etc.)
    contentSection.find(".activity-image").remove(); // Main Banner
    contentSection.find(".img-fluid").remove(); // Gallery Images
    contentSection.find("#map").remove(); // Map Container
    contentSection.find("script").remove(); // Scripts
    contentSection.find("style").remove(); // Styles

    // What remains should be the description paragraphs
    // Strip HTML comments (<!-- ... -->) that remain after element removal
    const descriptionHtml = (contentSection.html() || "").replace(
      /<!--[\s\S]*?-->/g,
      "",
    );

    const bannerSrc = $("img.activity-image").attr("src") || "";
    const isEnded = /Event has ended|จบกิจกรรมแล้ว/i.test(data);

    // 4. Images Logic
    const BLOCKED_IMAGE_URLS = new Set([
      "https://www.cmhy.city/assets/android/google-play-badge.png",
    ]);

    const imageUrls = new Set<string>();

    // Banner
    if (bannerSrc && !BLOCKED_IMAGE_URLS.has(bannerSrc))
      imageUrls.add(bannerSrc);

    // Gallery (.img-fluid) filtering
    const allImgFluid: string[] = [];
    $("img.img-fluid").each((_, el) => {
      const src = $(el).attr("src") || $(el).attr("data-src");
      if (src && src.startsWith("http") && !BLOCKED_IMAGE_URLS.has(src))
        allImgFluid.push(src);
    });

    if (allImgFluid.length > 3) {
      // Logic: Skip 1st (Banner) and Last 2 (Likely unrelated/promo)
      const galleryImages = allImgFluid.slice(1, -2);
      galleryImages.forEach((src) => imageUrls.add(src));
    } else if (allImgFluid.length > 0) {
      // Fallback if few images found
      allImgFluid.forEach((src) => {
        if (src !== bannerSrc) imageUrls.add(src);
      });
    }

    scraperLogger.debug(
      { eventId: event.id, images: imageUrls.size },
      "Found images",
    );

    const enhancedDescription = await rewriteDescriptionWithAI(
      model,
      descriptionHtml,
    );

    // Update event details using Prisma
    await prisma.events.update({
      where: { id: event.id },
      data: {
        cover_image_url: bannerSrc || undefined,
        description: descriptionHtml
          .replace(/<!--[\s\S]*?-->/g, "")
          .replace(/<[^>]*>?/gm, "")
          .replace(/\s+/g, " ")
          .trim(),
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
      "Detail saved",
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
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

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
    "Detail scrape batch completed",
  );
  return { scraped: totalScraped, remaining };
}

// ============================================================================
// Scraper for specific month
// ============================================================================
export async function runDetailScraperForMonth(
  year: number,
  month: number, // 1-12
  limit: number = 50,
) {
  if (!process.env.GEMINI_API_KEY) {
    scraperLogger.error("Missing GEMINI_API_KEY. Skipping detail scraper.");
    return { scraped: 0, remaining: 0 };
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  scraperLogger.info(
    { startDate, endDate },
    "Running detail scraper for specific month",
  );

  const rows = await prisma.events.findMany({
    where: {
      start_date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { id: "desc" },
    take: limit,
    select: { id: true, source_url: true },
  });

  if (rows.length === 0) {
    scraperLogger.info("No events found for this month");
    return { scraped: 0, count: 0 };
  }

  scraperLogger.info(
    { count: rows.length },
    "Events found for month needing scrape",
  );

  let totalScraped = 0;

  for (const event of rows) {
    // Re-scrape all events in this month (since logic updated)
    const success = await scrapeEventDetail(model, event as EventDetail);
    if (success) {
      totalScraped++;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return { scraped: totalScraped, totalFound: rows.length };
}
