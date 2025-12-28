import axios from "axios";
import * as cheerio from "cheerio";
import prisma from "../lib/prisma";
import { extractStartEndDates, generateMonthRange } from "../utils/date.util";
import { scraperLogger } from "../utils/logger";

interface EventData {
  title: string;
  link: string;
  image: string;
  location: string;
  date: string;
  monthWrapped: string;
  startDate: Date | null;
  endDate: Date | null;
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
  scraperLogger.debug({ page }, "Scraping page");

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

        // Extract start and end dates
        const { startDate, endDate } = extractStartEndDates(dateRaw);

        // Generate full month range
        let monthWrapped = '["UNKNOWN"]';
        if (startDate && endDate) {
          const months = generateMonthRange(startDate, endDate);
          monthWrapped = JSON.stringify(months);
        }

        if (!events.some((e) => e.link === fullLink)) {
          events.push({
            title,
            link: fullLink,
            image,
            location: locationRaw,
            date: dateRaw,
            monthWrapped,
            startDate,
            endDate,
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

    scraperLogger.info({ page, found: events.length }, "Scraped page");
    return events;
  } catch (err) {
    scraperLogger.error({ err, page }, "Error scraping page");
    return [];
  }
}

export async function runScraper() {
  scraperLogger.info("Starting list scraper");

  let page = 1;
  let totalSaved = 0;
  let hasNext = true;

  while (hasNext) {
    const events = await scrapeEventList(page);
    if (events.length === 0) {
      scraperLogger.warn("No more events found or error occurred");
      break;
    }

    for (const event of events) {
      try {
        await prisma.events.upsert({
          where: { source_url: event.link },
          update: {
            title: event.title,
            cover_image_url: event.image,
            location: event.location,
            date_text: event.date,
            month_wrapped: event.monthWrapped,
            start_date: event.startDate,
            end_date: event.endDate,
            last_updated_at: new Date(),
          },
          create: {
            source_url: event.link,
            title: event.title,
            cover_image_url: event.image,
            location: event.location,
            date_text: event.date,
            month_wrapped: event.monthWrapped,
            start_date: event.startDate,
            end_date: event.endDate,
          },
        });
        totalSaved++;
      } catch (err: unknown) {
        scraperLogger.error({ err, url: event.link }, "Failed to insert event");
      }
    }

    scraperLogger.debug(
      { page, saved: events.length },
      "Saved events from page"
    );

    if (page >= 10 || events.length < 10) {
      hasNext = false;
    } else {
      page++;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  scraperLogger.info({ total: totalSaved }, "Scraping completed");
  return { total: totalSaved };
}
