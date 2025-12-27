import axios from "axios";
import * as cheerio from "cheerio";
import db from "../config/database";

interface EventData {
  title: string;
  link: string;
  image: string;
  location: string;
  date: string;
  monthWrapped: string;
}

const BASE_URL = "https://www.cmhy.city/events";

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
];

function getRandomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

async function scrapeEventList(page: number = 1): Promise<EventData[]> {
  const url = `${BASE_URL}?page=${page}`;
  console.log(`\n📄 Scraping page ${page}...`);

  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": getRandomUserAgent(),
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Language": "th-TH,th;q=0.9,en-US;q=0.8,en;q=0.7",
        "Cache-Control": "max-age=0",
        Referer: "https://www.google.com/",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "cross-site",
        "Sec-Fetch-User": "?1",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(data);
    const events: EventData[] = [];

    $("article").each((_, el) => {
      const article = $(el);
      const linkEl = article.find("a").first();
      const imgEl = article.find("img").first();
      const dateEl = article.find(".activity-date");
      const locationEl = article.find(".activity-location");

      const rawLink = linkEl.attr("href") || "";
      const title = linkEl.attr("title") || "";
      const image = imgEl.attr("src") || "";
      const dateRaw = dateEl.text().trim();
      const locationRaw = locationEl.text().trim();

      if (rawLink && title) {
        // Fix relative link
        let fullLink = rawLink.startsWith("http")
          ? rawLink
          : `https://www.cmhy.city${rawLink}`;

        // 🧹 Clean trailing slash for consistency
        fullLink = fullLink.replace(/\/$/, "");

        // Parse Month for wrapping (e.g., "DEC" from date text)
        // Date text format roughly: "12 DEC 2025" or similar
        const monthWrapped = dateRaw.split(" ")[1]?.toUpperCase() || "UNKNOWN";

        events.push({
          title,
          link: fullLink,
          image,
          location: locationRaw,
          date: dateRaw,
          monthWrapped,
        });
      }
    });

    // Logging if no events found
    if (events.length === 0) {
      const pageTitle = $("title").text().trim();
      console.log(`   ⚠️ No events found! Page Title: "${pageTitle}"`);
      // Log body sample to see what we got
      const bodySample =
        $("body").html()?.substring(0, 1000) || "No body content";
      console.log(`   HTML Dump (Body Start): \n${bodySample}`);
    }

    console.log(`   ✅ Found ${events.length} events on page ${page}`);
    return events;
  } catch (error) {
    console.error(`❌ Error scraping page ${page}:`, error);
    if (axios.isAxiosError(error)) {
      console.error(`   Status: ${error.response?.status}`);
      console.error(`   Status Text: ${error.response?.statusText}`);
    }
    return [];
  }
}

export async function runScraper() {
  console.log("\n🚀 Starting scraper...");
  console.log(`📅 Time: ${new Date().toLocaleString("th-TH")}`);

  // Database initialized via import

  // Ensure tables exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_url TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      location TEXT,
      date_text TEXT,
      month_wrapped TEXT,
      cover_image_url TEXT,
      first_scraped_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_fully_scraped BOOLEAN DEFAULT 0
    )
  `);

  let page = 1;
  let totalSaved = 0;
  let hasNext = true;

  while (hasNext) {
    const events = await scrapeEventList(page);
    if (events.length === 0) {
      console.log("🛑 No more events found or error occurred.");
      break;
    }

    const insert = db.prepare(`
      INSERT INTO events (
        title, source_url, cover_image_url, location, date_text, month_wrapped
      ) VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(source_url) DO UPDATE SET
        title = excluded.title,
        cover_image_url = excluded.cover_image_url,
        location = excluded.location,
        date_text = excluded.date_text,
        month_wrapped = excluded.month_wrapped,
        last_updated_at = CURRENT_TIMESTAMP
    `);

    const insertMany = db.transaction((events: EventData[]) => {
      let count = 0;
      for (const event of events) {
        try {
          insert.run(
            event.title,
            event.link,
            event.image,
            event.location,
            event.date,
            event.monthWrapped
          );
          count++;
        } catch (err: unknown) {
          console.error(
            `   ⚠️ Failed to insert: ${event.link}`,
            err instanceof Error ? err.message : String(err)
          );
        }
      }
      return count;
    });

    const savedCount = insertMany(events);
    totalSaved += savedCount;
    console.log(`   💾 Saved/Updated ${savedCount} events from page ${page}`);

    // Limit pages to avoid infinite loop (safety)
    // Adjust max pages as needed
    if (page >= 10 || events.length < 10) {
      hasNext = false;
    } else {
      page++;
      // Sleep slightly to respect server
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.log(
    `\n✨ Scraping completed. Total processed: ${totalSaved} events.`
  );
  return { total: totalSaved };
}
