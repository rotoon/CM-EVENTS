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
