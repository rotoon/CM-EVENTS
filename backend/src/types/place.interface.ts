/**
 * Place Types
 * Types สำหรับ Places feature
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
  post_date: Date | null;
  created_at: Date | null;
  updated_at: Date | null;
  categories: PlaceCategory[];
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

export interface PlaceWithCategories extends Place {
  category_names: string[];
  images?: PlaceImage[];
}

export interface PlaceFilters {
  place_type?: string;
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface PlacePaginationResult {
  data: PlaceWithCategories[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export const PLACE_TYPES = [
  "Cafe",
  "Food",
  "Restaurant",
  "Travel",
  "Bar/Nightlife",
] as const;

export type PlaceType = (typeof PLACE_TYPES)[number];
