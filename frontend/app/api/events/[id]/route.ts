import pool, { error, success } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const client = await pool.connect();
    try {
      const result = await client.query("SELECT * FROM events WHERE id = $1", [
        id,
      ]);

      if (result.rows.length === 0) {
        return NextResponse.json(error("Event not found"), { status: 404 });
      }

      const event = result.rows[0];
      return NextResponse.json(
        success({
          ...event,
          image: event.cover_image_url,
        })
      );
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(error("Failed to fetch event"), { status: 500 });
  }
}
