"use client";

/**
 * React Query Hooks for Places
 * Custom hooks สำหรับจัดการ Places data ด้วย React Query
 */

import type {
  CategoryCount,
  PlaceFilter,
  PlacesResponse,
  PlaceTypeCount,
} from "@/lib/api-places";
import { useQuery } from "@tanstack/react-query";

// ===== API Base =====
const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-production-14fd.up.railway.app"
).replace(/\/$/, "");

// ===== Query Keys =====
export const placesKeys = {
  all: ["places"] as const,
  lists: () => [...placesKeys.all, "list"] as const,
  list: (filters: PlaceFilter, page: number) =>
    [...placesKeys.lists(), { ...filters, page }] as const,
  details: () => [...placesKeys.all, "detail"] as const,
  detail: (id: number) => [...placesKeys.details(), id] as const,
  categories: () => [...placesKeys.all, "categories"] as const,
  types: () => [...placesKeys.all, "types"] as const,
};

// ===== Fetch Functions =====
async function fetchPlacesApi(
  filters: PlaceFilter,
  page: number,
  limit: number
): Promise<PlacesResponse> {
  const params = new URLSearchParams();
  const offset = (page - 1) * limit;

  params.set("limit", String(limit));
  params.set("offset", String(offset));
  if (filters.place_type) params.set("place_type", filters.place_type);
  if (filters.category) params.set("category", filters.category);
  if (filters.categories?.length)
    params.set("category", filters.categories.join(","));
  if (filters.search) params.set("search", filters.search);

  const res = await fetch(`${API_BASE}/places?${params.toString()}`);
  const json = await res.json();

  return {
    data: json.data?.data || [],
    pagination: json.data?.pagination || {
      total: 0,
      limit,
      offset,
      hasMore: false,
    },
  };
}

async function fetchCategoriesApi(): Promise<CategoryCount[]> {
  const res = await fetch(`${API_BASE}/places/categories`);
  const json = await res.json();
  return json.data || [];
}

async function fetchTypesApi(): Promise<PlaceTypeCount[]> {
  const res = await fetch(`${API_BASE}/places/types`);
  const json = await res.json();
  return json.data || [];
}

// ===== Hooks =====

/**
 * Hook สำหรับ Places กับ Page-based Pagination
 */
export function usePlaces(
  filters: PlaceFilter,
  page: number,
  limit: number = 20,
  initialData?: PlacesResponse
) {
  return useQuery({
    queryKey: placesKeys.list(filters, page),
    queryFn: () => fetchPlacesApi(filters, page, limit),
    initialData,
    staleTime: 60 * 1000, // 1 minute
    placeholderData: (previousData) => previousData, // Keep previous data while loading
  });
}

/**
 * Hook สำหรับ Categories
 */
export function usePlaceCategories(initialData?: CategoryCount[]) {
  return useQuery({
    queryKey: placesKeys.categories(),
    queryFn: fetchCategoriesApi,
    initialData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook สำหรับ Place Types
 */
export function usePlaceTypes(initialData?: PlaceTypeCount[]) {
  return useQuery({
    queryKey: placesKeys.types(),
    queryFn: fetchTypesApi,
    initialData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
