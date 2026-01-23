# API Documentation

Base URL: `http://localhost:8000` (development) or deployed Railway URL

**Authentication**: Most admin routes require JWT token obtained from `/admin/login`

---

## Table of Contents

- [Events](#events)
- [Places](#places)
- [Trips](#trips)
- [Admin](#admin)
- [Scraper](#scraper)

---

## Events

### Get Events

```http
GET /events
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Items per page (default: 20) |
| `month` | string | No | Filter by month (e.g., "January 2025") |
| `category` | string | No | Filter by category |
| `ended` | boolean | No | Include ended events (default: false) |

**Response:**

```json
{
  "success": true,
  "data": {
    "events": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150
    }
  }
}
```

---

### Get Event by ID

```http
GET /events/:id
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Event Name",
    "description": "...",
    "date_text": "January 15, 2025",
    "location": "Chiang Mai",
    "latitude": 18.7883,
    "longitude": 98.9853,
    "cover_image_url": "...",
    "google_maps_url": "...",
    "facebook_url": "...",
    "images": [...]
  }
}
```

---

### Get Available Months

```http
GET /months
```

**Response:**

```json
{
  "success": true,
  "data": ["January 2025", "February 2025", ...]
}
```

---

### Get Event Categories

```http
GET /categories
```

**Response:**

```json
{
  "success": true,
  "data": ["Music", "Art", "Food", "Workshop", ...]
}
```

---

### Search Events

```http
GET /search?q=<query>
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | Yes | Search query |

**Response:**

```json
{
  "success": true,
  "data": {
    "events": [...],
    "count": 10
  }
}
```

---

### Get Upcoming Events

```http
GET /upcoming
```

**Response:**

```json
{
  "success": true,
  "data": [...]
}
```

---

### Get Map Events

```http
GET /map
```

Returns events with GPS coordinates for map display.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Event Name",
      "latitude": 18.7883,
      "longitude": 98.9853,
      "location": "Chiang Mai",
      "start_date": "2025-01-15"
    }
  ]
}
```

---

### Get Event Statistics

```http
GET /stats
```

**Response:**

```json
{
  "success": true,
  "data": {
    "total_events": 150,
    "upcoming_events": 45,
    "categories_count": 8
  }
}
```

---

## Places

### Get Places

```http
GET /places
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | No | Filter by place type (Cafe, Food, Restaurant, Travel, Bar/Nightlife) |
| `page` | number | No | Page number |
| `limit` | number | No | Items per page |

**Response:**

```json
{
  "success": true,
  "data": {
    "places": [...],
    "pagination": {...}
  }
}
```

---

### Get Place by ID

```http
GET /places/:id
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Cafe Name",
    "place_type": "Cafe",
    "description": "...",
    "latitude": 18.7883,
    "longitude": 98.9853,
    "google_maps_url": "...",
    "cover_image_url": "...",
    "instagram_url": "...",
    "likes": 1500,
    "comments": 200,
    "categories": ["Coffee", "Pastries"],
    "images": [...]
  }
}
```

---

## Trips

### Plan Trip

```http
POST /trips
```

**Request Body:**

```json
{
  "preferences": {
    "interests": ["food", "art", "music"],
    "duration_days": 3,
    "start_date": "2025-01-20",
    "location": "Chiang Mai"
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "itinerary": [
      {
        "day": 1,
        "activities": [
          {
            "type": "event",
            "title": "Art Exhibition",
            "time": "10:00 AM",
            "location": "..."
          },
          {
            "type": "place",
            "title": "Cafe Name",
            "time": "2:00 PM",
            "location": "..."
          }
        ]
      }
    ],
    "total_activities": 10
  }
}
```

---

## Admin

### Login

```http
POST /admin/login
```

**Request Body:**

```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "username": "admin"
    }
  }
}
```

---

### Get Dashboard Stats

```http
GET /admin/dashboard
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "total_events": 150,
    "total_places": 80,
    "upcoming_events": 45
  }
}
```

---

### Admin Event Management

All admin event routes require authentication.

#### Get All Events (Admin)

```http
GET /admin/events
Authorization: Bearer <token>
```

#### Get Event by ID (Admin)

```http
GET /admin/events/:id
Authorization: Bearer <token>
```

#### Create Event

```http
POST /admin/events
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "title": "New Event",
  "description": "Event description",
  "date_text": "January 20, 2025",
  "location": "Chiang Mai",
  "latitude": 18.7883,
  "longitude": 98.9853,
  "cover_image_url": "..."
}
```

#### Update Event

```http
PUT /admin/events/:id
Authorization: Bearer <token>
```

#### Delete Event

```http
DELETE /admin/events/:id
Authorization: Bearer <token>
```

---

### Admin Place Management

#### Get All Places (Admin)

```http
GET /admin/places
Authorization: Bearer <token>
```

#### Get Place by ID (Admin)

```http
GET /admin/places/:id
Authorization: Bearer <token>
```

#### Create Place

```http
POST /admin/places
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "name": "New Place",
  "place_type": "Cafe",
  "description": "...",
  "latitude": 18.7883,
  "longitude": 98.9853,
  "instagram_url": "..."
}
```

#### Update Place

```http
PUT /admin/places/:id
Authorization: Bearer <token>
```

#### Delete Place

```http
DELETE /admin/places/:id
Authorization: Bearer <token>
```

---

## Scraper

### Trigger Scrape

```http
POST /scrape
```

**Note:** This endpoint has strict rate limiting.

**Response:**

```json
{
  "success": true,
  "data": {
    "status": "started",
    "message": "Scraping initiated"
  }
}
```

---

### Get Scraper Status

```http
GET /scrape/status
```

**Response:**

```json
{
  "success": true,
  "data": {
    "last_scraped_at": "2025-01-15T10:30:00Z",
    "total_events": 150,
    "scraped_today": 25,
    "is_running": false
  }
}
```

---

## Error Responses

All endpoints follow consistent error response format:

**400 Bad Request**

```json
{
  "success": false,
  "error": "Validation error",
  "details": "Invalid parameter format"
}
```

**401 Unauthorized**

```json
{
  "success": false,
  "error": "Unauthorized",
  "details": "Invalid or missing authentication token"
}
```

**404 Not Found**

```json
{
  "success": false,
  "error": "Not found",
  "details": "Resource does not exist"
}
```

**500 Internal Server Error**

```json
{
  "success": false,
  "error": "Internal server error",
  "details": "Something went wrong"
}
```

---

## Rate Limiting

- **General endpoints**: 100 requests per 15 minutes
- **Scraper endpoints**: 5 requests per hour

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642234567
```

---

## Pagination

All list endpoints support pagination:

| Query Parameter | Type | Default | Description |
|-----------------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page (max: 100) |

Pagination metadata in response:

```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8,
    "has_next": true,
    "has_prev": false
  }
}
```
