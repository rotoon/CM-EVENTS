import { Request, Response } from "express";
import { CronService } from "../services/cron.service";
import { error, success } from "../utils/response.util";

export class ScraperController {
  static async triggerScrape(req: Request, res: Response) {
    if (CronService.isRunning()) {
      res.status(409).json(error("Scraper is already running"));
      return;
    }

    // Run in background
    CronService.scheduledScrape();

    res.json(
      success(
        {
          startedAt: new Date().toISOString(),
        },
        "Scraper started in background"
      )
    );
  }

  static async getStatus(req: Request, res: Response) {
    res.json(success(CronService.getStatus()));
  }
}
