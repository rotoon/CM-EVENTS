/**
 * Event Types
 */

export interface Event {
  id: number;
  source_url: string;
  title: string;
  description: string | null;
  description_markdown: string | null;
  location: string | null;
  date_text: string | null;
  time_text: string | null;
  month_wrapped: string | null;
  cover_image_url: string | null;
  latitude: number | null;
  longitude: number | null;
  google_maps_url: string | null;
  facebook_url: string | null;
  is_ended: number | null;
  first_scraped_at: string | null;
  last_updated_at: string | null;
  is_fully_scraped: number | null;
}

export interface EventImage {
  id: number;
  event_id: number;
  image_url: string;
  is_cover: number | null;
  created_at: string | null;
}

export interface EventWithImages extends Event {
  images: EventImage[];
}

export interface EventStats {
  totalEvents: number;
  eventsWithGPS: number;
  eventsWithFacebook: number;
  eventsByMonth: { month: string; count: number }[];
  topLocations: { location: string; count: number }[];
}

export interface EventsResponse {
  data: Event[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
