/**
 * Admin Places API Functions
 */

import { API_BASE, getAuthHeaders, handleApiResponse } from "@/lib/api-config";
import type {
  AdminPlacesDashboard,
  AdminPlacesResponse,
  Place,
  PlaceFormData,
} from "@/types";

export async function fetchAdminPlacesDashboard(): Promise<AdminPlacesDashboard> {
  const response = await fetch(`${API_BASE}/admin/places/dashboard`, {
    headers: getAuthHeaders(),
    cache: "no-store",
  });

  return handleApiResponse<AdminPlacesDashboard>(response);
}

export async function fetchAdminPlaces(
  offset: number = 0,
  limit: number = 20,
  search?: string,
  place_type?: string
): Promise<AdminPlacesResponse> {
  const params = new URLSearchParams();
  params.set("limit", limit.toString());
  params.set("offset", offset.toString());
  if (search) params.set("search", search);
  if (place_type) params.set("place_type", place_type);

  const response = await fetch(`${API_BASE}/admin/places?${params}`, {
    headers: getAuthHeaders(),
    cache: "no-store",
  });

  return handleApiResponse<AdminPlacesResponse>(response);
}

export async function fetchAdminPlace(id: number): Promise<Place> {
  const response = await fetch(`${API_BASE}/admin/places/${id}`, {
    headers: getAuthHeaders(),
    cache: "no-store",
  });

  return handleApiResponse<Place>(response);
}

export async function createPlace(data: PlaceFormData): Promise<Place> {
  const response = await fetch(`${API_BASE}/admin/places`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleApiResponse<Place>(response);
}

export async function updatePlace(
  id: number,
  data: PlaceFormData
): Promise<Place> {
  const response = await fetch(`${API_BASE}/admin/places/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleApiResponse<Place>(response);
}

export async function deletePlace(id: number): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE}/admin/places/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return handleApiResponse<{ message: string }>(response);
}

// Re-export types for convenience
export type {
  AdminPlacesDashboard,
  AdminPlacesResponse,
  PlaceFormData,
} from "@/types";
