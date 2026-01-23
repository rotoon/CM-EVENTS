# Architecture Overview

## System Overview

HYPE CNX is a full-stack web application for discovering events and places in Chiang Mai, Thailand. The system consists of three main components:

1. **Frontend** - Next.js 16 application with React 19
2. **Backend API** - Express.js REST API with TypeScript
3. **Database** - PostgreSQL database managed by Prisma ORM

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│                    Next.js 16 + React 19                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  - App Router (Server Components)                    │  │
│  │  - React Query (Data Fetching & Caching)              │  │
│  │  - next-intl (i18n - TH/EN)                          │  │
│  │  - Tailwind CSS 4 (Styling)                          │  │
│  │  - Leaflet + react-leaflet (Maps)                    │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTP/HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend API                             │
│                     Express.js 5 + TypeScript                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Layers:                                             │  │
│  │  - Routes (/events, /places, /trips, /admin)        │  │
│  │  - Controllers (Business Logic)                     │  │
│  │  - Services (Scraper, AI)                           │  │
│  │  - Repositories (Data Access)                       │  │
│  │  - Middlewares (Auth, Rate Limiting, Validation)    │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │PostgreSQL│  │ Cloudinary│  │External  │
        │Database  │  │(Images)  │  │Services  │
        └──────────┘  └──────────┘  └──────────┘
                                         │
                                ┌────────┴────────┐
                                ▼                 ▼
                          ┌──────────┐      ┌──────────┐
                          │Gemini AI │      │CMHY.city │
                          │(Trip AI) │      │(Source)  │
                          └──────────┘      └──────────┘
```

---

## Frontend Architecture

### Directory Structure

```
frontend/
├── app/
│   ├── [locale]/           # i18n routing
│   │   ├── (main)/         # Main app routes
│   │   │   ├── (event)/    # Event-related pages
│   │   │   ├── (place)/    # Place-related pages
│   │   │   └── page.tsx    # Home page
│   │   └── admin/          # Admin panel
│   ├── layout.tsx          # Root layout
│   ├── robots.ts           # SEO - robots.txt
│   └── sitemap.ts          # SEO - sitemap.xml
│
├── components/
│   ├── ui/                 # Reusable UI components (shadcn/ui)
│   ├── admin/              # Admin-specific components
│   ├── places/             # Place-specific components
│   └── error-boundary.tsx  # Error handling
│
├── hooks/
│   ├── use-events.ts       # React Query hooks for events
│   ├── use-places.ts       # React Query hooks for places
│   └── use-admin.ts        # Admin hooks
│
├── lib/
│   ├── api*.ts            # API clients
│   ├── utils.ts           # Utility functions
│   ├── date-utils.ts      # Date helpers
│   └── *.config.ts        # Configuration files
│
├── messages/               # i18n translation files
│   ├── en.json            # English
│   └── th.json            # Thai
│
└── public/                # Static assets
```

### Key Patterns

#### 1. App Router (Server Components)

- Uses Next.js 16 App Router with Server Components
- Dynamic routes with i18n support via `[locale]` parameter
- Route groups `()` for logical organization without affecting URL

#### 2. Data Fetching with React Query

```typescript
// Example: hooks/use-events.ts
export const useEvents = (params?: EventsQuery) => {
  return useQuery({
    queryKey: ['events', params],
    queryFn: () => fetchEvents(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

#### 3. Internationalization (i18n)

- **Framework**: `next-intl`
- **Languages**: Thai (th), English (en)
- **Implementation**: Dynamic routing with `[locale]` parameter
- **Files**: `messages/en.json`, `messages/th.json`

#### 4. Styling with Tailwind CSS 4

- Utility-first CSS framework
- Neo-Brutalist design system (bold colors, shadows)
- Responsive design (mobile-first)

#### 5. Map Integration

- **Library**: Leaflet + react-leaflet
- **Custom Markers**: Neo-Brutalist style
- **Features**: Interactive map with event/place clustering

---

## Backend Architecture

### Directory Structure

```
backend/
├── src/
│   ├── app.ts              # Express app setup
│   │
│   ├── controllers/        # Request handlers
│   │   ├── event.controller.ts
│   │   ├── place.controller.ts
│   │   ├── trip.controller.ts
│   │   ├── admin.controller.ts
│   │   └── scraper.controller.ts
│   │
│   ├── services/           # Business logic
│   │   ├── scraper.service.ts        # Web scraping
│   │   ├── detail-scraper.service.ts # Detailed scraping
│   │   ├── gemini.service.ts         # AI integration
│   │   └── cron.service.ts           # Scheduled tasks
│   │
│   ├── repositories/       # Data access layer
│   │   ├── event/
│   │   │   ├── index.ts
│   │   │   ├── pg.ts      # PostgreSQL implementation
│   │   │   └── prisma.ts  # Prisma implementation
│   │   └── place.repository.ts
│   │
│   ├── routes/             # Route definitions
│   │   ├── index.ts        # Main router
│   │   ├── admin.routes.ts
│   │   ├── place.routes.ts
│   │   └── trip.routes.ts
│   │
│   ├── middlewares/        # Express middlewares
│   │   ├── auth.middleware.ts     # JWT auth
│   │   ├── error.middleware.ts    # Error handling
│   │   ├── rate-limiter.middleware.ts
│   │   └── validation.middleware.ts
│   │
│   ├── config/             # Configuration
│   │   ├── database.ts
│   │   └── categories.ts
│   │
│   ├── types/              # TypeScript types
│   │   ├── index.ts
│   │   ├── event.interface.ts
│   │   ├── place.interface.ts
│   │   └── trip-planner.interface.ts
│   │
│   └── utils/              # Utility functions
│       ├── logger.ts
│       ├── response.util.ts
│       └── date.util.ts
│
├── api/                    # Legacy entry point
├── prisma/
│   └── schema.prisma       # Database schema
│
├── scripts/                # Utility scripts
│   ├── import-places.ts
│   ├── run-month-scraper.ts
│   └── check-status.ts
│
└── package.json
```

### Key Patterns

#### 1. Layered Architecture

```
Request → Middleware → Routes → Controllers → Services → Repositories → Database
```

- **Routes**: Define endpoints and attach middleware
- **Controllers**: Handle request/response, validation
- **Services**: Business logic, external integrations
- **Repositories**: Data access abstraction

#### 2. Repository Pattern

```typescript
// Interface for flexibility
interface EventRepository {
  findAll(params: QueryParams): Promise<Event[]>;
  findById(id: number): Promise<Event | null>;
  create(event: CreateEventDTO): Promise<Event>;
}

// PostgreSQL implementation
class PGEventRepository implements EventRepository {
  async findAll(params: QueryParams): Promise<Event[]> {
    // PostgreSQL query implementation
  }
}
```

#### 3. Middleware Stack

1. **CORS**: Cross-origin resource sharing
2. **Rate Limiting**: Prevent API abuse
3. **Authentication**: JWT verification for admin routes
4. **Validation**: Request payload validation with Zod
5. **Error Handling**: Centralized error responses

#### 4. Scraper Service

**Purpose**: Automated event data extraction from CMHY.city

**Flow**:
1. Fetch HTML from source URL
2. Parse with Cheerio
3. Extract event metadata (title, date, location)
4. Store in PostgreSQL database
5. Schedule via cron (daily)

#### 5. AI Integration (Gemini)

**Purpose**: Generate trip itineraries based on preferences

**Flow**:
1. Receive trip preferences (interests, duration, dates)
2. Fetch relevant events/places from database
3. Send to Google Gemini API for AI planning
4. Return structured itinerary

---

## Database Schema

### Events Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | Int | Primary key |
| `source_url` | String (unique) | Original URL from CMHY.city |
| `title` | String | Event title |
| `description` | String? | Event description |
| `location` | String? | Location name |
| `date_text` | String? | Date in text format |
| `month_wrapped` | String? | Month for filtering |
| `cover_image_url` | String? | Main image URL |
| `latitude` | Float? | GPS coordinate |
| `longitude` | Float? | GPS coordinate |
| `google_maps_url` | String? | Maps link |
| `facebook_url` | String? | Facebook link |
| `is_ended` | Boolean | Event status |
| `start_date` | Date? | Start date |
| `end_date` | Date? | End date |
| `is_fully_scraped` | Boolean | Scraper completion status |

### Places Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | Int | Primary key |
| `name` | String | Place name |
| `place_type` | String | Cafe, Food, Restaurant, Travel, Bar/Nightlife |
| `description` | String? | Instagram caption |
| `instagram_url` | String? (unique) | Instagram post URL |
| `likes` | Int? | Instagram likes count |
| `comments` | Int? | Instagram comments count |
| `latitude` | Float? | GPS coordinate |
| `longitude` | Float? | GPS coordinate |
| `google_maps_url` | String? | Maps link |
| `google_place_id` | String? | Google Places ID |
| `cover_image_url` | String? | Main image URL |
| `categories` | place_categories[] | Many-to-many relation |

---

## Data Flow

### Event Discovery Flow

```
User → Frontend → React Query → API → Controller → Service → Repository → PostgreSQL
                                            ↓
                                        (Cache)
                                            ↓
Frontend ← JSON ← Response ← Controller ← Service ← Repository ← PostgreSQL
```

### Trip Planning Flow

```
User → Frontend → API → Trip Controller → Gemini Service
                                              ↓
                                        Fetch Events/Places
                                              ↓
                                        Send to Gemini API
                                              ↓
                                        Receive Itinerary
                                              ↓
                                        Return to User
```

### Scraping Flow

```
Cron Service → Scraper Service → Fetch HTML → Parse with Cheerio
                                              ↓
                                        Extract Data
                                              ↓
                                        Save to PostgreSQL
```

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1.1 | React framework |
| React | 19.2.3 | UI library |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4 | Styling |
| React Query | 5.90.12 | Data fetching & caching |
| next-intl | 4.6.1 | Internationalization |
| Leaflet | 1.9.4 | Maps |
| react-leaflet | 5.0.0 | React Leaflet wrapper |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20+ | Runtime |
| Express.js | 5.2.1 | Web framework |
| TypeScript | 5.9.3 | Type safety |
| Prisma | 7.2.0 | ORM |
| PostgreSQL | - | Database |
| Cheerio | 1.1.2 | HTML parsing |
| Google Generative AI | 0.24.1 | AI integration |
| Zod | 4.2.1 | Schema validation |
| Pino | 10.1.0 | Logging |
| JWT | 9.0.3 | Authentication |

---

## Security Considerations

### Authentication

- JWT-based authentication for admin routes
- Token stored in HTTP-only cookies
- Password hashing (bcrypt) for user credentials

### Rate Limiting

- General endpoints: 100 req/15min
- Scraper endpoints: 5 req/hour
- Implemented via `express-rate-limit`

### Input Validation

- All inputs validated with Zod schemas
- SQL injection prevention via Prisma ORM
- XSS prevention via React's built-in sanitization

### CORS

- Configured to allow frontend domain only
- Prevents unauthorized cross-origin requests

---

## Scalability Considerations

### Current Setup

- **Database**: Single PostgreSQL instance (Railway)
- **Caching**: React Query on frontend (5 min stale time)
- **Deployment**: Railway (managed platform)

### Potential Improvements

1. **Database**: Add connection pooling (PgBouncer)
2. **Caching**: Redis for API response caching
3. **CDN**: CloudFlare for static assets
4. **Horizontal Scaling**: Container orchestration (Kubernetes)
5. **Scraping**: Queue-based system (BullMQ) for async processing

---

## Performance Optimizations

### Frontend

- **Server Components**: Reduce client-side JavaScript
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting
- **React Query**: Deduplicate requests, stale-while-revalidate

### Backend

- **Connection Pooling**: Reuse database connections
- **Pagination**: Limit result sets
- **Indexes**: Database indexes on frequently queried columns
- **Lazy Loading**: Scraper only fetches details when needed

---

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│           Railway Platform               │
├─────────────────┬───────────────────────┤
│   Frontend      │    Backend            │
│   (Next.js)     │    (Express.js)       │
│   Port: 3000    │    Port: 8000         │
└────────┬────────┴───────────┬───────────┘
         │                    │
         ▼                    ▼
  Railway (Static Files)  Railway (PostgreSQL)
         │
         ▼
  CloudFlare CDN (Optional)
```

- **Frontend**: Deployed as static site with Next.js standalone output
- **Backend**: Node.js service on Railway
- **Database**: Managed PostgreSQL on Railway
- **Images**: Cloudinary for image hosting (optional)
