const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface TripCriteria {
  startDate: string;
  days: number;
  travelerProfile: {
    style: string[];
    budgetLevel: "low" | "medium" | "high";
    hasCar: boolean;
    areas: string[];
    notes?: string;
  };
}

export interface Itinerary {
  tripMeta: {
    startDate: string;
    days: number;
    travelerProfile: TripCriteria["travelerProfile"];
    summary: string;
  };
  days: {
    dayIndex: number;
    date: string;
    theme: string;
    totalEstimatedCost: number;
    totalEstimatedDurationMinutes: number;
    items: {
      sortOrder: number;
      timeOfDay: string;
      startTime: string;
      endTime: string;
      durationMinutes: number;
      place: {
        type: "event" | "poi";
        eventId?: number;
        title: string;
        shortDescription?: string;
        locationText?: string;
        latitude?: number;
        longitude?: number;
        googleMapsUrl?: string;
        socialMediaUrl?: string;
        coverImageUrl?: string;
        tags?: string[];
        rating?: number;
        priceLevel?: string;
        isFromHiveDatabase: boolean;
      };
      notes?: string;
      estimatedCost?: number;
      travelFromPrevious?: {
        distanceKm?: number;
        durationMinutes?: number;
        transportMode?: string;
        notes?: string;
      };
    }[];
  }[];
  overallNotes?: string;
}

export async function planTrip(criteria: TripCriteria): Promise<Itinerary> {
  const response = await fetch(`${API_URL}/trips`, {
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
