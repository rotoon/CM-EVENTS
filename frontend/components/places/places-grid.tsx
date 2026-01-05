"use client";

import { PlaceCard } from "@/components/places/place-card-neo";
import { PlaceCategoryChips } from "@/components/places/place-category-chips";
import { PlacePagination } from "@/components/places/place-pagination";
import { PlaceSearchBar } from "@/components/places/place-search-bar";
import { PlaceTypeTabs } from "@/components/places/place-type-tabs";
import { getVariantTheme, type PlaceVariant } from "@/components/places/theme";
import { usePlaces } from "@/hooks/use-places";
import type {
  CategoryCount,
  Place,
  PlaceFilter,
  PlaceTypeCount,
} from "@/lib/api-places";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";

const ITEMS_PER_PAGE = 20;

interface PlacesGridProps {
  initialPlaces: Place[];
  categories: CategoryCount[];
  placeTypes: PlaceTypeCount[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  initialFilter?: PlaceFilter;
  variant?: PlaceVariant;
}

export function PlacesGrid({
  initialPlaces,
  categories,
  placeTypes,
  pagination: initialPagination,
  initialFilter = {},
  variant = "default",
}: PlacesGridProps) {
  const t = useTranslations("places");

  // State
  const [filter, setFilter] = useState<PlaceFilter>(initialFilter);
  const [searchQuery, setSearchQuery] = useState(initialFilter.search || "");
  const [currentPage, setCurrentPage] = useState(1);

  // Theme
  const theme = getVariantTheme(variant);

  // React Query - Page-based pagination
  const { data, isLoading, isFetching } = usePlaces(
    filter,
    currentPage,
    ITEMS_PER_PAGE,
    currentPage === 1
      ? { data: initialPlaces, pagination: initialPagination }
      : undefined
  );

  const places = data?.data ?? initialPlaces;
  const pagination = data?.pagination ?? initialPagination;
  const totalPages = Math.ceil(pagination.total / ITEMS_PER_PAGE);
  const totalPlaces = placeTypes.reduce((sum, t) => sum + t.count, 0);

  // Handlers
  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      setFilter((prev) => ({ ...prev, search: searchQuery.trim() }));
      setCurrentPage(1);
    }
  }, [searchQuery]);

  const applyFilter = useCallback((newFilter: PlaceFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    applyFilter({ ...filter, search: undefined });
  }, [filter, applyFilter]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Type Navigation - Only on default page */}
      {variant === "default" && (
        <PlaceTypeTabs
          placeTypes={placeTypes}
          filter={filter}
          onFilterChange={applyFilter}
          totalPlaces={totalPlaces}
        />
      )}

      {/* Search Bar */}
      <PlaceSearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        onSearch={handleSearch}
        onClear={handleClearSearch}
        variant={variant}
      />

      {/* Category Chips */}
      <PlaceCategoryChips
        categories={categories}
        filter={filter}
        onFilterChange={applyFilter}
        variant={variant}
      />

      {/* Results Count */}
      <div className="flex items-center justify-between border-b-2 border-white/20 pb-4">
        <p className={cn("text-lg font-mono", theme.resultsText)}>
          {t("found")}{" "}
          <span className={cn("font-bold text-2xl", theme.resultsCount)}>
            {pagination.total}
          </span>{" "}
          {t("places")}
          {filter.place_type && (
            <span className={cn("ml-2", theme.resultsType)}>
              {t("in")} {filter.place_type.toUpperCase()}
            </span>
          )}
          {totalPages > 1 && (
            <span className="ml-4 text-white/60">
              ({t("page")} {currentPage} {t("of")} {totalPages})
            </span>
          )}
        </p>
        {(filter.place_type || filter.category || filter.search) && (
          <button
            onClick={() => {
              setSearchQuery("");
              applyFilter({});
            }}
            className="text-sm font-bold text-white hover:text-neo-pink underline decoration-2 underline-offset-4 cursor-pointer uppercase"
          >
            {t("clearFilters")}
          </button>
        )}
      </div>

      {/* Loading overlay */}
      {isFetching && !isLoading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white border-4 border-black px-8 py-4 shadow-[8px_8px_0px_0px_#000] animate-bounce">
            <span className="font-black text-xl uppercase">{t("loading")}</span>
          </div>
        </div>
      )}

      {/* Places Grid */}
      {places.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {places.map((place, index) => (
            <PlaceCard
              key={place.id}
              place={place}
              variant={
                index === 0 && !filter.place_type && variant === "default"
                  ? "featured"
                  : variant
              }
            />
          ))}
        </div>
      ) : isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white/10 border-4 border-white/20 aspect-[4/5]"
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-4 border-dashed border-white/20">
          <p className="text-6xl mb-4">🍜</p>
          <p className="text-2xl font-black text-white uppercase mb-2">
            {t("noPlacesFound")}
          </p>
          <p className="text-gray-400 font-mono">{t("tryDifferent")}</p>
        </div>
      )}

      {/* Pagination */}
      <PlacePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
