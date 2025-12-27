import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import { type Database as DatabaseType } from "better-sqlite3";
import * as cheerio from "cheerio";
import "dotenv/config";
import db from "./src/config/database";

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
  description_markdown?: string | null;
  description?: string;
  is_fully_scraped: boolean | number;
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
  // If too short, skip
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
  dbInstance: DatabaseType,
  model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]>,
  event: EventDetail
) {
  console.log(`\n🔍 Scraping Detail [${event.id}]: ${event.source_url}`);

  try {
    const { data } = await axios.get(event.source_url, {
      headers: { "User-Agent": getRandomUserAgent() },
    });

    const $ = cheerio.load(data);

    // 1. Banner Image (Best Quality)
    const bannerSrc = $("img.activity-image").attr("src") || "";

    // 2. Full Description (HTML)
    const descriptionHtml =
      $(".activity-description").html() ||
      $(".description").html() ||
      $("article").html() ||
      "";

    // 3. Extract Metadata (Time, Coordinates, Maps)
    const timeText = $(".activity-time").text().trim() || "";
    // Attempt to find map link
    const mapLink = $('a[href*="google.com/maps"]').attr("href") || "";
    const facebookLink = $('a[href*="facebook.com"]').attr("href") || "";

    // Coordinates (sometimes in scripts or data attributes - basic check)
    let lat: number | null = null;
    let lng: number | null = null;
    const scriptContent = $("script").text();
    const latMatch = scriptContent.match(/lat["']?:\s*([0-9.]+)/);
    const lngMatch = scriptContent.match(/lng["']?:\s*([0-9.]+)/);
    if (latMatch) lat = parseFloat(latMatch[1]);
    if (lngMatch) lng = parseFloat(lngMatch[1]);

    // Check if event is ended (basic logic: date passed)
    // For now, trust the scraper listing logic, but flag if "Event Ended" text found
    const isEnded = /Event has ended|จบกิจกรรมแล้ว/i.test(data);

    // 4. AI Process Description
    const enhancedDescription = await rewriteDescriptionWithAI(
      model,
      descriptionHtml
    );

    // 5. Update Database using proper instance
    dbInstance
      .prepare(
        `
      UPDATE events SET 
        cover_image_url = COALESCE(?, cover_image_url),
        description = ?,
        description_markdown = ?,
        time_text = ?,
        latitude = ?,
        longitude = ?,
        google_maps_url = ?,
        facebook_url = ?,
        is_ended = ?,
        is_fully_scraped = 1,
        last_updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `
      )
      .run(
        bannerSrc,
        descriptionHtml.replace(/<[^>]*>?/gm, "").trim(), // Plain text backup
        enhancedDescription,
        timeText,
        lat,
        lng,
        mapLink,
        facebookLink,
        isEnded ? 1 : 0,
        event.id
      );

    console.log(`   ✅ Detail updated successfully.`);
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

  // db imported from config
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Ensure columns exist (Idempotent ALTERS)
  const alterStatements = [
    `ALTER TABLE events ADD COLUMN time_text TEXT;`,
    `ALTER TABLE events ADD COLUMN latitude REAL;`,
    `ALTER TABLE events ADD COLUMN longitude REAL;`,
    `ALTER TABLE events ADD COLUMN google_maps_url TEXT;`,
    `ALTER TABLE events ADD COLUMN facebook_url TEXT;`,
    `ALTER TABLE events ADD COLUMN is_ended BOOLEAN DEFAULT 0;`,
    `ALTER TABLE events ADD COLUMN description_markdown TEXT;`,
  ];

  for (const sql of alterStatements) {
    try {
      db.prepare(sql).run();
    } catch {
      // Column already exists, ignore
    }
  }

  let totalScraped = 0;

  // Select events that haven't been scraped yet (batch size at a time for rate limiting)
  const rows = db
    .prepare(
      `SELECT id, source_url, description_markdown, description, is_fully_scraped 
       FROM events 
       WHERE is_fully_scraped = 0 
       ORDER BY id DESC 
       LIMIT ?`
    )
    .all(limit) as EventDetail[];

  if (rows.length === 0) {
    console.log("🎉 All events have been fully scraped.");
    return { scraped: 0, remaining: 0 };
  }

  console.log(`\n📚 Found ${rows.length} events needing detail scraping...`);

  for (const event of rows) {
    const success = await scrapeEventDetail(db, model, event);
    if (success) {
      totalScraped++;
    }
    // Sleep to respect rate limits
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  // Check remaining count
  const remaining = db
    .prepare("SELECT COUNT(*) as count FROM events WHERE is_fully_scraped = 0")
    .get() as { count: number };

  console.log(
    `\n✨ Batch completed. Scraped: ${totalScraped}, Pending: ${remaining.count}`
  );
  return { scraped: totalScraped, remaining: remaining.count };
}
