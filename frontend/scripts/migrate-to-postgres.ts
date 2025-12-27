// Migration script: SQLite → PostgreSQL
// Run with: DATABASE_URL="..." pnpm tsx scripts/migrate-to-postgres.ts

import Database from "better-sqlite3";
import path from "path";
import { Pool } from "pg";

const SQLITE_PATH = path.resolve(process.cwd(), "events.db");

async function migrate() {
  console.log("🚀 Starting migration from SQLite to PostgreSQL...\n");

  // Connect to SQLite
  const sqlite = new Database(SQLITE_PATH);
  console.log("✅ Connected to SQLite:", SQLITE_PATH);

  // Connect to PostgreSQL
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes("railway")
      ? { rejectUnauthorized: false }
      : undefined,
  });
  console.log("✅ Connected to PostgreSQL\n");

  // Create table if not exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      source_url TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      location TEXT,
      date_text TEXT,
      month_wrapped TEXT,
      cover_image_url TEXT,
      first_scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      is_fully_scraped BOOLEAN DEFAULT FALSE,
      time_text TEXT,
      latitude REAL,
      longitude REAL,
      google_maps_url TEXT,
      facebook_url TEXT,
      is_ended BOOLEAN DEFAULT FALSE,
      description_markdown TEXT
    )
  `);
  console.log("✅ PostgreSQL table created\n");

  // Read all events from SQLite
  const events = sqlite.prepare("SELECT * FROM events").all() as any[];
  console.log(`📊 Found ${events.length} events in SQLite\n`);

  // Insert into PostgreSQL
  let inserted = 0;
  let updated = 0;
  let errors = 0;

  for (const event of events) {
    try {
      const result = await pool.query(
        `INSERT INTO events (
          source_url, title, description, location, date_text, month_wrapped,
          cover_image_url, is_fully_scraped, time_text, latitude, longitude,
          google_maps_url, facebook_url, is_ended, description_markdown
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        ON CONFLICT (source_url) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          location = EXCLUDED.location,
          date_text = EXCLUDED.date_text,
          month_wrapped = EXCLUDED.month_wrapped,
          cover_image_url = EXCLUDED.cover_image_url,
          is_fully_scraped = EXCLUDED.is_fully_scraped,
          time_text = EXCLUDED.time_text,
          latitude = EXCLUDED.latitude,
          longitude = EXCLUDED.longitude,
          google_maps_url = EXCLUDED.google_maps_url,
          facebook_url = EXCLUDED.facebook_url,
          is_ended = EXCLUDED.is_ended,
          description_markdown = EXCLUDED.description_markdown,
          last_updated_at = CURRENT_TIMESTAMP
        RETURNING (xmax = 0) AS is_insert`,
        [
          event.source_url,
          event.title,
          event.description,
          event.location,
          event.date_text,
          event.month_wrapped,
          event.cover_image_url,
          Boolean(event.is_fully_scraped),
          event.time_text,
          event.latitude,
          event.longitude,
          event.google_maps_url,
          event.facebook_url,
          Boolean(event.is_ended),
          event.description_markdown,
        ]
      );

      if (result.rows[0].is_insert) {
        inserted++;
      } else {
        updated++;
      }
    } catch (err: any) {
      errors++;
      console.error(`❌ Error migrating event ${event.id}:`, err.message);
    }
  }

  console.log("\n✨ Migration completed!");
  console.log(`   Inserted: ${inserted}`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Errors: ${errors}`);

  // Verify
  const countResult = await pool.query("SELECT COUNT(*) as count FROM events");
  console.log(`\n📊 PostgreSQL now has ${countResult.rows[0].count} events`);

  sqlite.close();
  await pool.end();
}

migrate().catch(console.error);
