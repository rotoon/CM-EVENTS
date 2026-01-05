# Hype CNX - Production Ready 🚀

## Project Status

The transformation from "Chiang Mai Events" to **Hype CNX** is complete and being polished.

## Shipped Features (Dec 27, 2025)

- **Rebrand**: Hype CNX identity, Sticker Bomb logo (v2), and refreshed Hero.
- **Maps**: Fully interactive Leaflet-based event map with custom markers.
- **Layout**: Optimized global layout with shared components in `layout.tsx`.
- **UX**: Smart view toggles and past-event indicators.
- **Fixes**: Resolved Next.js Image issues (quality 100 configuration and missing `sizes` props).
- **SEO**: Refactored to Server Components, added dynamic metadata, robots.txt, sitemap.xml, and JSON-LD schema.
- **Deployment**: Added `deploy` script for Railway CLI in `package.json`.

## Code Standards (Jan 2026)

### React Query Pattern

- ใช้ `@tanstack/react-query` สำหรับ client-side data fetching
- สร้าง custom hooks ใน `hooks/use-*.ts`
- Query keys factory pattern เช่น `placesKeys.list(filters)`
- Server Components ส่ง initial data ผ่าน props → hooks ใช้ `initialData`

### i18n Pattern

- ใช้ `next-intl` กับ locale route `[locale]/`
- Translations อยู่ใน `messages/th.json` และ `messages/en.json`
- ใช้ `useTranslations('namespace')` ใน client components
- เพิ่ม namespace ใหม่เมื่อสร้าง feature ใหม่

### Component Refactoring Rules

- แยก theme/styles เป็น config file (เช่น `theme.ts`) เมื่อมี variant > 3
- แยก sub-components เมื่อ file > 200 บรรทัด
- สร้าง barrel export `index.ts` สำหรับ component folders
- ใช้ `getVariantTheme(variant)` helper แทน conditional styling ซ้ำๆ

### File Structure Pattern (ตัวอย่าง Places)

```
components/places/
├── theme.ts              # VARIANT_THEMES, TYPE_EMOJI, getVariantTheme()
├── index.ts              # Barrel export
├── places-grid.tsx       # Main (180 lines, uses React Query + i18n)
├── place-card-neo.tsx    # Card component
├── place-search-bar.tsx  # Search input
├── place-pagination.tsx  # Page controls
├── place-category-chips.tsx
└── place-type-tabs.tsx

hooks/
└── use-places.ts         # usePlaces, usePlaceCategories, usePlaceTypes
```

## Production Link

- [Hype CNX Live](https:///hypecnx.com/)

## Next Phase

- **Engagement**: Authentication and User Saves.
- **UGC**: Social submission of events.
