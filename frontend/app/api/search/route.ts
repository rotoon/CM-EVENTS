import pool, { error, success } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get("q");

    if (!q) {
      return NextResponse.json(error("Query parameter 'q' is required"), {
        status: 400,
      });
    }

    const client = await pool.connect();
    try {
      const searchPattern = `%${q}%`;
      const result = await client.query(
        `SELECT * FROM events 
         WHERE (title ILIKE $1 OR description ILIKE $1 OR location ILIKE $1)
         AND is_fully_scraped = TRUE
         ORDER BY id DESC LIMIT 50`,
        [searchPattern]
      );

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
    return NextResponse.json(error("Search failed"), { status: 500 });
  }
}
