import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import * as cheerio from "cheerio";
import "dotenv/config";
import pool from "../config/database";

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
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.log(`   ⚠️ AI rewrite failed: ${errorMessage}`);
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
  console.log(`\n🔍 Scraping Detail [${event.id}]: ${event.source_url}`);

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

    // 2. Gallery images (common selectors)
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

    console.log(`   📷 Found ${imageUrls.size} images`);

    const enhancedDescription = await rewriteDescriptionWithAI(
      model,
      descriptionHtml
    );

    const client = await pool.connect();
    try {
      // Update event details
      await client.query(
        `UPDATE events SET 
          cover_image_url = COALESCE($1, cover_image_url),
          description = $2,
          description_markdown = $3,
          time_text = $4,
          latitude = $5,
          longitude = $6,
          google_maps_url = $7,
          facebook_url = $8,
          is_ended = $9,
          is_fully_scraped = TRUE,
          last_updated_at = CURRENT_TIMESTAMP
        WHERE id = $10`,
        [
          bannerSrc,
          descriptionHtml.replace(/<[^>]*>?/gm, "").trim(),
          enhancedDescription,
          timeText,
          lat,
          lng,
          mapLink,
          facebookLink,
          isEnded,
          event.id,
        ]
      );

      // Delete existing images for this event (to avoid duplicates on re-scrape)
      await client.query(`DELETE FROM event_images WHERE event_id = $1`, [
        event.id,
      ]);

      // Insert new images
      for (const imageUrl of imageUrls) {
        await client.query(
          `INSERT INTO event_images (event_id, image_url) VALUES ($1, $2)`,
          [event.id, imageUrl]
        );
      }

      console.log(`   ✅ Detail + ${imageUrls.size} images saved.`);
    } finally {
      client.release();
    }

    return true;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`   ❌ Failed to scrape detail: ${errorMessage}`);
    return false;
  }
}

// ============================================================================
// Main Runner
// ============================================================================
export async function runDetailScraper(limit: number = 10) {
  if (!process.env.GEMINI_API_KEY) {
    console.error("❌ Missing GEMINI_API_KEY. Skipping detail scraper.");
    return { scraped: 0, remaining: 0 };
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const client = await pool.connect();

  try {
    const result = await client.query(
      `SELECT id, source_url 
       FROM events 
       WHERE is_fully_scraped = FALSE 
       ORDER BY id DESC 
       LIMIT $1`,
      [limit]
    );

    const rows = result.rows as EventDetail[];

    if (rows.length === 0) {
      console.log("🎉 All events have been fully scraped.");
      return { scraped: 0, remaining: 0 };
    }

    console.log(`\n📚 Found ${rows.length} events needing detail scraping...`);

    let totalScraped = 0;

    for (const event of rows) {
      const success = await scrapeEventDetail(model, event);
      if (success) {
        totalScraped++;
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    const remainingResult = await client.query(
      "SELECT COUNT(*) as count FROM events WHERE is_fully_scraped = FALSE"
    );
    const remaining = parseInt(remainingResult.rows[0].count);

    console.log(
      `\n✨ Batch completed. Scraped: ${totalScraped}, Pending: ${remaining}`
    );
    return { scraped: totalScraped, remaining };
  } finally {
    client.release();
  }
}
