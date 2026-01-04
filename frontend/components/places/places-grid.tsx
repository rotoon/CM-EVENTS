"use client";

import { PlaceCard } from "@/components/places/place-card-neo";
import type {
  CategoryCount,
  Place,
  PlaceFilter,
  PlaceTypeCount,
} from "@/lib/api-places";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { useCallback, useState } from "react";

// Type Emoji mapping
const TYPE_EMOJI: Record<string, string> = {
  All: "🗺️",
  Cafe: "☕",
  Food: "🍜",
  Restaurant: "🍽️",
  Travel: "🌿",
  "Bar/Nightlife": "🍸",
};

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
}

export function PlacesGrid({
  initialPlaces,
  categories,
  placeTypes,
  pagination: initialPagination,
}: PlacesGridProps) {
  const [places, setPlaces] = useState<Place[]>(initialPlaces);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<PlaceFilter>({});
  const [searchQuery, setSearchQuery] = useState("");

  // Load more places
  const loadMore = useCallback(async () => {
    if (loading || !pagination.hasMore) return;

    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("limit", "20");
      params.set("offset", (pagination.offset + pagination.limit).toString());
      if (filter.place_type) params.set("place_type", filter.place_type);
      if (filter.category) params.set("category", filter.category);
      if (filter.search) params.set("search", filter.search);

      const API_BASE =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://backend-production-14fd.up.railway.app";
      const res = await fetch(`${API_BASE}/places?${params.toString()}`);
      const json = await res.json();

      const newPlaces = json.data?.data || [];
      const newPagination = json.data?.pagination || pagination;

      setPlaces((prev) => [...prev, ...newPlaces]);
      setPagination(newPagination);
    } catch (error) {
      console.error("Error loading more places:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, pagination, filter]);

  // Apply filter
  const applyFilter = useCallback(async (newFilter: PlaceFilter) => {
    setLoading(true);
    setFilter(newFilter);

    try {
      const params = new URLSearchParams();
      params.set("limit", "20");
      if (newFilter.place_type) params.set("place_type", newFilter.place_type);
      if (newFilter.category) params.set("category", newFilter.category);
      if (newFilter.search) params.set("search", newFilter.search);

      const API_BASE =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://backend-production-14fd.up.railway.app";
      const res = await fetch(`${API_BASE}/places?${params.toString()}`);
      const json = await res.json();

      setPlaces(json.data?.data || []);
      setPagination(
        json.data?.pagination || {
          total: 0,
          limit: 20,
          offset: 0,
          hasMore: false,
        }
      );
    } catch (error) {
      console.error("Error applying filter:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle search
  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      applyFilter({ ...filter, search: searchQuery.trim() });
    }
  }, [searchQuery, filter, applyFilter]);

  // Calculate total for "All" tab
  const totalPlaces = placeTypes.reduce((sum, t) => sum + t.count, 0);

  return (
    <div className="space-y-6">
      {/* Type Navigation Tabs */}
      <div className="sticky top-[72px] z-10 -mx-4 px-4 py-3 bg-white/80 backdrop-blur-md border-b border-stone-100">
        <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
          {/* All Tab */}
          <button
            onClick={() => applyFilter({ ...filter, place_type: undefined })}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer",
              "transition-all duration-200",
              !filter.place_type
                ? "bg-stone-900 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            )}
          >
            <span>{TYPE_EMOJI.All}</span>
            ทั้งหมด
            <span className="text-xs opacity-70">({totalPlaces})</span>
          </button>

          {/* Type Tabs */}
          {placeTypes.map((type) => (
            <button
              key={type.place_type}
              onClick={() =>
                applyFilter({
                  ...filter,
                  place_type:
                    filter.place_type === type.place_type
                      ? undefined
                      : type.place_type,
                })
              }
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer",
                "transition-all duration-200",
                filter.place_type === type.place_type
                  ? "bg-orange-500 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              )}
            >
              <span>{TYPE_EMOJI[type.place_type] || "📍"}</span>
              {type.place_type}
              <span className="text-xs opacity-70">({type.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="ค้นหาชื่อร้าน..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className={cn(
            "w-full px-5 py-3.5 pl-12 rounded-xl",
            "bg-white border border-stone-200",
            "text-stone-900 placeholder:text-stone-400",
            "focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400",
            "transition-all duration-200"
          )}
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery("");
              if (filter.search) applyFilter({ ...filter, search: undefined });
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-stone-400" />
          </button>
        )}
      </div>

      {/* Popular Categories (horizontal scroll) */}
      {categories.length > 0 && !filter.place_type && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.slice(0, 12).map((cat) => (
            <button
              key={cat.category}
              onClick={() =>
                applyFilter({
                  ...filter,
                  category:
                    filter.category === cat.category ? undefined : cat.category,
                })
              }
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer",
                "transition-all duration-200",
                filter.category === cat.category
                  ? "bg-amber-500 text-white"
                  : "bg-amber-50 text-amber-700 hover:bg-amber-100"
              )}
            >
              #{cat.category}
            </button>
          ))}
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-stone-500">
          พบ{" "}
          <span className="font-medium text-stone-900">{pagination.total}</span>{" "}
          ร้าน
          {filter.place_type && (
            <span className="text-orange-500 ml-1">ใน {filter.place_type}</span>
          )}
        </p>
        {(filter.place_type || filter.category || filter.search) && (
          <button
            onClick={() => {
              setSearchQuery("");
              applyFilter({});
            }}
            className="text-xs text-stone-400 hover:text-red-500 cursor-pointer"
          >
            ล้างตัวกรอง
          </button>
        )}
      </div>

      {/* Places Grid */}
      {places.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {places.map((place, index) => (
            <PlaceCard
              key={place.id}
              place={place}
              variant={
                index === 0 && !filter.place_type ? "featured" : "default"
              }
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-2xl mb-2">🍜</p>
          <p className="text-lg font-medium text-stone-700 mb-1">
            ไม่พบร้านที่ค้นหา
          </p>
          <p className="text-sm text-stone-500">ลองเปลี่ยนคำค้นหาหรือประเภท</p>
        </div>
      )}

      {/* Load More */}
      {pagination.hasMore && (
        <div className="flex justify-center pt-8">
          <button
            onClick={loadMore}
            disabled={loading}
            className={cn(
              "px-8 py-4 rounded-xl font-medium cursor-pointer",
              "bg-stone-900 text-white",
              "hover:bg-stone-800 transition-colors",
              loading && "opacity-50 cursor-wait"
            )}
          >
            {loading ? "กำลังโหลด..." : "ดูเพิ่มเติม"}
          </button>
        </div>
      )}
    </div>
  );
}
