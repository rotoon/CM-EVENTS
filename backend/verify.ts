import Database from "better-sqlite3";

const db = new Database("events.db");

const eventCount = db
  .prepare("SELECT COUNT(*) as c FROM events WHERE is_fully_scraped = 1")
  .get() as { c: number };
const imageCount = db
  .prepare("SELECT COUNT(*) as c FROM event_images")
  .get() as { c: number };

console.log(`\n📊 Verification Stats:`);
console.log(`- Fully Scraped Events: ${eventCount.c}`);
console.log(`- Total Gallery Images: ${imageCount.c}`);

console.log(`\n🔎 Sample Event with Images:`);
const event = db
  .prepare(
    `
    SELECT e.title, e.description, COUNT(i.id) as img_count 
    FROM events e
    LEFT JOIN event_images i ON e.id = i.event_id
    WHERE e.is_fully_scraped = 1
    GROUP BY e.id
    ORDER BY img_count DESC 
    LIMIT 1
`
  )
  .get() as
  | { title: string; description: string; img_count: number }
  | undefined;

if (event) {
  console.log(`Title: ${event.title}`);
  console.log(`Description Length: ${event.description?.length} chars`);
  console.log(`Gallery Images: ${event.img_count}`);
} else {
  console.log("No fully scraped events found yet.");
}
