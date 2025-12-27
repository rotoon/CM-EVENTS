import pool, { success } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT id, title, latitude, longitude, location, cover_image_url 
        FROM events
        WHERE latitude IS NOT NULL AND longitude IS NOT NULL
      `);

      return NextResponse.json(success(result.rows));
    } finally {
      client.release();
    }
  } catch {
    return NextResponse.json(success([]));
  }
}
