import { runDetailScraperForMonth } from "../src/services/detail-scraper.service";

async function main() {
  // Use fixed date as per user context (2026) or dynamic
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  console.log(`🚀 Starting detail scraper for ${year}-${month}...`);

  const result = await runDetailScraperForMonth(year, month, 100);

  console.log("✅ Scrape completed:", result);
}

main();
