/**
 * Common/Shared Types
 */

export interface Category {
  id: string;
  label: string;
  keywords?: string[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
