export interface AdminPagination {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface EventForList {
  id: number;
  title: string;
  location: string | null;
  cover_image_url: string | null;
  date_text: string | null;
  is_ended: boolean | null;
}

export interface PlaceForList {
  id: number;
  name: string;
  place_type: string;
  cover_image_url: string | null;
  category_names: string[];
  categories: PlaceCategory[];
  comments: number;
  created_at: string;
  description: string;
  google_maps_url: string | null;
  google_place_id: string | null;
  images: PlaceImage[];
  instagram_url: string | null;
  latitude: number;
  likes: number;
  longitude: number;
  post_date: string;
  updated_at: string;
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
  order?: number;
}
