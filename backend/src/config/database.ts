import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // SSL required for Railway/Production
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined,
  // Connection pool settings
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Initialize database schema
async function initDb() {
  const client = await pool.connect();
  try {
    await client.query(`
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

    await client.query(`
      CREATE TABLE IF NOT EXISTS event_images (
        id SERIAL PRIMARY KEY,
        event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Database schema initialized");
  } finally {
    client.release();
  }
}

// Initialize on import
if (process.env.DATABASE_URL) {
  initDb().catch(console.error);
} else {
  console.warn("⚠️ DATABASE_URL not set, skipping database initialization");
}

export default pool;
