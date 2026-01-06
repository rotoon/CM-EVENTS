/**
 * Admin Types
 */

import type { Event } from "./event";
import type { Place } from "./place";

export interface AdminDashboard {
  stats: {
    total: number;
    fullyScraped: number;
    pending: number;
  };
  recentEvents: {
    id: number;
    title: string;
    location: string | null;
    cover_image_url: string | null;
    date_text: string | null;
  }[];
}

export interface AdminEventsResponse {
  events: Event[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface EventFormData {
  title: string;
  description?: string;
  location?: string;
  date_text?: string;
  time_text?: string;
  cover_image_url?: string;
  latitude?: string;
  longitude?: string;
  google_maps_url?: string;
  facebook_url?: string;
  is_ended?: boolean;
}

export interface LoginResponse {
  token: string;
}

// ============================================================================
// Admin Places Types
// ============================================================================

export interface AdminPlacesDashboard {
  stats: {
    total: number;
    byType: { place_type: string; count: number }[];
  };
  recentPlaces: {
    id: number;
    name: string;
    place_type: string;
    cover_image_url: string | null;
    category_names: string[];
  }[];
}

export interface AdminPlacesResponse {
  places: Place[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface PlaceFormData {
  name: string;
  place_type: string;
  description?: string;
  instagram_url?: string;
  latitude?: string;
  longitude?: string;
  google_maps_url?: string;
  cover_image_url?: string;
  categories?: string[];
}
