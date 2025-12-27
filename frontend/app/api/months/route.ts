import pool, { error, success } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await pool.connect();
    try {
      // month_wrapped is stored as JSON array strings like '["2025-12"]'
      const result = await client.query(`
        SELECT month_wrapped FROM events 
        WHERE month_wrapped IS NOT NULL
      `);

      // Extract unique months from all JSON arrays
      const monthSet = new Set<string>();
      for (const row of result.rows) {
        try {
          const months = JSON.parse(row.month_wrapped) as string[];
          months.forEach((m) => monthSet.add(m));
        } catch {
          if (row.month_wrapped) {
            monthSet.add(row.month_wrapped);
          }
        }
      }

      // Sort descending
      const sortedMonths = Array.from(monthSet).sort((a, b) =>
        b.localeCompare(a)
      );

      return NextResponse.json(success(sortedMonths));
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(error("Failed to fetch months"), { status: 500 });
  }
}
