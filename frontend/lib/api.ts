import { API_BASE } from "@/lib/api-config";
import { sortByEndDate } from "@/lib/date-utils";
import type {
  Category,
  Event,
  EventsResponse,
  EventStats,
  EventWithImages,
} from "@/types";

export async function fetchEvents(month?: string): Promise<Event[]> {
  const params = new URLSearchParams();
  if (month) params.set("month", month);
  params.set("limit", "200");

  const response = await fetch(`${API_BASE}/events?${params.toString()}`, {
    next: { revalidate: 60 },
  });
  const json = await response.json();
  return sortByEndDate((json.data?.events || json.data || []) as Event[]);
}

export async function fetchEventById(
  id: number
): Promise<EventWithImages | null> {
  const response = await fetch(`${API_BASE}/events/${id}`, {
    next: { revalidate: 60 },
  });
  const json = await response.json();
  if (json.error) return null;
  return json.data as EventWithImages;
}

export async function fetchMonths(): Promise<string[]> {
  const response = await fetch(`${API_BASE}/months`, {
    next: { revalidate: 3600 },
  });
  const json = await response.json();
  return json.data as string[];
}

export async function fetchStats(): Promise<EventStats> {
  const response = await fetch(`${API_BASE}/stats`, {
    next: { revalidate: 60 },
  });
  const json = await response.json();
  return json.data as EventStats;
}

export async function fetchSearch(query: string): Promise<Event[]> {
  const response = await fetch(
    `${API_BASE}/search?q=${encodeURIComponent(query)}`,
    { cache: "no-store" }
  );
  const json = await response.json();
  return json.data as Event[];
}

export async function fetchUpcoming(): Promise<Event[]> {
  const response = await fetch(`${API_BASE}/upcoming`, {
    next: { revalidate: 60 },
  });
  const json = await response.json();
  return sortByEndDate(json.data as Event[]);
}

export async function fetchMap(): Promise<Event[]> {
  const response = await fetch(`${API_BASE}/map`, {
    next: { revalidate: 60 },
  });
  const json = await response.json();
  return json.data as Event[];
}

export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE}/categories`, {
    next: { revalidate: 3600 },
  });
  const json = await response.json();
  return json.data as Category[];
}

export async function fetchEventsPaginated(
  page: number,
  limit: number,
  month?: string,
  category?: string
): Promise<EventsResponse> {
  const params = new URLSearchParams();
  const offset = (page - 1) * limit;
  params.set("limit", limit.toString());
  params.set("offset", offset.toString());
  if (month) params.set("month", month);
  if (category) params.set("category", category);

  const response = await fetch(`${API_BASE}/events?${params.toString()}`, {
    next: { revalidate: 60 },
  });
  const json = await response.json();

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
