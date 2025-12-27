import { runDetailScraper } from "./detail-scraper.service";
import { runScraper } from "./scraper.service";

const TWELVE_HOURS = 12 * 60 * 60 * 1000;
let lastScrapeTime: Date | null = null;
let isScraperRunning = false;
let lastDetailScrapeTime: Date | null = null;
let cronInterval: ReturnType<typeof setInterval> | null = null;

export class CronService {
  static async scheduledScrape() {
    if (isScraperRunning) {
      console.log("⏳ Scraper is already running, skipping...");
      return;
    }

    try {
      isScraperRunning = true;

      // Step 1: Scrape event list
      console.log("\n⏰ Scheduled scrape starting...");
      const listResult = await runScraper();
      lastScrapeTime = new Date();
      console.log(
        `✅ List scrape completed at ${lastScrapeTime.toLocaleString("th-TH")}`
      );

      // Step 2: Scrape event details (batch of 10)
      console.log("📚 Starting detail scrape...");
      const detailResult = await runDetailScraper(10);
      lastDetailScrapeTime = new Date();
      console.log(
        `✅ Detail scrape completed at ${lastDetailScrapeTime.toLocaleString(
          "th-TH"
        )}`
      );
      console.log(
        `   Scraped: ${detailResult.scraped}, Remaining: ${detailResult.remaining}`
      );

      return { list: listResult, detail: detailResult };
    } catch (error) {
      console.error("❌ Scheduled scrape failed:", error);
    } finally {
      isScraperRunning = false;
    }
  }

  static initCronJob() {
    if (cronInterval) {
      console.log("📅 Cron job already initialized");
      return;
    }

    // Check every minute for scheduled times
    cronInterval = setInterval(() => {
      const now = new Date();
      if (
        (now.getHours() === 0 || now.getHours() === 12) &&
        now.getMinutes() === 0
      ) {
        this.scheduledScrape();
      }
    }, 60 * 1000);

    console.log(`\n📅 Cron scheduled: Scraper will run every 12 hours`);
    console.log(`   - List scraper: scrape event listings`);
    console.log(
      `   - Detail scraper: scrape event details with AI (10 per batch)`
    );
  }

  static getStatus() {
    return {
      isRunning: isScraperRunning,
      lastScrapeTime: lastScrapeTime?.toISOString() || null,
      lastDetailScrapeTime: lastDetailScrapeTime?.toISOString() || null,
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
