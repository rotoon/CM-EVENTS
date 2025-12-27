import pool from "./src/config/database";

async function seed() {
  const client = await pool.connect();
  try {
    // Check if event 43 exists
    const res = await client.query("SELECT id FROM events WHERE id = 43");
    if (res.rows.length === 0) {
      console.log("Event 43 not found, finding any event...");
      const anyEvent = await client.query("SELECT id FROM events LIMIT 1");
      if (anyEvent.rows.length > 0) {
        const id = anyEvent.rows[0].id;
        console.log(`Seeding images for event ${id}`);
        await insertImages(client, id);
      } else {
        console.log("No events found to seed.");
      }
    } else {
      console.log("Seeding images for event 43");
      await insertImages(client, 43);
    }
  } catch (e) {
    console.error(e);
  } finally {
    client.release();
    // Allow pool to close/process to exit
    setTimeout(() => process.exit(0), 1000);
  }
}

async function insertImages(client: any, eventId: number) {
  const images = [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80", // Nature
    "https://images.unsplash.com/photo-1510784722466-f2aa9c52fff6?w=800&q=80", // Nature 2
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80", // Nature 3
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80", // Nature 4
  ];

  for (const url of images) {
    await client.query(
      "INSERT INTO event_images (event_id, image_url) VALUES ($1, $2)",
      [eventId, url]
    );
  }
  console.log("✅ Seeded 4 images.");
}

seed();
