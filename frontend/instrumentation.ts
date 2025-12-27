import { CronService } from "@/lib/services/cron.service";

export async function register() {
  // Only run on server side
  if (process.env.NEXT_RUNTIME === "nodejs") {
    console.log("🚀 Initializing Cron Service...");
    CronService.initCronJob();
  }
}
