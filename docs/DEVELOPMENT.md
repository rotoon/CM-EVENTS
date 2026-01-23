# Development Guide

## Getting Started

This guide will help you set up your development environment and start contributing to HYPE CNX.

---

## Prerequisites

- **Node.js** 20+ ([Download](https://nodejs.org/))
- **pnpm** 8+ ([Installation](https://pnpm.io/installation))
- **PostgreSQL** 15+ ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/downloads))

---

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/CM-EVENTS.git
cd CM-EVENTS
```

### 2. Install Dependencies

#### Backend

```bash
cd backend
pnpm install
cd ..
```

#### Frontend

```bash
cd frontend
pnpm install
cd ..
```

### 3. Set Up Environment Variables

See [Environment Variables](docs/ENV.md) for details.

Create `.env` files in both `backend/` and `frontend/`:

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your credentials

# Frontend
cd ../frontend
cp .env.local.example .env.local
# Edit .env.local with your API URL
```

### 4. Set Up Database

#### Option A: Use Local PostgreSQL

```bash
# Create database
psql -U postgres
CREATE DATABASE hype_cnx;
\q

# Run migrations
cd backend
npx prisma db push
```

#### Option B: Use Railway (Recommended)

1. Create Railway account
2. Create PostgreSQL service
3. Copy connection string to `backend/.env`

---

## Running the Application

### Backend Development Server

```bash
cd backend
pnpm dev
```

Backend runs on `http://localhost:8000`

### Frontend Development Server

```bash
cd frontend
pnpm dev
```

Frontend runs on `http://localhost:3000`

---

## Project Structure

### Backend

```
backend/
├── src/
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── repositories/     # Data access
│   ├── routes/           # API routes
│   ├── middlewares/      # Express middlewares
│   ├── config/           # Configuration
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions
├── prisma/
│   └── schema.prisma     # Database schema
├── scripts/              # Utility scripts
└── api/                  # Entry point
```

### Frontend

```
frontend/
├── app/
│   ├── [locale]/         # i18n routes
│   │   ├── (main)/       # Main app
│   │   └── admin/        # Admin panel
│   └── layout.tsx        # Root layout
├── components/
│   ├── ui/               # Reusable UI
│   ├── admin/            # Admin components
│   └── places/           # Place components
├── hooks/                # React Query hooks
├── lib/                  # Utilities & API clients
├── messages/             # i18n translations
└── public/               # Static assets
```

---

## Development Workflow

### Adding a New API Endpoint

1. **Define Route** (`backend/src/routes/`)

```typescript
import { Router } from "express";
import { MyController } from "../controllers/my.controller";

const router = Router();
router.get("/my-endpoint", MyController.getMethod);
export default router;
```

2. **Register Route** (`backend/src/routes/index.ts`)

```typescript
import myRoutes from "./my.routes";
router.use("/my-route", myRoutes);
```

3. **Create Controller** (`backend/src/controllers/`)

```typescript
export const MyController = {
  getMethod: async (req: Request, res: Response) => {
    try {
      const data = await MyService.getData();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },
};
```

4. **Create Service** (`backend/src/services/`)

```typescript
export const MyService = {
  getData: async () => {
    return await MyRepository.findAll();
  },
};
```

5. **Create Repository** (`backend/src/repositories/`)

```typescript
export const MyRepository = {
  findAll: async () => {
    return await prisma.myModel.findMany();
  },
};
```

### Adding a New Frontend Page

1. **Create Page** (`frontend/app/[locale]/(main)/my-page/page.tsx`)

```typescript
import { useMyData } from "@/hooks/use-my-data";

export default function MyPage() {
  const { data, isLoading, error } = useMyData();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div>
      <h1>My Page</h1>
      {/* Render data */}
    </div>
  );
}
```

2. **Create Hook** (`frontend/hooks/use-my-data.ts`)

```typescript
import { useQuery } from "@tanstack/react-query";
import { fetchMyData } from "@/lib/api-my-data";

export const useMyData = () => {
  return useQuery({
    queryKey: ["my-data"],
    queryFn: fetchMyData,
  });
};
```

3. **Create API Client** (`frontend/lib/api-my-data.ts`)

```typescript
import { API_URL } from "./api-config";

export async function fetchMyData() {
  const response = await fetch(`${API_URL}/my-endpoint`);
  if (!response.ok) throw new Error("Failed to fetch");
  return response.json();
}
```

### Adding Internationalization

1. **Add Translation Key** (`frontend/messages/en.json`)

```json
{
  "myPage": {
    "title": "My Page",
    "description": "Description here"
  }
}
```

2. **Add Thai Translation** (`frontend/messages/th.json`)

```json
{
  "myPage": {
    "title": "หน้าของฉัน",
    "description": "คำอธิบายที่นี่"
  }
}
```

3. **Use in Component**

```typescript
import { useTranslations } from "next-intl";

export default function MyPage() {
  const t = useTranslations("myPage");
  return <h1>{t("title")}</h1>;
}
```

---

## Database Operations

### Using Prisma Client

```typescript
import { prisma } from "@/src/lib/prisma";

// Create
const newEvent = await prisma.events.create({
  data: {
    title: "New Event",
    source_url: "https://example.com/event",
  },
});

// Read
const event = await prisma.events.findUnique({
  where: { id: 1 },
});

// Update
const updated = await prisma.events.update({
  where: { id: 1 },
  data: { title: "Updated Title" },
});

// Delete
await prisma.events.delete({
  where: { id: 1 },
});

// Query with relations
const eventsWithImages = await prisma.events.findMany({
  include: { event_images: true },
});
```

### Running Migrations

```bash
# Push schema changes
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio (GUI)
npx prisma studio
```

---

## Testing

### Backend Testing

```bash
cd backend
# Run tests (when implemented)
pnpm test
```

### Frontend Testing

```bash
cd frontend
# Run tests (when implemented)
pnpm test
```

---

## Code Style

### TypeScript Configuration

- Strict mode enabled
- No implicit any
- Explicit return types on public APIs

### ESLint

```bash
# Frontend
cd frontend
pnpm lint

# Backend (if configured)
cd backend
pnpm lint
```

### Code Formatting

The project uses Prettier for consistent formatting.

```bash
# Format all files
pnpm format
```

---

## Common Tasks

### Seeding Database

```bash
cd backend
pnpm seed
```

### Running Scraper

```bash
cd backend
# Trigger scraper
pnpm run-scraper

# Check status
pnpm check-status

# Run monthly scraper
pnpm run-month-scraper
```

### Importing Places

```bash
cd backend
pnpm import:places
```

---

## Debugging

### Backend

Set `NODE_ENV=development` in `.env` for detailed logs.

Logs are structured with Pino:

```bash
# View logs
pnpm dev | pino-pretty
```

### Frontend

Use React DevTools and Next.js DevTools browser extensions.

---

## Contributing

1. Create a new branch from `main` or `master`
2. Make your changes
3. Test thoroughly
4. Commit with clear messages
5. Push and create a pull request

### Commit Message Format

```
type(scope): subject

type: feat, fix, docs, style, refactor, test, chore
scope: backend, frontend, api, ui
subject: short description

Examples:
feat(frontend): add search bar component
fix(backend): handle pagination errors
docs(api): update endpoint documentation
```

---

## Troubleshooting

### Backend Issues

**Problem**: Database connection failed
**Solution**:
- Check `.env` database URL
- Verify PostgreSQL is running
- Test connection: `psql $DATABASE_URL`

**Problem**: Prisma client not found
**Solution**:
```bash
cd backend
npx prisma generate
```

### Frontend Issues

**Problem**: Module not found
**Solution**:
```bash
cd frontend
rm -rf node_modules .next
pnpm install
pnpm dev
```

**Problem**: API calls failing
**Solution**:
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify backend is running on `http://localhost:8000`
- Check browser console for CORS errors

---

## Useful Resources

### Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Express.js](https://expressjs.com/)
- [Prisma](https://www.prisma.io/docs)

### Libraries Used

- [React Query](https://tanstack.com/query/latest)
- [next-intl](https://next-intl-docs.vercel.app/)
- [Leaflet](https://leafletjs.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Zod](https://zod.dev/)

---

## Getting Help

- Check existing issues on GitHub
- Read architecture docs in `/docs`
- Review API documentation
- Ask in project discussions

---

## Best Practices

### Backend

1. **Use Repository Pattern**: Always access database through repositories
2. **Validate Input**: Use Zod schemas for all inputs
3. **Handle Errors**: Use try-catch and proper error responses
4. **Log Operations**: Use Pino logger for debugging
5. **Type Safety**: Define interfaces/types for all data structures

### Frontend

1. **Server Components First**: Use server components by default
2. **Optimize Images**: Use Next.js Image component
3. **Lazy Load**: Use dynamic imports for heavy components
4. **Accessible**: Add ARIA labels and keyboard support
5. **Responsive**: Mobile-first design with Tailwind

### General

1. **Clear Commits**: Write descriptive commit messages
2. **Small PRs**: Keep pull requests focused
3. **Code Reviews**: Review and provide feedback
4. **Documentation**: Update docs when adding features
5. **Testing**: Test before committing
