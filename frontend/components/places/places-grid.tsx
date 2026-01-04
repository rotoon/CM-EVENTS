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
  initialFilter?: PlaceFilter;
  variant?: "default" | "cafe" | "food" | "restaurant" | "travel" | "nightlife";
}

export function PlacesGrid({
  initialPlaces,
  categories,
  placeTypes,
  pagination: initialPagination,
  initialFilter = {},
  variant = "default",
}: PlacesGridProps) {
  const [places, setPlaces] = useState<Place[]>(initialPlaces);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<PlaceFilter>(initialFilter);
  const [searchQuery, setSearchQuery] = useState(initialFilter.search || "");

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
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Type Navigation Tabs - Only show on default generic page */}
      {variant === "default" && (
        <div className="sticky top-[80px] z-30 -mx-4 px-4 py-4 bg-neo-black/95 backdrop-blur-md border-b-4 border-neo-black/50">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {/* All Tab */}
            <button
              onClick={() => applyFilter({ ...filter, place_type: undefined })}
              className={cn(
                "flex items-center gap-2 px-6 py-3 font-bold whitespace-nowrap cursor-pointer transition-all duration-200 border-2",
                "uppercase tracking-tight shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]",
                !filter.place_type
                  ? "bg-neo-lime text-black border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                  : "bg-white text-black border-black hover:bg-gray-100"
              )}
            >
              <span className="text-xl">{TYPE_EMOJI.All}</span>
              ALL PLACES
              <span className="text-xs font-mono bg-black text-white px-1.5 py-0.5 ml-1">
                {totalPlaces}
              </span>
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
                  "flex items-center gap-2 px-6 py-3 font-bold whitespace-nowrap cursor-pointer transition-all duration-200 border-2",
                  "uppercase tracking-tight shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]",
                  filter.place_type === type.place_type
                    ? "bg-neo-pink text-white border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                    : "bg-white text-black border-black hover:bg-gray-100"
                )}
              >
                <span className="text-xl">
                  {TYPE_EMOJI[type.place_type] || "📍"}
                </span>
                {type.place_type}
                <span className="text-xs font-mono bg-black text-white px-1.5 py-0.5 ml-1 opacity-70">
                  {type.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto">
        <div className="relative group">
          <div
            className={cn(
              "absolute -inset-1 opacity-20 group-hover:opacity-100 transition-opacity duration-300 blur-lg animate-pulse",
              variant === "cafe"
                ? "bg-[#A58D71]"
                : variant === "food"
                ? "bg-[#EA580C]"
                : variant === "restaurant"
                ? "bg-[#FFD700]"
                : variant === "travel"
                ? "bg-[#FFD700]/20" // Gold Glow
                : variant === "nightlife"
                ? "bg-gradient-to-r from-[#FF0080] to-[#00FFFF]" // Neon Gradient Glow
                : "bg-gradient-to-r from-neo-lime via-neo-pink to-neo-cyan"
            )}
          ></div>
          <input
            type="text"
            placeholder="FIND YOUR PLACE..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className={cn(
              "relative w-full px-6 py-5 pl-16",
              "text-2xl uppercase font-display placeholder:text-gray-300 focus:outline-none transition-all duration-200",
              variant === "cafe"
                ? "bg-white border-2 border-[#E5E5E5] text-[#2C1810] rounded-xl shadow-sm focus:border-[#6F4E37] focus:ring-1 focus:ring-[#6F4E37]"
                : variant === "food"
                ? "bg-white border-4 border-black text-black font-black uppercase rounded-none shadow-[6px_6px_0px_0px_#EA580C] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none"
                : variant === "restaurant"
                ? "bg-[#2A2A2A] border-2 border-[#FFD700] text-[#FFD700] font-serif placeholder:font-sans placeholder:text-gray-400 focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] shadow-lg"
                : variant === "travel"
                ? "bg-[#0E1C36]/80 border-b-2 border-[#FFD700]/50 backdrop-blur-md text-[#FFD700] font-serif placeholder:text-white/40 focus:bg-[#0E1C36] focus:border-[#FFD700] transition-colors pl-12 rounded-none shadow-lg"
                : variant === "nightlife"
                ? "bg-black/90 border-2 border-[#FF0080] text-[#00FFFF] font-mono placeholder:text-[#FF0080]/50 focus:border-[#00FFFF] focus:shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-all rounded-none"
                : "bg-white border-4 border-neo-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-neo-black font-black focus:translate-x-[4px] focus:translate-y-[4px] focus:shadow-none"
            )}
          />
          <Search
            className={cn(
              "absolute left-5 top-1/2 -translate-y-1/2 w-8 h-8 z-10",
              variant === "cafe"
                ? "text-[#A58D71]"
                : variant === "food"
                ? "text-[#EA580C]"
                : variant === "restaurant"
                ? "text-[#D4AF37]"
                : variant === "travel"
                ? "text-[#FFD700]"
                : variant === "nightlife"
                ? "text-[#FF0080]"
                : "text-neo-black"
            )}
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                applyFilter({ ...filter, search: undefined });
              }}
              className={cn(
                "absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center transition-transform hover:scale-110",
                variant === "cafe"
                  ? "bg-[#6F4E37] text-white rounded-full"
                  : variant === "food"
                  ? "bg-[#EA580C] text-white border-2 border-black shadow-[2px_2px_0px_0px_black]"
                  : variant === "restaurant"
                  ? "bg-[#FFD700] text-black border border-[#FFD700] hover:bg-white"
                  : variant === "travel"
                  ? "bg-[#FFD700] text-[#0E1C36] rounded-full hover:bg-white border border-[#FFD700]"
                  : variant === "nightlife"
                  ? "bg-[#FF0080] text-black border border-[#FF0080] hover:bg-[#00FFFF] hover:border-[#00FFFF]"
                  : "bg-neo-pink text-white border-2 border-neo-black"
              )}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Popular Categories (horizontal scroll) */}
      {categories.length > 0 && !filter.place_type && (
        <div className="flex flex-wrap justify-center gap-3 pb-2">
          {categories.slice(0, 16).map((cat) => (
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
                "px-3 py-1 text-sm font-mono font-bold uppercase cursor-pointer transition-all duration-200 hover:-translate-y-0.5",
                variant === "cafe"
                  ? "rounded-full border border-[#E5E5E5]"
                  : variant === "food"
                  ? "border-2 border-black shadow-[2px_2px_0px_0px_#EA580C]"
                  : variant === "restaurant"
                  ? "border border-[#FFD700]/50"
                  : "border-2",
                filter.category === cat.category
                  ? variant === "cafe"
                    ? "bg-[#6F4E37] text-white border-[#6F4E37]"
                    : variant === "food"
                    ? "bg-[#EA580C] text-white border-black"
                    : variant === "restaurant"
                    ? "bg-[#FFD700] text-black border-[#FFD700]"
                    : "bg-neo-purple text-white border-white shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
                  : variant === "cafe"
                  ? "bg-white text-[#6F4E37] hover:bg-[#FDFBF7]"
                  : variant === "food"
                  ? "bg-white text-black hover:bg-orange-50"
                  : variant === "restaurant"
                  ? "bg-transparent text-[#FFD700] hover:bg-[#FFD700]/10"
                  : variant === "travel"
                  ? "bg-[#0E1C36]/50 text-[#FFD700] border border-[#FFD700]/30 hover:bg-[#FFD700] hover:text-[#0E1C36]"
                  : variant === "nightlife"
                  ? "bg-black text-[#00FFFF] border border-[#FF0080] hover:bg-[#FF0080] hover:text-black hover:shadow-[0_0_10px_#FF0080]"
                  : "bg-black text-white border-neo-lime hover:bg-neo-lime hover:text-black hover:border-black"
              )}
            >
              #{cat.category}
            </button>
          ))}
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between border-b-2 border-white/20 pb-4">
        <p
          className={cn(
            "text-lg font-mono",
            variant === "cafe" && "text-[#6F4E37] border-black/10",
            variant === "food" && "text-gray-800",
            variant === "restaurant" && "text-white border-white/20",
            variant === "travel" && "text-[#FFD700] border-[#FFD700]/30", // Gold text
            variant === "nightlife" && "text-[#00FFFF] border-[#FF0080]", // Cyan text w/ Pink border
            variant === "default" && "text-white" // default fallback
          )}
        >
          FOUND{" "}
          <span
            className={cn(
              "font-bold text-2xl",
              variant === "cafe"
                ? "text-[#A58D71]"
                : variant === "food"
                ? "text-[#EA580C]"
                : variant === "restaurant"
                ? "text-[#FFD700]"
                : variant === "travel"
                ? "text-white hover:text-[#FFD700] transition-colors"
                : variant === "nightlife"
                ? "text-[#FF0080] drop-shadow-[0_0_5px_#FF0080]"
                : "text-neo-lime"
            )}
          >
            {pagination.total}
          </span>{" "}
          PLACES
          {filter.place_type && (
            <span
              className={cn(
                "ml-2",
                variant === "cafe"
                  ? "text-[#8B5A2B]"
                  : variant === "food"
                  ? "text-[#DC2626]"
                  : variant === "restaurant"
                  ? "text-white"
                  : variant === "travel"
                  ? "text-[#FFD700]"
                  : variant === "nightlife"
                  ? "text-[#00FFFF]"
                  : "text-neo-pink"
              )}
            >
              IN {filter.place_type.toUpperCase()}
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
            Clear Filters
          </button>
        )}
      </div>

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
      ) : (
        <div className="text-center py-20 border-4 border-dashed border-white/20">
          <p className="text-6xl mb-4">🍜</p>
          <p className="text-2xl font-black text-white uppercase mb-2">
            NO PLACES FOUND
          </p>
          <p className="text-gray-400 font-mono">
            Try different keywords or filters.
          </p>
        </div>
      )}

      {/* Load More */}
      {pagination.hasMore && (
        <div className="flex justify-center pt-12 pb-20">
          <button
            onClick={loadMore}
            disabled={loading}
            className={cn(
              "px-10 py-5 font-black text-xl uppercase tracking-wider cursor-pointer border-4 border-white",
              "bg-neo-black text-white shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]",
              "hover:bg-white hover:text-black hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]",
              "active:shadow-none active:translate-x-[8px] active:translate-y-[8px]",
              "transition-all duration-200",
              loading && "opacity-50 cursor-wait"
            )}
          >
            {loading ? "LOADING..." : "LOAD MORE PLACES"}
          </button>
        </div>
      )}
    </div>
  );
}
