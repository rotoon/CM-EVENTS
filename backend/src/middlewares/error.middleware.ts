import { NextFunction, Request, Response } from "express";
import { error } from "../utils/response.util";

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

/**
 * Global error handler middleware
 * Catches all errors and returns consistent JSON responses
 */
export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log error for debugging (in production, use proper logging)
  console.error(`[ERROR] ${req.method} ${req.path}:`, {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });

  res.status(statusCode).json(error(message));
}

/**
 * Not Found handler - catches 404 errors
 */
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json(error(`Route ${req.method} ${req.path} not found`));
}

/**
 * Async handler wrapper - catches async errors automatically
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Create custom operational error
 */
export function createError(
  message: string,
  statusCode: number = 500
): AppError {
  const err = new Error(message) as AppError;
  err.statusCode = statusCode;
  err.isOperational = true;
  return err;
}
