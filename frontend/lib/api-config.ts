/**
 * API Configuration
 * Centralized API base URL and shared utilities
 */

export const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-production-14fd.up.railway.app"
).replace(/\/$/, "");

/**
 * Standard API response handler with error handling
 */
export async function handleApiResponse<T>(response: Response): Promise<T> {
  const json = await response.json();

  if (!response.ok || json.error) {
    throw new Error(json.error || "Request failed");
  }

  return json.data as T;
}

/**
 * Get auth headers for authenticated requests
 */
export function getAuthHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
