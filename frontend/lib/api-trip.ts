/**
 * Trip Planner API
 */

import { API_BASE } from "@/lib/api-config";
import type { Itinerary, TripCriteria } from "@/types";

export async function planTrip(criteria: TripCriteria): Promise<Itinerary> {
  const response = await fetch(`${API_BASE}/trips`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(criteria),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to generate trip");
  }

  const result = await response.json();
  return result.data;
}

// Re-export types for convenience
export type { Itinerary, TripCriteria } from "@/types";
