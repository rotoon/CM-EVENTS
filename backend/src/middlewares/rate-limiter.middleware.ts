import rateLimit from "express-rate-limit";
import { error } from "../utils/response.util";

/**
 * API Rate Limiter
 * Limits requests to prevent abuse
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: error("Too many requests, please try again later."),
  skip: (req) => {
    // Skip rate limiting for health check
    return req.path === "/health";
  },
});

/**
 * Scraper Rate Limiter
 * More strict limit for scraper endpoint
 */
export const scraperLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: error("Scraper rate limit exceeded. Try again later."),
});
