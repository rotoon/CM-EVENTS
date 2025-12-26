import axios from "axios";
import Database from "better-sqlite3";
import * as cheerio from "cheerio";

interface EventData {
  title: string;
  link: string;
  image: string;
  location: string;
  date: string;
  monthWrapped: string; // JSON array of months, e.g. '["2025-09", "2025-10"]'
}

const BASE_URL = "https://www.cmhy.city/events";
const DB_PATH = "events.db";

// Initialize Database
const db = new Database(DB_PATH);

// Create Tables
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
  );

  CREATE TABLE IF NOT EXISTS event_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    is_cover BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(event_id) REFERENCES events(id) ON DELETE CASCADE
  );
`);

const insertStmt = db.prepare(`
  INSERT INTO events (source_url, title, cover_image_url, location, date_text, month_wrapped)
  VALUES (@link, @title, @image, @location, @date, @monthWrapped)
  ON CONFLICT(source_url) DO UPDATE SET
    title = excluded.title,
    cover_image_url = excluded.cover_image_url,
    location = excluded.location,
    date_text = excluded.date_text,
    month_wrapped = excluded.month_wrapped,
    last_updated_at = CURRENT_TIMESTAMP
`);

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
];

function getRandomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

// Thai month names to number (1-12)
const THAI_MONTHS: Record<string, number> = {
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

/**
 * Parse date_text and extract all months as YYYY-MM format
 * Examples:
 * - "18 กันยายน 2568 - 30 ตุลาคม 2568" => ["2025-09", "2025-10"]
 * - "4 ตุลาคม 2568" => ["2025-10"]
 * - "3 ตุลาคม 2568 - 31 ตุลาคม 2568" => ["2025-10"]
 */
function extractMonthsFromDateText(dateText: string): string[] {
  const months: Set<string> = new Set();

  // Pattern: day monthName year (Thai Buddhist Era)
  // e.g., "18 กันยายน 2568" or "30 ตุลาคม 2568"
  const pattern =
    /(\d{1,2})\s+(มกราคม|กุมภาพันธ์|มีนาคม|เมษายน|พฤษภาคม|มิถุนายน|กรกฎาคม|สิงหาคม|กันยายน|ตุลาคม|พฤศจิกายน|ธันวาคม)\s+(\d{4})/g;

  let match;
  while ((match = pattern.exec(dateText)) !== null) {
    const monthName = match[2];
    const buddhistYear = parseInt(match[3]);

    // Convert Buddhist year to Gregorian (BE - 543 = CE)
    const gregorianYear = buddhistYear - 543;
    const monthNum = THAI_MONTHS[monthName];

    if (monthNum) {
      const monthStr = `${gregorianYear}-${String(monthNum).padStart(2, "0")}`;
      months.add(monthStr);
    }
  }

  // If no months found, return empty array
  if (months.size === 0) {
    return [];
  }

  // Sort months chronologically
  return Array.from(months).sort();
}

/**
 * Generate all months between start and end (inclusive)
 * e.g., "2025-09" to "2025-11" => ["2025-09", "2025-10", "2025-11"]
 */
function getMonthsBetween(months: string[]): string[] {
  if (months.length <= 1) return months;

  const start = months[0];
  const end = months[months.length - 1];

  const [startYear, startMonth] = start.split("-").map(Number);
  const [endYear, endMonth] = end.split("-").map(Number);

  const result: string[] = [];
  let year = startYear;
  let month = startMonth;

  while (year < endYear || (year === endYear && month <= endMonth)) {
    result.push(`${year}-${String(month).padStart(2, "0")}`);
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
  }

  return result;
}

// Generate list of months: 2 months before, current, 2 months after
function getTargetMonths(center: Date): string[] {
  const months: string[] = [];
  for (let i = -2; i <= 2; i++) {
    const d = new Date(center);
    d.setMonth(d.getMonth() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    months.push(`${yyyy}-${mm}`);
  }
  return months;
}

async function scrapeMonth(monthStr: string): Promise<EventData[]> {
  const url = `${BASE_URL}/${monthStr}/`;
  const userAgent = getRandomUserAgent();
  console.log(`\n🔍 Scraping: ${url}`);

  try {
    const { data } = await axios.get(url, {
      headers: { "User-Agent": userAgent },
    });

    const $ = cheerio.load(data);
    const events: EventData[] = [];

    $(".card.bg-activity-list").each((_, element) => {
      const card = $(element);
      const title = card.find(".card-title").text().trim();
      const rawLink = card.find("a.stretched-link").attr("href") || "";
      const rawImage = card.find(".card-img-top").attr("src") || "";
      const location = card.find("ul.list-unstyled li").first().text().trim();
      const dateText = card.find(".bi-calendar3-week").parent().text().trim();

      if (title) {
        // Extract months from date_text
        let extractedMonths = extractMonthsFromDateText(dateText);

        // If spanning multiple months, fill in the gaps
        if (extractedMonths.length >= 2) {
          extractedMonths = getMonthsBetween(extractedMonths);
        }

        // Fallback to current scraping month if no months found
        if (extractedMonths.length === 0) {
          extractedMonths = [monthStr];
        }

        events.push({
          title,
          link: rawLink.startsWith("http")
            ? rawLink
            : `https://www.cmhy.city${rawLink}`,
          image: rawImage.startsWith("http")
            ? rawImage
            : `https://www.cmhy.city${rawImage}`,
          location: location.replace(/\s+/g, " "),
          date: dateText.replace(/\s+/g, " "),
          monthWrapped: JSON.stringify(extractedMonths), // Store as JSON array
        });
      }
    });

    console.log(`✅ Found ${events.length} events in ${monthStr}`);
    return events;
  } catch (error: any) {
    console.error(`❌ Error scraping ${monthStr}: ${error.message}`);
    return [];
  }
}

async function main() {
  const months = getTargetMonths(new Date());
  console.log(`📅 Target Months: ${months.join(", ")}`);

  const allEvents: EventData[] = [];

  for (const month of months) {
    const events = await scrapeMonth(month);

    // Save to DB immediately
    const saveTransaction = db.transaction((items: EventData[]) => {
      for (const item of items) insertStmt.run(item);
    });
    saveTransaction(events);

    allEvents.push(...events);
    // Be nice to the server
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log("\n==========================================");
  console.log(`🎉 Total Scraped: ${allEvents.length}`);

  // Verify DB count
  const result = db.prepare("SELECT COUNT(*) as count FROM events").get() as {
    count: number;
  };
  console.log(`💾 Total in SQLite DB: ${result.count}`);

  // Show sample of multi-month events
  const multiMonth = db
    .prepare(
      `
    SELECT title, date_text, month_wrapped 
    FROM events 
    WHERE month_wrapped LIKE '%,%' 
    LIMIT 3
  `
    )
    .all() as { title: string; date_text: string; month_wrapped: string }[];

  if (multiMonth.length > 0) {
    console.log(`\n📆 Sample Multi-Month Events:`);
    for (const e of multiMonth) {
      console.log(`   • ${e.title}`);
      console.log(`     Date: ${e.date_text}`);
      console.log(`     Months: ${e.month_wrapped}`);
    }
  }

  console.log("==========================================\n");
}

main();
