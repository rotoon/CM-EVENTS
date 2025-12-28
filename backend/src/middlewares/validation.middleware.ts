import { NextFunction, Request, Response } from "express";
import { z, ZodError, ZodIssue, ZodSchema } from "zod";
import { error } from "../utils/response.util";

// Extend Express Request to include validated data
declare global {
  namespace Express {
    interface Request {
      validated?: {
        query?: Record<string, unknown>;
        params?: Record<string, unknown>;
        body?: Record<string, unknown>;
      };
    }
  }
}

/**
 * Validation middleware factory
 * Validates request query, params, or body against a Zod schema
 * Stores validated data in req.validated[source]
 */
export function validate(
  schema: ZodSchema,
  source: "query" | "params" | "body" = "query"
) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req[source];
      const validated = schema.parse(data);

      // Store validated data in req.validated (Express 5 compatible)
      if (!req.validated) {
        req.validated = {};
      }
      req.validated[source] = validated as Record<string, unknown>;

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const message = err.issues
          .map((issue: ZodIssue) => `${issue.path.join(".")}: ${issue.message}`)
          .join(", ");
        res.status(400).json(error(`Validation error: ${message}`));
        return;
      }
      next(err);
    }
  };
}

// ============================================================================
// Common Validation Schemas
// ============================================================================

/**
 * Pagination schema - validates limit and offset query params
 */
export const paginationSchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20))
    .refine((val) => !isNaN(val) && val > 0 && val <= 100, {
      message: "limit must be a number between 1 and 100",
    }),
  offset: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 0))
    .refine((val) => !isNaN(val) && val >= 0, {
      message: "offset must be a non-negative number",
    }),
});

/**
 * Events query schema - extends pagination with filters
 */
export const eventsQuerySchema = paginationSchema.extend({
  month: z.string().optional(),
  category: z.string().optional(),
});

/**
 * Search query schema
 */
export const searchQuerySchema = z.object({
  q: z.string().min(1, "Search query is required"),
});

/**
 * ID param schema
 */
export const idParamSchema = z.object({
  id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "id must be a positive integer",
    }),
});
