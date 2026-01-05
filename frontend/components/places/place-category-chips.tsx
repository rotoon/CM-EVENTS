"use client";

/**
 * PlaceCategoryChips - Category filter chips grouped by tag type
 * Uses variant-specific styling from theme.ts for consistent page appearance
 * Supports: multi-select tags
 */

import type { CategoryCount, PlaceFilter } from "@/lib/api-places";
import {
  groupTagsByCategory,
  TAG_CATEGORY_STYLES,
  type TagCategory,
} from "@/lib/tag-categories";
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

  if (categories.length === 0) return null;

  // Get selected categories from filter
  const selectedCategories = filter.categories || [];

  // Group categories by tag type
  const tagNames = categories.slice(0, 24).map((c) => c.category);
  const grouped = groupTagsByCategory(tagNames);

  // Order of groups to display
  const groupOrder: TagCategory[] = ["location", "food", "feature", "other"];

  // Toggle category selection (multi-select)
  const handleClick = (category: string) => {
    let newCategories: string[];
    const normalized = category.toLowerCase();

    if (selectedCategories.includes(normalized)) {
      // Remove if already selected
      newCategories = selectedCategories.filter((c) => c !== normalized);
    } else {
      // Add to selection
      newCategories = [...selectedCategories, normalized];
    }

    onFilterChange({
      ...filter,
      categories: newCategories.length > 0 ? newCategories : undefined,
      category: undefined, // Clear single category
    });
  };

  // Get label text color based on variant
  const getLabelColor = () => {
    switch (variant) {
      case "cafe":
        return "text-[#6F4E37]/80";
      case "food":
        return "text-[#EA580C]/80";
      case "restaurant":
      case "travel":
        return "text-[#FFD700]/80";
      case "nightlife":
        return "text-[#00FFFF]/80";
      default:
        return "text-white/70";
    }
  };

  // Get selected badge style based on variant
  const getSelectedBadge = () => {
    switch (variant) {
      case "cafe":
        return "bg-[#6F4E37]/20 text-[#6F4E37]";
      case "food":
        return "bg-[#EA580C]/20 text-[#EA580C]";
      case "restaurant":
      case "travel":
        return "bg-[#FFD700]/20 text-[#FFD700]";
      case "nightlife":
        return "bg-[#FF0080]/20 text-[#FF0080]";
      default:
        return "bg-white/20 text-white";
    }
  };

  return (
    <div className="space-y-4">
      {groupOrder.map((groupKey) => {
        const tags = grouped[groupKey];
        if (tags.length === 0) return null;

        const style = TAG_CATEGORY_STYLES[groupKey];
        const selectedInGroup = selectedCategories.filter((c) =>
          tags.includes(c)
        ).length;

        return (
          <div key={groupKey} className="space-y-2">
            {/* Group Label */}
            <div
              className={cn(
                "flex items-center gap-2 text-sm font-medium",
                getLabelColor()
              )}
            >
              <span>{style.emoji}</span>
              <span>{style.label}</span>
              {selectedInGroup > 0 && (
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    getSelectedBadge()
                  )}
                >
                  {selectedInGroup} selected
                </span>
              )}
            </div>

            {/* Tags - uses theme variant styling */}
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const isActive = selectedCategories.includes(tag);

                return (
                  <button
                    key={tag}
                    onClick={() => handleClick(tag)}
                    className={cn(
                      "px-3 py-1 text-sm font-mono font-bold uppercase cursor-pointer transition-all duration-200",
                      theme.chipBase,
                      "hover:-translate-y-0.5",
                      isActive ? theme.chipActive : theme.chipInactive
                    )}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
