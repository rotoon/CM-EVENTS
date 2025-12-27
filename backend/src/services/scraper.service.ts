import axios from "axios";
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
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      },
      timeout: 10000,
    });

    const events: EventData[] = [];
    const regex =
      /<article[^>]*>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*title="([^"]+)"[\s\S]*?<img[^>]*src="([^"]+)"[\s\S]*?<div[^>]*class="activity-date"[^>]*>([\s\S]*?)<\/div>[\s\S]*?<div[^>]*class="activity-location"[^>]*>([\s\S]*?)<\/div>/g;

    let match;
    while ((match = regex.exec(data)) !== null) {
      const [_, link, title, image, dateRaw, locationRaw] = match;

      // Fix relative link
      let fullLink = link.startsWith("http")
        ? link
        : `https://www.cmhy.city${link}`;

      // 🧹 Clean trailing slash for consistency
      fullLink = fullLink.replace(/\/$/, "");

      // Clean text
      const cleanTitle = title.trim();
      const cleanLocation = locationRaw.replace(/<[^>]*>/g, "").trim();
      const cleanDate = dateRaw.replace(/<[^>]*>/g, "").trim();

      // Parse Month for wrapping (e.g., "DEC" from date text)
      const monthWrapped = cleanDate.split(" ")[1]?.toUpperCase() || "UNKNOWN";

      events.push({
        title: cleanTitle,
        link: fullLink,
        image: image,
        location: cleanLocation,
        date: cleanDate,
        monthWrapped,
      });
    }

    // Attempt to extract next page number if exists
    const hasNextPage = /class="next_page"/i.test(data);

    if (events.length === 0) {
      console.log("   ⚠️ No events found using Regex!");
      // console.log(`   HTML Dump: ${data.substring(0, 500)}`);
    }

    console.log(`   ✅ Found ${events.length} events on page ${page}`);
    return events;
  } catch (error) {
    console.error(`❌ Error scraping page ${page}:`, error);
    return [];
  }
}

export async function runScraper() {
  console.log("\n🚀 Starting scraper (Original Regex Version)...");
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
