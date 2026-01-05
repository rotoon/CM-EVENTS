/**
 * Trip Planner Types
 */

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
  days: ItineraryDay[];
  overallNotes?: string;
}

export interface ItineraryDay {
  dayIndex: number;
  date: string;
  theme: string;
  totalEstimatedCost: number;
  totalEstimatedDurationMinutes: number;
  items: ItineraryItem[];
}

export interface ItineraryItem {
  sortOrder: number;
  timeOfDay: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  place: ItineraryPlace;
  notes?: string;
  estimatedCost?: number;
  travelFromPrevious?: {
    distanceKm?: number;
    durationMinutes?: number;
    transportMode?: string;
    notes?: string;
  };
}

export interface ItineraryPlace {
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
}
