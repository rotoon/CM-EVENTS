"use client";

import {
  createPlace,
  deletePlace,
  fetchAdminPlace,
  fetchAdminPlaces,
  fetchAdminPlacesDashboard,
  PlaceFormData,
  updatePlace,
} from "@/lib/admin-places-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ============================================================================
// React Query Hooks for Admin Places
// ============================================================================

/**
 * Hook for admin places dashboard
 */
export function useAdminPlacesDashboard() {
  return useQuery({
    queryKey: ["admin", "places", "dashboard"],
    queryFn: fetchAdminPlacesDashboard,
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook for admin places list
 */
export function useAdminPlaces(
  offset: number = 0,
  limit: number = 20,
  search?: string,
  place_type?: string
) {
  return useQuery({
    queryKey: ["admin", "places", offset, limit, search, place_type],
    queryFn: () => fetchAdminPlaces(offset, limit, search, place_type),
  });
}

/**
 * Hook for single place (for editing)
 */
export function useAdminPlace(id: number) {
  return useQuery({
    queryKey: ["admin", "place", id],
    queryFn: () => fetchAdminPlace(id),
    enabled: !!id,
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook for creating place
 */
export function useCreatePlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPlace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "places"] });
    },
  });
}

/**
 * Hook for updating place
 */
export function useUpdatePlace(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PlaceFormData) => updatePlace(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "places"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "place", id] });
    },
  });
}

/**
 * Hook for deleting place
 */
export function useDeletePlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePlace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "places"] });
    },
  });
}
