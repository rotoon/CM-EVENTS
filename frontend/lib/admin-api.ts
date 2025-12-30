/**
 * Admin API Functions
 *
 * API functions for admin dashboard
 */

import { Event, EventWithImages } from '@/lib/types'

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL ||
  'https://backend-production-14fd.up.railway.app'
).replace(/\/$/, '')

// ============================================================================
// Types
// ============================================================================

export interface AdminDashboard {
  stats: {
    total: number
    fullyScraped: number
    pending: number
  }
  recentEvents: {
    id: number
    title: string
    location: string | null
    cover_image_url: string | null
    date_text: string | null
  }[]
}

export interface AdminEventsResponse {
  events: Event[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}

export interface EventFormData {
  title: string
  description?: string
  location?: string
  date_text?: string
  time_text?: string
  cover_image_url?: string
  latitude?: string
  longitude?: string
  google_maps_url?: string
  facebook_url?: string
  is_ended?: boolean
}

export interface LoginResponse {
  token: string
}

// ============================================================================
// Helper Functions
// ============================================================================

function getAuthHeaders(): HeadersInit {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const json = await response.json()

  if (!response.ok || !json.success) {
    throw new Error(json.error || 'Request failed')
  }

  return json.data as T
}

// ============================================================================
// API Functions
// ============================================================================

export async function adminLogin(password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })

  return handleResponse<LoginResponse>(response)
}

export async function fetchAdminDashboard(): Promise<AdminDashboard> {
  const response = await fetch(`${API_BASE}/admin/dashboard`, {
    headers: getAuthHeaders(),
    cache: 'no-store',
  })

  return handleResponse<AdminDashboard>(response)
}

export async function fetchAdminEvents(
  offset: number = 0,
  limit: number = 20,
  search?: string
): Promise<AdminEventsResponse> {
  const params = new URLSearchParams()
  params.set('limit', limit.toString())
  params.set('offset', offset.toString())
  if (search) params.set('search', search)

  const response = await fetch(`${API_BASE}/admin/events?${params}`, {
    headers: getAuthHeaders(),
    cache: 'no-store',
  })

  return handleResponse<AdminEventsResponse>(response)
}

export async function fetchAdminEvent(id: number): Promise<EventWithImages> {
  const response = await fetch(`${API_BASE}/admin/events/${id}`, {
    headers: getAuthHeaders(),
    cache: 'no-store',
  })

  return handleResponse<EventWithImages>(response)
}

export async function createEvent(data: EventFormData): Promise<Event> {
  const response = await fetch(`${API_BASE}/admin/events`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })

  return handleResponse<Event>(response)
}

export async function updateEvent(
  id: number,
  data: EventFormData
): Promise<Event> {
  const response = await fetch(`${API_BASE}/admin/events/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })

  return handleResponse<Event>(response)
}

export async function deleteEvent(id: number): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE}/admin/events/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })

  return handleResponse<{ message: string }>(response)
}
