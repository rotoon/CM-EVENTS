import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import Database from "better-sqlite3";
import * as cheerio from "cheerio";
import "dotenv/config";

const DB_PATH = "events.db";
const db = new Database(DB_PATH);

// ============================================================================
// Initialize Gemini AI
// ============================================================================
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// ============================================================================
// Add new columns if not exist (ignore errors if columns already exist)
// ============================================================================
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
    db.exec(sql);
  } catch {
    // Column already exists, ignore
  }
}

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
// AI Rewrite Description to Markdown
// ============================================================================
async function rewriteToMarkdown(rawDescription: string): Promise<string> {
  if (!rawDescription || rawDescription.length < 20) {
    return rawDescription;
  }

  try {
    const prompt = `คุณคือผู้ช่วยจัดรูปแบบข้อความ ให้แปลงข้อความต่อไปนี้เป็น Markdown ที่อ่านง่าย:

1. ใช้หัวข้อ (##, ###) ถ้าเหมาะสม
2. ใช้ bullet points (-) สำหรับรายการ
3. ใช้ **bold** สำหรับคำสำคัญ
4. เก็บข้อมูลวันที่ เวลา สถานที่ให้ครบ
5. ตอบเป็น Markdown เท่านั้น ไม่ต้องมีคำอธิบายเพิ่มเติม
6. เขียนเป็นภาษาไทย

ข้อความ:
${rawDescription}`;

    const result = await model.generateContent(prompt);
    const markdown = result.response.text().trim();
    return markdown || rawDescription;
  } catch (error: any) {
    console.log(`   ⚠️ AI rewrite failed: ${error.message}`);
    return rawDescription;
  }
}

// ============================================================================
// Prepared Statements
// ============================================================================
const updateEventStmt = db.prepare(`
    UPDATE events 
    SET 
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
`);

const insertImageStmt = db.prepare(`
    INSERT INTO event_images (event_id, image_url)
    VALUES (?, ?)
`);

// ============================================================================
// Scrape Event Detail
// ============================================================================
async function scrapeEventDetail(event: EventDetail) {
  console.log(`\n🔍 Scraping Detail [${event.id}]: ${event.source_url}`);

  try {
    const { data } = await axios.get(event.source_url, {
      headers: { "User-Agent": getRandomUserAgent() },
    });

    const $ = cheerio.load(data);

    // 1. Banner Image (Best Quality)
    const bannerSrc = $("img.activity-image").attr("src") || "";
    const bannerUrl = bannerSrc.startsWith("http")
      ? bannerSrc
      : bannerSrc
      ? `https://www.cmhy.city${bannerSrc}`
      : null;

    // 2. Description - get all paragraphs in main content
    const description = $("section.pb-3 p, .activity-content p")
      .map((_, el) => $(el).text().trim())
      .get()
      .filter((text) => text.length > 0)
      .join("\n\n")
      .trim();

    // 3. AI Rewrite to Markdown
    console.log(`   🤖 Rewriting description with AI...`);
    const descriptionMarkdown = await rewriteToMarkdown(description);

    // 4. Time - look for time pattern (XX:XX น. or XX:XX – XX:XX)
    const timeText =
      $("body")
        .text()
        .match(/\d{1,2}[:.]\d{2}\s*[–-]\s*\d{1,2}[:.]\d{2}\s*น?\.?/)?.[0] ||
      $(".bi-clock").parent().text().trim() ||
      null;

    // 5. GPS Coordinates from Google Maps link
    let latitude: number | null = null;
    let longitude: number | null = null;
    let googleMapsUrl: string | null = null;

    // Look for Google Maps link
    $(
      "a[href*='maps.google.com'], a[href*='google.com/maps'], a[href*='maps.app.goo.gl']"
    ).each((_, el) => {
      const href = $(el).attr("href") || "";
      googleMapsUrl = href;

      // Extract coordinates from URL like ?q=18.7871676,99.0070297
      const coordMatch = href.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
      if (coordMatch) {
        latitude = parseFloat(coordMatch[1]);
        longitude = parseFloat(coordMatch[2]);
      }
    });

    // Also check for coordinates in onclick or data attributes
    if (!latitude) {
      const bodyText = $("body").text();
      const coordMatch = bodyText.match(
        /(\d{1,2}\.\d{4,}),\s*(\d{2,3}\.\d{4,})/
      );
      if (coordMatch) {
        latitude = parseFloat(coordMatch[1]);
        longitude = parseFloat(coordMatch[2]);
      }
    }

    // 6. Facebook URL
    let facebookUrl: string | null = null;
    $("a[href*='facebook.com']").each((_, el) => {
      const href = $(el).attr("href") || "";
      if (href.includes("facebook.com") && !href.includes("sharer")) {
        facebookUrl = href;
        return false; // break
      }
    });

    // 7. Check if event has ended (look for badge/status)
    const isEnded =
      $("body").text().includes("สิ้นสุดแล้ว") ||
      $(".badge").text().includes("สิ้นสุด")
        ? 1
        : 0;

    // 8. Gallery Images
    const galleryImages: string[] = [];
    $("section img, .activity-content img, .gallery img").each((_, el) => {
      const src = $(el).attr("src") || "";
      // Filter out junk
      if (
        src &&
        !$(el).hasClass("activity-image") &&
        !src.includes("tile.openstreetmap.org") &&
        !src.includes("/assets/") &&
        !src.includes("icon") &&
        !src.includes("logo")
      ) {
        const fullUrl = src.startsWith("http")
          ? src
          : `https://www.cmhy.city${src}`;
        if (!galleryImages.includes(fullUrl)) {
          galleryImages.push(fullUrl);
        }
      }
    });

    // 9. Update Database Transaction
    const saveTransaction = db.transaction(() => {
      updateEventStmt.run(
        bannerUrl,
        description,
        descriptionMarkdown,
        timeText,
        latitude,
        longitude,
        googleMapsUrl,
        facebookUrl,
        isEnded,
        event.id
      );

      // Insert Gallery Images
      for (const imgUrl of galleryImages) {
        try {
          insertImageStmt.run(event.id, imgUrl);
        } catch {
          // Ignore duplicate images
        }
      }
    });

    saveTransaction();

    // Log results
    console.log(`✅ Updated Event #${event.id}`);
    console.log(
      `   📝 Description: ${description.length} chars → Markdown: ${descriptionMarkdown.length} chars`
    );
    console.log(`   🕐 Time: ${timeText || "N/A"}`);
    console.log(`   📍 GPS: ${latitude ? `${latitude}, ${longitude}` : "N/A"}`);
    console.log(`   🔗 Facebook: ${facebookUrl ? "Yes" : "No"}`);
    console.log(`   📸 Gallery: ${galleryImages.length} images`);
    console.log(`   🏁 Ended: ${isEnded ? "Yes" : "No"}`);
  } catch (error: any) {
    console.error(
      `❌ Error scraping detail for ${event.source_url}: ${error.message}`
    );
  }
}

// ============================================================================
// Main
// ============================================================================
async function main() {
  console.log("🚀 Starting Detail Scraper with Gemini AI...\n");

  if (!process.env.GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY not found in .env file!");
    process.exit(1);
  }

  let batchNumber = 1;

  while (true) {
    // Select events that haven't been scraped yet (batch of 10 at a time for rate limiting)
    const rows = db
      .prepare(
        "SELECT id, source_url FROM events WHERE is_fully_scraped = 0 LIMIT 10"
      )
      .all() as EventDetail[];

    if (rows.length === 0) {
      console.log("\n🎉 All events have been fully scraped!");
      break;
    }

    console.log(
      `\n📦 Batch ${batchNumber}: Processing ${rows.length} events...`
    );

    for (const row of rows) {
      await scrapeEventDetail(row);
      // Be nice to the server and Gemini rate limit - 2-4 seconds delay
      const delay = Math.floor(Math.random() * 2000) + 2000;
      await new Promise((r) => setTimeout(r, delay));
    }

    const remaining = db
      .prepare(
        "SELECT COUNT(*) as count FROM events WHERE is_fully_scraped = 0"
      )
      .get() as { count: number };

    console.log(
      `\n✅ Batch ${batchNumber} Complete. Remaining: ${remaining.count}`
    );
    batchNumber++;

    // Pause between batches for rate limiting
    if (remaining.count > 0) {
      console.log("⏳ Pausing 3 seconds before next batch...");
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  // Final stats
  const total = db
    .prepare("SELECT COUNT(*) as count FROM events WHERE is_fully_scraped = 1")
    .get() as { count: number };
  const images = db
    .prepare("SELECT COUNT(*) as count FROM event_images")
    .get() as { count: number };
  const withGps = db
    .prepare("SELECT COUNT(*) as count FROM events WHERE latitude IS NOT NULL")
    .get() as { count: number };
  const withFb = db
    .prepare(
      "SELECT COUNT(*) as count FROM events WHERE facebook_url IS NOT NULL"
    )
    .get() as { count: number };
  const withMd = db
    .prepare(
      "SELECT COUNT(*) as count FROM events WHERE description_markdown IS NOT NULL"
    )
    .get() as { count: number };

  console.log("\n==========================================");
  console.log(`📊 Final Stats:`);
  console.log(`   - Fully Scraped Events: ${total.count}`);
  console.log(`   - Events with Markdown: ${withMd.count}`);
  console.log(`   - Events with GPS: ${withGps.count}`);
  console.log(`   - Events with Facebook: ${withFb.count}`);
  console.log(`   - Total Gallery Images: ${images.count}`);
  console.log("==========================================\n");
}

main();
