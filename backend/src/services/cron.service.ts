import { cronLogger } from "../utils/logger";
import { runDetailScraper } from "./detail-scraper.service";
import { runScraper } from "./scraper.service";

const TWELVE_HOURS = 12 * 60 * 60 * 1000;
let lastScrapeTime: Date | null = null;
let isScraperRunning = false;
let lastDetailScrapeTime: Date | null = null;

export class CronService {
  static async scheduledScrape() {
    if (isScraperRunning) {
      cronLogger.warn("Scraper is already running, skipping...");
      return;
    }

    try {
      isScraperRunning = true;

      // Step 1: Scrape event list
      cronLogger.info("Scheduled scrape starting...");
      const listResult = await runScraper();
      lastScrapeTime = new Date();
      cronLogger.info(
        { completedAt: lastScrapeTime.toISOString(), ...listResult },
        "List scrape completed"
      );

      // Step 2: Scrape event details (batch of 10)
      cronLogger.info("Starting detail scrape...");
      const detailResult = await runDetailScraper(10);
      lastDetailScrapeTime = new Date();
      cronLogger.info(
        {
          completedAt: lastDetailScrapeTime.toISOString(),
          scraped: detailResult.scraped,
          remaining: detailResult.remaining,
        },
        "Detail scrape completed"
      );

      return { list: listResult, detail: detailResult };
    } catch (err) {
      cronLogger.error({ err }, "Scheduled scrape failed");
    } finally {
      isScraperRunning = false;
    }
  }

  static initCronJob() {
    // Check every minute for scheduled runs
    setInterval(() => {
      const now = new Date();
      if (
        (now.getHours() === 0 || now.getHours() === 12) &&
        now.getMinutes() === 0
      ) {
        this.scheduledScrape();
      }
    }, 60 * 1000);

    cronLogger.info(
      { intervalHours: 12 },
      "Cron scheduled: Scraper will run every 12 hours"
    );
  }

  static getStatus() {
    return {
      isRunning: isScraperRunning,
      lastScrapeTime: lastScrapeTime?.toISOString() || null,
      nextScheduledRun: lastScrapeTime
        ? new Date(lastScrapeTime.getTime() + TWELVE_HOURS).toISOString()
        : null,
      intervalHours: 12,
    };
  }

  static isRunning() {
    return isScraperRunning;
  }
}
