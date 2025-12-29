'use client'

import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import {
  fetchCategories,
  fetchEventById,
  fetchEvents,
  fetchEventsPaginated,
  fetchMap,
  fetchMonths,
  fetchSearch,
  fetchStats,
  fetchUpcoming,
} from '@/lib/api'

// ============================================================================
// React Query Hooks
// ============================================================================

export function useEvents(month?: string) {
  return useQuery({
    queryKey: ['events', month],
    queryFn: () => fetchEvents(month),
  })
}

export function useEventById(id: number) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => fetchEventById(id),
    enabled: !!id,
  })
}

export function useMonths() {
  return useQuery({
    queryKey: ['months'],
    queryFn: fetchMonths,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useEventStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useSearchEvents(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => fetchSearch(query),
    enabled: query.length >= 2,
  })
}

export function useUpcomingEvents() {
  return useQuery({
    queryKey: ['upcoming'],
    queryFn: fetchUpcoming,
  })
}

export function useMapEvents() {
  return useQuery({
    queryKey: ['map'],
    queryFn: fetchMap,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 60 * 60 * 1000, // 1 hour
  })
}

export function useEventsPaginated(
  page: number,
  limit: number = 12,
  month?: string,
  category?: string
) {
  return useQuery({
    queryKey: ['events', 'paginated', page, limit, month, category],
    queryFn: () => fetchEventsPaginated(page, limit, month, category),
  })
}

export function useEventsInfinite(
  limit: number = 12,
  month?: string,
  category?: string
) {
  return useInfiniteQuery({
    queryKey: ['events', 'infinite', limit, month, category],
    queryFn: ({ pageParam = 1 }) =>
      fetchEventsPaginated(pageParam as number, limit, month, category),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
    initialPageParam: 1,
  })
}
