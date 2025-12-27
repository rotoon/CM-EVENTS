import { error, success } from "@/lib/db";
import { CronService } from "@/lib/services/cron.service";
import { NextResponse } from "next/server";

export async function POST() {
  if (CronService.isRunning()) {
    return NextResponse.json(error("Scraper is already running"), {
      status: 409,
    });
  }

  // Run in background (don't await)
  CronService.scheduledScrape();

  return NextResponse.json(
    success(
      {
        startedAt: new Date().toISOString(),
      },
      "Scraper started in background"
    )
  );
}
