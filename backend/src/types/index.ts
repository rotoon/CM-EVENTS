export interface EventRow {
  id: number;
  title: string;
  source_url: string;
  cover_image_url: string;
  location: string;
  date_text: string;
  month_wrapped: string;
  description?: string;
  time_text?: string;
  latitude?: number;
  longitude?: number;
  facebook_url?: string;
  is_fully_scraped: number;
  description_markdown?: string;
  google_maps_url?: string;
  is_ended?: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  timestamp: string;
}
