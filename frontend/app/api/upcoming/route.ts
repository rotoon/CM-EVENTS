import pool, { error, success } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT * FROM events 
        WHERE is_fully_scraped = TRUE
        ORDER BY id DESC LIMIT 20
      `);

      return NextResponse.json(
        success(
          result.rows.map((e) => ({
            ...e,
            image: e.cover_image_url,
          }))
        )
      );
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(error("Failed to fetch upcoming events"), {
      status: 500,
    });
  }
}
