import axios from "axios";
import * as cheerio from "cheerio";
import pool from "../config/database";
import { extractYearMonthsFromThaiDate } from "../utils/date.util";

interface EventData {
  title: string;
  link: string;
  image: string;
  location: string;
  date: string;
  monthWrapped: string; // JSON array of YYYY-MM strings
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

    const addEvent = (
      title: string,
      rawLink: string,
      image: string,
      locationRaw: string,
      dateRaw: string
    ) => {
      if (rawLink && title) {
        let fullLink = rawLink.startsWith("http")
          ? rawLink
          : `https://www.cmhy.city${rawLink}`;
        fullLink = fullLink.replace(/\/$/, "");

        // Extract all YYYY-MM from the date text (handles date ranges)
        const months = extractYearMonthsFromThaiDate(dateRaw);
        const monthWrapped =
          months.length > 0 ? JSON.stringify(months) : '["UNKNOWN"]';

        if (!events.some((e) => e.link === fullLink)) {
          events.push({
            title,
            link: fullLink,
            image,
            location: locationRaw,
            date: dateRaw,
            monthWrapped,
          });
        }
      }
    };

    // Strategy 1: Article
    $("article").each((_, el) => {
      const article = $(el);
      const linkEl = article.find("a").first();
      const imgEl = article.find("img").first();
      const dateEl = article.find(".activity-date");
      const locationEl = article.find(".activity-location");

      addEvent(
        linkEl.attr("title") || "",
        linkEl.attr("href") || "",
        imgEl.attr("src") || "",
        locationEl.text().trim(),
        dateEl.text().trim()
      );
    });

    // Strategy 2: Bootstrap Card
    $(".card.bg-activity-list").each((_, el) => {
      const card = $(el);
      const title = card.find(".card-title").text().trim();
      const rawLink = card.find("a.stretched-link").attr("href") || "";
      const image = card.find(".card-img-top").attr("src") || "";
      const location = card.find("ul.list-unstyled li").first().text().trim();
      const dateText = card.find(".bi-calendar3-week").parent().text().trim();

      addEvent(title, rawLink, image, location, dateText);
    });

    console.log(`   ✅ Found ${events.length} events on page ${page}`);
    return events;
  } catch (error) {
    console.error(`❌ Error scraping page ${page}:`, error);
    return [];
  }
}

export async function runScraper() {
  console.log("\n🚀 Starting scraper...");
  console.log(`📅 Time: ${new Date().toLocaleString("th-TH")}`);

  const client = await pool.connect();

  try {
    let page = 1;
    let totalSaved = 0;
    let hasNext = true;

    while (hasNext) {
      const events = await scrapeEventList(page);
      if (events.length === 0) {
        console.log("🛑 No more events found or error occurred.");
        break;
      }

      for (const event of events) {
        try {
          await client.query(
            `INSERT INTO events (title, source_url, cover_image_url, location, date_text, month_wrapped)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (source_url) DO UPDATE SET
               title = EXCLUDED.title,
               cover_image_url = EXCLUDED.cover_image_url,
               location = EXCLUDED.location,
               date_text = EXCLUDED.date_text,
               month_wrapped = EXCLUDED.month_wrapped,
               last_updated_at = CURRENT_TIMESTAMP`,
            [
              event.title,
              event.link,
              event.image,
              event.location,
              event.date,
              event.monthWrapped,
            ]
          );
          totalSaved++;
        } catch (err: unknown) {
          console.error(
            `   ⚠️ Failed to insert: ${event.link}`,
            err instanceof Error ? err.message : String(err)
          );
        }
      }

      console.log(
        `   💾 Saved/Updated ${events.length} events from page ${page}`
      );

      if (page >= 10 || events.length < 10) {
        hasNext = false;
      } else {
        page++;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    console.log(
      `\n✨ Scraping completed. Total processed: ${totalSaved} events.`
    );
    return { total: totalSaved };
  } finally {
    client.release();
  }
}
