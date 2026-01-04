/**
 * Places API Functions
 * API calls สำหรับ Places feature
 */

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL ||
  'https://backend-production-14fd.up.railway.app'
).replace(/\/$/, '')

// ===== Types =====

export interface Place {
  id: number
  name: string
  place_type: string
  description: string | null
  instagram_url: string | null
  likes: number | null
  comments: number | null
  latitude: number | null
  longitude: number | null
  google_maps_url: string | null
  google_place_id: string | null
  cover_image_url: string | null
  post_date: string | null
  created_at: string | null
  updated_at: string | null
  categories: PlaceCategory[]
  category_names: string[]
}

export interface PlaceCategory {
  id: number
  place_id: number
  category: string
}

export interface PlacesResponse {
  data: Place[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}

export interface PlaceFilter {
  place_type?: string
  category?: string
  search?: string
  limit?: number
  offset?: number
}

export interface CategoryCount {
  category: string
  count: number
}

export interface PlaceTypeCount {
  place_type: string
  count: number
}

// ===== API Functions =====

export async function fetchPlaces(
  filters: PlaceFilter = {}
): Promise<PlacesResponse> {
  const params = new URLSearchParams()

  if (filters.place_type) params.set('place_type', filters.place_type)
  if (filters.category) params.set('category', filters.category)
  if (filters.search) params.set('search', filters.search)
  if (filters.limit) params.set('limit', filters.limit.toString())
  if (filters.offset) params.set('offset', filters.offset.toString())

  const response = await fetch(`${API_BASE}/places?${params.toString()}`, {
    next: { revalidate: 60 },
  })
  const json = await response.json()

  return {
    data: json.data?.data || [],
    pagination: json.data?.pagination || {
      total: 0,
      limit: 20,
      offset: 0,
      hasMore: false,
    },
  }
}

export async function fetchPlaceById(id: number): Promise<Place | null> {
  const response = await fetch(`${API_BASE}/places/${id}`, {
    next: { revalidate: 60 },
  })
  const json = await response.json()

  if (!json.success) return null
  return json.data as Place
}

export async function fetchPlaceCategories(): Promise<CategoryCount[]> {
  const response = await fetch(`${API_BASE}/places/categories`, {
    next: { revalidate: 3600 },
  })
  const json = await response.json()
  return (json.data || []) as CategoryCount[]
}

export async function fetchPlaceTypes(): Promise<PlaceTypeCount[]> {
  const response = await fetch(`${API_BASE}/places/types`, {
    next: { revalidate: 3600 },
  })
  const json = await response.json()
  return (json.data || []) as PlaceTypeCount[]
}

export async function searchPlaces(
  query: string,
  limit = 10
): Promise<Place[]> {
  const response = await fetch(
    `${API_BASE}/places/search?q=${encodeURIComponent(query)}&limit=${limit}`,
    { cache: 'no-store' }
  )
  const json = await response.json()
  return json.data as Place[]
}

export async function fetchPlacesPaginated(
  page: number,
  limit: number,
  filters: PlaceFilter = {}
): Promise<{
  data: Place[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}> {
  const offset = (page - 1) * limit
  const response = await fetchPlaces({ ...filters, limit, offset })

  return {
    data: response.data,
    pagination: {
      page,
      limit,
      total: response.pagination.total,
      totalPages: Math.ceil(response.pagination.total / limit),
      hasNext: response.pagination.hasMore,
      hasPrev: page > 1,
    },
  }
}
