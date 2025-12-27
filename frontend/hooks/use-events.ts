"use client";

import { sortByEndDate } from "@/lib/date-utils";
import {
  Category,
  Event,
  EventsResponse,
  EventStats,
  EventWithImages,
} from "@/lib/types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

// ============================================================================
// API Base URL (Forced build-time inlining v4)
// ============================================================================
const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-production-14fd.up.railway.app"
).replace(/\/$/, "");

if (typeof window !== "undefined") {
  console.log("🚀 [v4-FINAL] HYPE ACTIVE API:", API_BASE);
}

// ============================================================================
// Fetch Functions
// ============================================================================

async function fetchEvents(month?: string): Promise<Event[]> {
  const params = new URLSearchParams();
  if (month) params.set("month", month);
  params.set("limit", "200");

  const response = await fetch(`${API_BASE}/events?${params.toString()}`);
  const json = await response.json();
  // API returns { data: { events: [...], pagination: {...} } }
  return sortByEndDate((json.data?.events || json.data || []) as Event[]);
}

async function fetchEventById(id: number): Promise<EventWithImages | null> {
  const response = await fetch(`${API_BASE}/events/${id}`);
  const json = await response.json();
  if (json.error) return null;
  return json.data as EventWithImages;
}

async function fetchMonths(): Promise<string[]> {
  const response = await fetch(`${API_BASE}/months`);
  const json = await response.json();
  return json.data as string[];
}

async function fetchStats(): Promise<EventStats> {
  const response = await fetch(`${API_BASE}/stats`);
  const json = await response.json();
  return json.data as EventStats;
}

async function fetchSearch(query: string): Promise<Event[]> {
  const response = await fetch(
    `${API_BASE}/search?q=${encodeURIComponent(query)}`
  );
  const json = await response.json();
  return json.data as Event[];
}

async function fetchUpcoming(): Promise<Event[]> {
  const response = await fetch(`${API_BASE}/upcoming`);
  const json = await response.json();
  return sortByEndDate(json.data as Event[]);
}

async function fetchMap(): Promise<Event[]> {
  const response = await fetch(`${API_BASE}/map`);
  const json = await response.json();
  return json.data as Event[];
}

async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE}/categories`);
  const json = await response.json();
  return json.data as Category[];
}

async function fetchEventsPaginated(
  page: number,
  limit: number,
  month?: string,
  category?: string
): Promise<EventsResponse> {
  const params = new URLSearchParams();
  // Use offset instead of page for the API
  const offset = (page - 1) * limit;
  params.set("limit", limit.toString());
  params.set("offset", offset.toString());
  if (month) params.set("month", month);
  if (category) params.set("category", category);

  const response = await fetch(`${API_BASE}/events?${params.toString()}`);
  const json = await response.json();

  // API returns { data: { events: [...], pagination: {...} } }
  const apiData = json.data || {};
  const events = apiData.events || [];
  const apiPagination = apiData.pagination || {
    total: 0,
    limit,
    offset,
    hasMore: false,
  };

  return {
    data: sortByEndDate(events as Event[]),
    pagination: {
      page,
      limit,
      total: apiPagination.total,
      totalPages: Math.ceil(apiPagination.total / limit),
      hasNext: apiPagination.hasMore,
      hasPrev: page > 1,
    },
  };
}

// ============================================================================
// React Query Hooks
// ============================================================================

export function useEvents(month?: string) {
  return useQuery({
    queryKey: ["events", month],
    queryFn: () => fetchEvents(month),
  });
}

export function useEventById(id: number) {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => fetchEventById(id),
    enabled: !!id,
  });
}

export function useMonths() {
  return useQuery({
    queryKey: ["months"],
    queryFn: fetchMonths,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useEventStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSearchEvents(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => fetchSearch(query),
    enabled: query.length >= 2,
  });
}

export function useUpcomingEvents() {
  return useQuery({
    queryKey: ["upcoming"],
    queryFn: fetchUpcoming,
  });
}

export function useMapEvents() {
  return useQuery({
    queryKey: ["map"],
    queryFn: fetchMap,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

export function useEventsPaginated(
  page: number,
  limit: number = 12,
  month?: string,
  category?: string
) {
  return useQuery({
    queryKey: ["events", "paginated", page, limit, month, category],
    queryFn: () => fetchEventsPaginated(page, limit, month, category),
  });
}

export function useEventsInfinite(
  limit: number = 12,
  month?: string,
  category?: string
) {
  return useInfiniteQuery({
    queryKey: ["events", "infinite", limit, month, category],
    queryFn: ({ pageParam = 1 }) =>
      fetchEventsPaginated(pageParam as number, limit, month, category),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
    initialPageParam: 1,
  });
}
