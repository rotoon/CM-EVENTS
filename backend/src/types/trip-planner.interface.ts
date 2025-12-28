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

export interface LocalEvent {
  id: number;
  title: string;
  location: string | null;
  dateText: string | null;
  timeText: string | null;
  latitude: number | null;
  longitude: number | null;
  googleMapsUrl?: string | null;
  sourceUrl?: string;
  coverImageUrl?: string | null;
  isEnded: boolean | null;
}

export interface ITripPlannerService {
  generateItinerary(
    criteria: TripCriteria,
    localEvents: LocalEvent[]
  ): Promise<any>;
}
