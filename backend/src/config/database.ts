import Database from "better-sqlite3";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const DB_PATH =
  process.env.DB_PATH || path.resolve(__dirname, "../../events.db");

// Default mode (read/write), creates file if missing
const db = new Database(DB_PATH);

// Create table if not exists (Full Verified Schema)
db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_url TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    date_text TEXT,
    month_wrapped TEXT,
    cover_image_url TEXT,
    first_scraped_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_fully_scraped BOOLEAN DEFAULT 0,
    -- Columns added by detail-scraper (included here for safety)
    time_text TEXT,
    latitude REAL,
    longitude REAL,
    google_maps_url TEXT,
    facebook_url TEXT,
    is_ended BOOLEAN DEFAULT 0,
    description_markdown TEXT
  )
`);

export default db;
