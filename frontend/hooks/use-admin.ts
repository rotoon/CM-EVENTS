"use client";

import {
  adminLogin,
  createEvent,
  deleteEvent,
  EventFormData,
  fetchAdminDashboard,
  fetchAdminEvent,
  fetchAdminEvents,
  fetchEventMonths,
  updateEvent,
} from "@/lib/admin-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ============================================================================
// React Query Hooks for Admin
// ============================================================================

/**
 * Hook for admin login
 */
export function useAdminLogin() {
  return useMutation({
    mutationFn: adminLogin,
    onSuccess: (data) => {
      localStorage.setItem("admin_token", data.token);
    },
  });
}

/**
 * Hook for admin dashboard data
 */
export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: fetchAdminDashboard,
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook for admin events list
 */
export function useAdminEvents(
  offset: number = 0,
  limit: number = 20,
  search?: string,
  month?: string,
  category?: string,
  status?: string
) {
  return useQuery({
    queryKey: [
      "admin",
      "events",
      offset,
      limit,
      search,
      month,
      category,
      status,
    ],
    queryFn: () =>
      fetchAdminEvents(offset, limit, search, month, category, status),
  });
}

/**
 * Hook for event months
 */
export function useEventMonths() {
  return useQuery({
    queryKey: ["admin", "events", "months"],
    queryFn: fetchEventMonths,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for single event (for editing)
 */
export function useAdminEvent(id: number) {
  return useQuery({
    queryKey: ["admin", "event", id],
    queryFn: () => fetchAdminEvent(id),
    enabled: !!id,
  });
}

/**
 * Hook for creating event
 */
export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}

/**
 * Hook for updating event
 */
export function useUpdateEvent(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EventFormData) => updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "event", id] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}

/**
 * Hook for deleting event
 */
export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}
