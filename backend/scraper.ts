import axios from "axios";
import Database from "better-sqlite3";

interface EventData {
  title: string;
  link: string;
  image: string;
  location: string;
  date: string;
  monthWrapped: string;
}

const BASE_URL = "https://www.cmhy.city/events";
const DB_PATH = process.env.DB_PATH || "events.db";

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

function extractMonthsFromDateText(dateText: string): string[] {
  const months: Set<string> = new Set();
  const pattern =
    /(\d{1,2})\s+(มกราคม|กุมภาพันธ์|มีนาคม|เมษายน|พฤษภาคม|มิถุนายน|กรกฎาคม|สิงหาคม|กันยายน|ตุลาคม|พฤศจิกายน|ธันวาคม)\s+(\d{4})/g;

  let match;
  while ((match = pattern.exec(dateText)) !== null) {
    const monthName = match[2];
    const buddhistYear = parseInt(match[3]);
    const gregorianYear = buddhistYear - 543;
    const monthNum = THAI_MONTHS[monthName];

    if (monthNum) {
      const monthStr = `${gregorianYear}-${String(monthNum).padStart(2, "0")}`;
      months.add(monthStr);
    }
  }

  if (months.size === 0) return [];
  return Array.from(months).sort();
}

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

    // Use Bun's built-in HTML parser via HTMLRewriter isn't ideal here,
    // so we use a simple regex-based approach for Bun compatibility
    const events: EventData[] = [];

    // Match card blocks
    const cardPattern =
      /<div[^>]*class="[^"]*card bg-activity-list[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/g;
    let cardMatch;

    while ((cardMatch = cardPattern.exec(data)) !== null) {
      const cardHtml = cardMatch[0];

      // Extract title
      const titleMatch = cardHtml.match(
        /<h\d[^>]*class="[^"]*card-title[^"]*"[^>]*>([^<]+)<\/h\d>/
      );
      const title = titleMatch ? titleMatch[1].trim() : "";

      // Extract link
      const linkMatch = cardHtml.match(
        /<a[^>]*class="[^"]*stretched-link[^"]*"[^>]*href="([^"]+)"/
      );
      const rawLink = linkMatch ? linkMatch[1] : "";

      // Extract image
      const imageMatch = cardHtml.match(
        /<img[^>]*class="[^"]*card-img-top[^"]*"[^>]*src="([^"]+)"/
      );
      const rawImage = imageMatch ? imageMatch[1] : "";

      // Extract location (first li)
      const locationMatch = cardHtml.match(
        /<ul[^>]*class="[^"]*list-unstyled[^"]*"[^>]*>[\s\S]*?<li[^>]*>([^<]+)<\/li>/
      );
      const location = locationMatch ? locationMatch[1].trim() : "";

      // Extract date (near bi-calendar3-week icon)
      const dateMatch = cardHtml.match(
        /<i[^>]*class="[^"]*bi-calendar3-week[^"]*"[^>]*><\/i>\s*([^<]+)/
      );
      const dateText = dateMatch ? dateMatch[1].trim() : "";

      if (title) {
        let extractedMonths = extractMonthsFromDateText(dateText);
        if (extractedMonths.length >= 2) {
          extractedMonths = getMonthsBetween(extractedMonths);
        }
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
          monthWrapped: JSON.stringify(extractedMonths),
        });
      }
    }

    console.log(`✅ Found ${events.length} events in ${monthStr}`);
    return events;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`❌ Error scraping ${monthStr}: ${errorMessage}`);
    return [];
  }
}

export async function runScraper(): Promise<{
  totalScraped: number;
  totalInDb: number;
}> {
  console.log("\n🚀 Starting scraper...");
  console.log(`📅 Time: ${new Date().toLocaleString("th-TH")}`);

  const db = new Database(DB_PATH);

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

  const insertStmt = db.prepare(`
    INSERT INTO events (source_url, title, cover_image_url, location, date_text, month_wrapped)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(source_url) DO UPDATE SET
      title = excluded.title,
      cover_image_url = excluded.cover_image_url,
      location = excluded.location,
      date_text = excluded.date_text,
      month_wrapped = excluded.month_wrapped,
      last_updated_at = CURRENT_TIMESTAMP
  `);

  const months = getTargetMonths(new Date());
  console.log(`📅 Target Months: ${months.join(", ")}`);

  let totalScraped = 0;

  for (const month of months) {
    const events = await scrapeMonth(month);

    // Save to DB
    for (const event of events) {
      insertStmt.run(
        event.link,
        event.title,
        event.image,
        event.location,
        event.date,
        event.monthWrapped
      );
    }

    totalScraped += events.length;
    // Be nice to the server
    await new Promise((r) => setTimeout(r, 1000));
  }

  // Get total count
  const result = db.prepare("SELECT COUNT(*) as count FROM events").get() as {
    count: number;
  };

  db.close();

  console.log("\n==========================================");
  console.log(`🎉 Total Scraped: ${totalScraped}`);
  console.log(`💾 Total in SQLite DB: ${result.count}`);
  console.log("==========================================\n");

  return { totalScraped, totalInDb: result.count };
}

// Export for direct run
if (import.meta.main) {
  runScraper();
}
