import pool, { error, success } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const month = searchParams.get("month");
    const limit = Number(searchParams.get("limit") || "20");
    const offset = Number(searchParams.get("offset") || "0");

    // Build query with parameterized values
    let query = `
      SELECT * FROM events 
      WHERE is_fully_scraped = TRUE AND description IS NOT NULL
    `;
    const params: (string | number)[] = [];
    let paramIndex = 1;

    if (month) {
      // month_wrapped is stored as JSON array string like '["2025-12"]'
      query += ` AND month_wrapped LIKE $${paramIndex}`;
      params.push(`%"${month}"%`);
      paramIndex++;
    }

    query += ` ORDER BY id DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    // Count query
    let countQuery = `
      SELECT COUNT(*) as count FROM events 
      WHERE is_fully_scraped = TRUE AND description IS NOT NULL
    `;
    const countParams: string[] = [];
    let countParamIndex = 1;

    if (month) {
      countQuery += ` AND month_wrapped LIKE $${countParamIndex}`;
      countParams.push(`%"${month}"%`);
    }

    const client = await pool.connect();
    try {
      const countResult = await client.query(countQuery, countParams);
      const count = parseInt(countResult.rows[0].count);

      const eventsResult = await client.query(query, params);
      const events = eventsResult.rows;

      const mappedEvents = events.map((e) => ({
        ...e,
        image: e.cover_image_url,
      }));

      return NextResponse.json(
        success({
          events: mappedEvents,
          pagination: {
            total: count,
            limit,
            offset,
            hasMore: offset + events.length < count,
          },
        })
      );
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(error("Failed to fetch events"), { status: 500 });
  }
}
