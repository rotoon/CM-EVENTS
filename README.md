# 🚀 HYPE CNX

**The loudest event feed in the North.** Discover events, lifestyle, and unique experiences in Chiang Mai, Thailand.

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwindcss)
![Railway](https://img.shields.io/badge/Railway-Deployed-0B0D0E?logo=railway)

---

## 🌐 Live Demo

**[https:///hypecnx.com/](https:///hypecnx.com/)**

---

## ✨ Features

| Feature                     | Description                                              |
| --------------------------- | -------------------------------------------------------- |
| 🗓️ **Event Discovery**      | Browse events by month, category, or search              |
| 🗺️ **Interactive Map**      | Leaflet-based map with custom Neo-Brutalist markers      |
| 🎨 **Neo-Brutalist Design** | Bold, modern UI with striking colors and shadows         |
| 📱 **Fully Responsive**     | Mobile-first design that works on all devices            |
| 🔍 **SEO Optimized**        | Server Components, dynamic metadata, sitemap, robots.txt |
| ♿ **Accessible**           | ARIA labels, keyboard navigation support                 |
| ⚡ **Fast**                 | React Query caching, infinite scroll, optimized images   |

---

## 🏗️ Project Structure

```
CM-EVENTS/
├── frontend/          # Next.js 16 App (React 19)
│   ├── app/           # App Router pages
│   ├── components/    # Reusable UI components
│   ├── hooks/         # React Query hooks
│   ├── lib/           # Utilities, types, API client
│   └── public/        # Static assets
│
├── backend/           # Express.js API
│   ├── src/
│   │   ├── controllers/   # API handlers
│   │   ├── services/      # Business logic + Scraper
│   │   ├── routes/        # Route definitions
│   │   ├── config/        # Database config
│   │   └── utils/         # Helpers
│   └── api/               # Legacy entry point
│
└── design/            # Design assets & mockups
```

---

## 🛠️ Tech Stack

### Frontend

- **Framework:** Next.js 16 (App Router, React 19)
- **Styling:** Tailwind CSS 4
- **State:** React Query (TanStack Query)
- **Maps:** Leaflet + react-leaflet
- **Icons:** Lucide React
- **Language:** TypeScript 5

### Backend

- **Runtime:** Node.js + tsx
- **Framework:** Express.js 5
- **Database:** PostgreSQL (Railway)
- **Scraper:** Cheerio + Axios
- **AI:** Google Generative AI (for content extraction)

### Deployment

- **Platform:** Railway
- **Build:** Docker (standalone Next.js output)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended)
- PostgreSQL database

### Frontend

```bash
cd frontend

# Install dependencies
pnpm install

# Set environment variables
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Run development server
pnpm dev

# Build for production
pnpm build

# Deploy to Railway
pnpm deploy
```

### Backend

```bash
cd backend

# Install dependencies
pnpm install

# Set environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run development server
pnpm dev

# Deploy to Railway
pnpm deploy
```

---

## 🌐 API Endpoints

| Method | Endpoint         | Description                            |
| ------ | ---------------- | -------------------------------------- |
| GET    | `/events`        | List events (with pagination, filters) |
| GET    | `/events/:id`    | Get event by ID with images            |
| GET    | `/months`        | Get available months                   |
| GET    | `/categories`    | Get event categories                   |
| GET    | `/stats`         | Get event statistics                   |
| GET    | `/search?q=`     | Search events                          |
| GET    | `/upcoming`      | Get upcoming events                    |
| GET    | `/map`           | Get events with GPS coordinates        |
| GET    | `/scrape/status` | Scraper status                         |

---

## 🎨 Design System

### Neo-Brutalist Color Palette

| Color          | Hex       | Usage                 |
| -------------- | --------- | --------------------- |
| **Neo Lime**   | `#ccff00` | Primary accents, CTAs |
| **Neo Pink**   | `#ff00ff` | Highlights, badges    |
| **Neo Purple** | `#9d00ff` | Secondary accents     |
| **Neo Black**  | `#000000` | Text, borders         |
| **Neo White**  | `#ffffff` | Backgrounds           |

### Typography

- **Display:** Outfit (headings)
- **Sans:** Kanit (body text, Thai support)
- **Mono:** JetBrains Mono (code, labels)

---

## 📁 Key Files

| File                                      | Description                   |
| ----------------------------------------- | ----------------------------- |
| `frontend/app/layout.tsx`                 | Root layout with SEO metadata |
| `frontend/components/error-boundary.tsx`  | Error handling component      |
| `frontend/lib/api.ts`                     | API client functions          |
| `frontend/hooks/use-events.ts`            | React Query hooks             |
| `backend/src/app.ts`                      | Express app setup             |
| `backend/src/services/scraper.service.ts` | Event scraper                 |

---

## 🔧 Scripts

### Frontend

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run ESLint
pnpm deploy   # Deploy to Railway
```

### Backend

```bash
pnpm dev      # Start with hot reload
pnpm start    # Start production server
pnpm deploy   # Deploy to Railway
```

---

## 🚢 Deployment

Both frontend and backend are configured for Railway deployment:

```bash
# Frontend
cd frontend && railway up

# Backend
cd backend && railway up
```

Docker files are included for containerized deployment.

---

## 📄 License

MIT © 2025 Hype CNX Team

---

## 🙏 Acknowledgments

- Event data sourced from [CMHY.city](https://cmhy.city)
- Icons by [Lucide](https://lucide.dev)
- Maps by [OpenStreetMap](https://openstreetmap.org)
