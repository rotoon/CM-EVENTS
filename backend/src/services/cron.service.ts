import { EventRepository } from "../repositories/event/prisma";
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
      const hours = now.getHours();
      const minutes = now.getMinutes();

      // Run Scraper at 00:00 and 12:00
      if ((hours === 0 || hours === 12) && minutes === 0) {
        this.scheduledScrape();
      }

      // Run Sync Status at 00:00
      if (hours === 0 && minutes === 0) {
        this.scheduledSyncStatus();
      }
    }, 60 * 1000);

    cronLogger.info(
      { intervalHours: 12 },
      "Cron scheduled: Scraper every 12h, Sync Status every 24h (midnight)"
    );
  }

  static async scheduledSyncStatus() {
    try {
      cronLogger.info("Scheduled sync status starting...");
      const count = await EventRepository.syncEventStatus();
      cronLogger.info(
        { updatedCount: count, completedAt: new Date().toISOString() },
        "Scheduled sync status completed"
      );
    } catch (err) {
      cronLogger.error({ err }, "Scheduled sync status failed");
    }
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
