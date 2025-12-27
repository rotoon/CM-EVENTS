# Frontend Refactoring Plan

## Goal Description

Refactor the `frontend/` directory to improve code organization, maintainability, and reusability. Focus on separating concerns by moving types, utilities, and constants out of components and hooks.

## Proposed Changes

### 1. Centralize Types

Move TS interfaces from `hooks/use-events.ts` to `lib/types.ts`.

- `Event`
- `EventImage`
- `EventStats`
- `Category`

### 2. Extract Utilities

Move date parsing logic from `hooks/use-events.ts` to `lib/date-utils.ts`.

- `parseThaiDate`
- `getEndDateTimestamp`
- `sortByEndDate`

### 3. Extract Constants

Create `lib/constants.ts` for UI configuration.

- `ICON_MAP` (from `category-filter.tsx`)
- `CATEGORY_STYLES` (from `category-filter.tsx`)
- `NEO_COLORS` (from `events-grid.tsx`)

### 4. Clean Up Hooks

Simplify `use-events.ts` to strictly contain React Query hooks, importing types and utils from `lib/`.

### 5. Type Safety

Ensure stricter type checking in `page.tsx` and `layout.tsx` where implicit `any` might hide.

## Verification Plan

### Automated Tests

- Build verification: `pnpm build`
- Type checking: `tsc --noEmit`

### Manual Verification

- Verify infinite scroll still works.
- Verify category/month filtering works.
- Verify sorting logic remains correct.
