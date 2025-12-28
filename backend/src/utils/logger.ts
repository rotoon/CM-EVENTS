import pino from "pino";

const isDevelopment = process.env.NODE_ENV !== "production";

/**
 * Structured Logger using Pino
 * - Development: Pretty printed, colorful output
 * - Production: JSON format for log aggregation
 */
const logger = pino({
  level: process.env.LOG_LEVEL || (isDevelopment ? "debug" : "info"),
  transport: isDevelopment
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss",
          ignore: "pid,hostname",
        },
      }
    : undefined,
  base: {
    env: process.env.NODE_ENV || "development",
  },
});

// Create child loggers for different modules
export const httpLogger = logger.child({ module: "http" });
export const dbLogger = logger.child({ module: "db" });
export const scraperLogger = logger.child({ module: "scraper" });
export const cronLogger = logger.child({ module: "cron" });

export default logger;
