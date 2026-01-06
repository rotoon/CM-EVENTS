/**
 * Types - Barrel Export
 */

// Event types
export type {
  Event,
  EventImage,
  EventStats,
  EventWithImages,
  EventsResponse,
} from "./event";

// Place types
export type {
  CategoryCount,
  Place,
  PlaceCategory,
  PlaceFilter,
  PlaceImage,
  PlaceTypeCount,
  PlacesResponse,
} from "./place";

// Trip types
export type {
  Itinerary,
  ItineraryDay,
  ItineraryItem,
  ItineraryPlace,
  TripCriteria,
} from "./trip";

// Admin types
export type {
  AdminDashboard,
  AdminEventsResponse,
  AdminPlacesDashboard,
  AdminPlacesResponse,
  EventFormData,
  LoginResponse,
  PlaceFormData,
} from "./admin";

// Common types
export type { Category, Pagination } from "./common";
