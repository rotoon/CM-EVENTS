import { Pool } from "pg";

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // SSL required for Railway
  ssl: process.env.DATABASE_URL?.includes("railway")
    ? { rejectUnauthorized: false }
    : undefined,
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
    console.log("✅ Database schema initialized");
  } finally {
    client.release();
  }
}

// Initialize on import
initDb().catch(console.error);

export default pool;

// ============================================================================
// Response Helpers
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  timestamp: string;
}

export const success = <T>(
  data: T | null = null,
  message = "Success"
): ApiResponse<T> => ({
  success: true,
  message,
  data,
  timestamp: new Date().toISOString(),
});

export const error = (
  message = "Internal Server Error"
): ApiResponse<null> => ({
  success: false,
  message,
  data: null,
  timestamp: new Date().toISOString(),
});
