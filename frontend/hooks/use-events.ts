"use client";

import { useQuery } from "@tanstack/react-query";

// ============================================================================
// Types
// ============================================================================

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

// ============================================================================
// API Base URL (Now using internal Next.js API routes)
// ============================================================================
const API_BASE = "/api";

// ============================================================================
// Helper: Parse Thai date for sorting
// ============================================================================
const THAI_MONTHS: Record<string, number> = {
  มกราคม: 0,
  กุมภาพันธ์: 1,
  มีนาคม: 2,
  เมษายน: 3,
  พฤษภาคม: 4,
  มิถุนายน: 5,
  กรกฎาคม: 6,
  สิงหาคม: 7,
  กันยายน: 8,
  ตุลาคม: 9,
  พฤศจิกายน: 10,
  ธันวาคม: 11,
};

function parseThaiDate(dateStr: string): number | null {
  const pattern =
    /(\d{1,2})\s+(มกราคม|กุมภาพันธ์|มีนาคม|เมษายน|พฤษภาคม|มิถุนายน|กรกฎาคม|สิงหาคม|กันยายน|ตุลาคม|พฤศจิกายน|ธันวาคม)\s+(\d{4})/;
  const match = dateStr.match(pattern);

  if (!match) return null;

  const day = parseInt(match[1]);
  const monthName = match[2];
  const buddhistYear = parseInt(match[3]);

  const month = THAI_MONTHS[monthName];
  const gregorianYear = buddhistYear - 543;

  return new Date(gregorianYear, month, day).getTime();
}

function getEndDateTimestamp(dateText: string | null): number {
  if (!dateText) return 0;
  const parts = dateText.split(/\s*[-–]\s*/);
  const endDateStr = parts[parts.length - 1];
  return parseThaiDate(endDateStr) || 0;
}

function sortByEndDate(events: Event[]): Event[] {
  return [...events].sort((a, b) => {
    const endA = getEndDateTimestamp(a.date_text);
    const endB = getEndDateTimestamp(b.date_text);
    return endB - endA;
  });
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

// ============================================================================
// React Query Hooks
// ============================================================================

/**
 * ดึง events ทั้งหมด หรือกรองตาม month
 */
export function useEvents(month?: string) {
  return useQuery({
    queryKey: ["events", month],
    queryFn: () => fetchEvents(month),
  });
}

/**
 * ดึง event ตาม ID พร้อม images
 */
export function useEventById(id: number) {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => fetchEventById(id),
    enabled: !!id,
  });
}

/**
 * ดึงรายการเดือนที่มี events
 */
export function useMonths() {
  return useQuery({
    queryKey: ["months"],
    queryFn: fetchMonths,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * ดึงสถิติ events
 */
export function useEventStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * ค้นหา events
 */
export function useSearchEvents(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => fetchSearch(query),
    enabled: query.length >= 2,
  });
}

/**
 * ดึง events ที่ยังไม่สิ้นสุด
 */
export function useUpcomingEvents() {
  return useQuery({
    queryKey: ["upcoming"],
    queryFn: fetchUpcoming,
  });
}

/**
 * ดึง events ที่มี GPS
 */
export function useMapEvents() {
  return useQuery({
    queryKey: ["map"],
    queryFn: fetchMap,
  });
}

// ============================================================================
// Pagination Types & Hook
// ============================================================================

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface EventsResponse {
  data: Event[];
  pagination: Pagination;
}

async function fetchEventsPaginated(
  page: number,
  limit: number,
  month?: string
): Promise<EventsResponse> {
  const params = new URLSearchParams();
  // Use offset instead of page for the API
  const offset = (page - 1) * limit;
  params.set("limit", limit.toString());
  params.set("offset", offset.toString());
  if (month) params.set("month", month);

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

/**
 * ดึง events แบบ pagination
 */
export function useEventsPaginated(
  page: number,
  limit: number = 12,
  month?: string
) {
  return useQuery({
    queryKey: ["events", "paginated", page, limit, month],
    queryFn: () => fetchEventsPaginated(page, limit, month),
    placeholderData: (previousData) => previousData, // Keep previous data while loading
  });
}
