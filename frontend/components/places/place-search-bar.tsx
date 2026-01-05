"use client";

/**
 * PlaceSearchBar - Search input component with variant theming
 */

import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { getVariantTheme, type PlaceVariant } from "./theme";

interface PlaceSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
  variant?: PlaceVariant;
}

export function PlaceSearchBar({
  value,
  onChange,
  onSearch,
  onClear,
  variant = "default",
}: PlaceSearchBarProps) {
  const t = useTranslations("places");
  const theme = getVariantTheme(variant);

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="relative group">
        {/* Glow effect */}
        <div
          className={cn(
            "absolute -inset-1 opacity-20 group-hover:opacity-100 transition-opacity duration-300 blur-lg animate-pulse",
            theme.searchGlow
          )}
        />

        {/* Input */}
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          className={cn(
            "relative w-full px-4 py-4 md:px-6 md:py-5 pl-12 md:pl-16",
            "text-lg md:text-2xl uppercase font-display placeholder:text-gray-300 focus:outline-none transition-all duration-200",
            theme.searchInput
          )}
        />

        {/* Search icon */}
        <Search
          className={cn(
            "absolute left-5 top-1/2 -translate-y-1/2 w-8 h-8 z-10",
            theme.searchIcon
          )}
        />

        {/* Clear button */}
        {value && (
          <button
            onClick={onClear}
            className={cn(
              "absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center transition-transform hover:scale-110",
              theme.searchClear
            )}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
