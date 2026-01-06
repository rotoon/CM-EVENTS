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
}
