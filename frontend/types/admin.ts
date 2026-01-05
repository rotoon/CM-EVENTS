/**
 * Admin Types
 */

import type { Event } from "./event";

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
