/**
 * Place Types
 */

export interface Place {
  id: number;
  name: string;
  place_type: string;
  description: string | null;
  instagram_url: string | null;
  likes: number | null;
  comments: number | null;
  latitude: number | null;
  longitude: number | null;
  google_maps_url: string | null;
  google_place_id: string | null;
  cover_image_url: string | null;
  post_date: string | null;
  created_at: string | null;
  updated_at: string | null;
  categories: PlaceCategory[];
  category_names: string[];
  images: PlaceImage[];
}

export interface PlaceCategory {
  id: number;
  place_id: number;
  category: string;
}

export interface PlaceImage {
  id: number;
  place_id: number;
  image_url: string;
  caption: string | null;
}

export interface PlacesResponse {
  data: Place[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface PlaceFilter {
  place_type?: string;
  category?: string;
  categories?: string[]; // Multi-select categories
  search?: string;
  limit?: number;
  offset?: number;
}

export interface CategoryCount {
  category: string;
  count: number;
}

export interface PlaceTypeCount {
  place_type: string;
  count: number;
}
