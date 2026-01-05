"use client";

/**
 * PlaceCategoryChips - Category filter chips
 */

import type { CategoryCount, PlaceFilter } from "@/lib/api-places";
import { cn } from "@/lib/utils";
import { getVariantTheme, type PlaceVariant } from "./theme";

interface PlaceCategoryChipsProps {
  categories: CategoryCount[];
  filter: PlaceFilter;
  onFilterChange: (filter: PlaceFilter) => void;
  variant?: PlaceVariant;
}

export function PlaceCategoryChips({
  categories,
  filter,
  onFilterChange,
  variant = "default",
}: PlaceCategoryChipsProps) {
  const theme = getVariantTheme(variant);

  if (categories.length === 0 || filter.place_type) return null;

  return (
    <div className="flex flex-wrap justify-center gap-3 pb-2">
      {categories.slice(0, 16).map((cat) => (
        <button
          key={cat.category}
          onClick={() =>
            onFilterChange({
              ...filter,
              category:
                filter.category === cat.category ? undefined : cat.category,
            })
          }
          className={cn(
            "px-3 py-1 text-sm font-mono font-bold uppercase cursor-pointer transition-all duration-200 hover:-translate-y-0.5",
            theme.chipBase,
            filter.category === cat.category
              ? theme.chipActive
              : theme.chipInactive
          )}
        >
          #{cat.category}
        </button>
      ))}
    </div>
  );
}
