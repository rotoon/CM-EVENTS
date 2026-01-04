import type { Response } from "express";
import { ApiResponse } from "../types";

export const success = <T>(
  data: T | null = null,
  message = "Success"
): ApiResponse<T> => ({
  success: true,
  message,
  data,
  timestamp: new Date().toISOString(),
});

export const error = (
  message = "Internal Server Error"
): ApiResponse<null> => ({
  success: false,
  message,
  data: null,
  timestamp: new Date().toISOString(),
});

// Helper functions ที่ส่ง response โดยตรง
export const successResponse = <T>(
  res: Response,
  data: T | null = null,
  message = "Success",
  statusCode = 200
) => {
  return res.status(statusCode).json(success(data, message));
};

export const errorResponse = (
  res: Response,
  message = "Internal Server Error",
  statusCode = 500
) => {
  return res.status(statusCode).json(error(message));
};
