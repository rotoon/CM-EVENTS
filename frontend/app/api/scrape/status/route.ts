import { success } from "@/lib/db";
import { CronService } from "@/lib/services/cron.service";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(success(CronService.getStatus()));
}
