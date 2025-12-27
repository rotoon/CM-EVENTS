import pool, { error, success } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await pool.connect();
    try {
      const totalResult = await client.query(
        "SELECT COUNT(*) as count FROM events"
      );
      const scrapedResult = await client.query(
        "SELECT COUNT(*) as count FROM events WHERE is_fully_scraped = TRUE"
      );

      const total = parseInt(totalResult.rows[0].count);
      const fullyScraped = parseInt(scrapedResult.rows[0].count);

      return NextResponse.json(
        success({
          total,
          fullyScraped,
          pending: total - fullyScraped,
        })
      );
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(error("Failed to fetch stats"), { status: 500 });
  }
}
