/**
 * Admin API Functions
 */

import { API_BASE, getAuthHeaders, handleApiResponse } from "@/lib/api-config";
import type {
  AdminDashboard,
  AdminEventsResponse,
  Event,
  EventFormData,
  EventWithImages,
  LoginResponse,
} from "@/types";

export async function adminLogin(password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });

  return handleApiResponse<LoginResponse>(response);
}

export async function fetchAdminDashboard(): Promise<AdminDashboard> {
  const response = await fetch(`${API_BASE}/admin/dashboard`, {
    headers: getAuthHeaders(),
    cache: "no-store",
  });

  return handleApiResponse<AdminDashboard>(response);
}

export async function fetchAdminEvents(
  offset: number = 0,
  limit: number = 20,
  search?: string
): Promise<AdminEventsResponse> {
  const params = new URLSearchParams();
  params.set("limit", limit.toString());
  params.set("offset", offset.toString());
  if (search) params.set("search", search);

  const response = await fetch(`${API_BASE}/admin/events?${params}`, {
    headers: getAuthHeaders(),
    cache: "no-store",
  });

  return handleApiResponse<AdminEventsResponse>(response);
}

export async function fetchAdminEvent(id: number): Promise<EventWithImages> {
  const response = await fetch(`${API_BASE}/admin/events/${id}`, {
    headers: getAuthHeaders(),
    cache: "no-store",
  });

  return handleApiResponse<EventWithImages>(response);
}

export async function createEvent(data: EventFormData): Promise<Event> {
  const response = await fetch(`${API_BASE}/admin/events`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleApiResponse<Event>(response);
}

export async function updateEvent(
  id: number,
  data: EventFormData
): Promise<Event> {
  const response = await fetch(`${API_BASE}/admin/events/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleApiResponse<Event>(response);
}

export async function deleteEvent(id: number): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE}/admin/events/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return handleApiResponse<{ message: string }>(response);
}

// Re-export types for convenience
export type {
  AdminDashboard,
  AdminEventsResponse,
  EventFormData,
  LoginResponse,
} from "@/types";
