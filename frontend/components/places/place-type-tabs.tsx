"use client";

/**
 * PlaceTypeTabs - Type navigation tabs for main places page
 */

import type { PlaceFilter, PlaceTypeCount } from "@/lib/api-places";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { TYPE_EMOJI } from "./theme";

interface PlaceTypeTabsProps {
  placeTypes: PlaceTypeCount[];
  filter: PlaceFilter;
  onFilterChange: (filter: PlaceFilter) => void;
  totalPlaces: number;
}

export function PlaceTypeTabs({
  placeTypes,
  filter,
  onFilterChange,
  totalPlaces,
}: PlaceTypeTabsProps) {
  const t = useTranslations("places");
  const router = useRouter();
  const tabBase = cn(
    "flex items-center gap-2 px-6 py-3 font-bold whitespace-nowrap cursor-pointer transition-all duration-200 border-2",
    "uppercase tracking-tight shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
  );

  const activeStyles =
    "bg-neo-lime text-black border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]";
  const inactiveStyles = "bg-white text-black border-black hover:bg-gray-100";

  return (
    <div className="sticky top-0 md:top-[150px] z-30 -mx-4 px-4 py-4 bg-neo-black/80 backdrop-blur-md border-b-4 border-neo-black/50 transition-all">
      <div className="flex flex-wrap gap-3 pb-2 justify-center">
        {/* All Tab */}
        <button
          onClick={() => router.push("/places")}
          className={cn(
            tabBase,
            !filter.place_type ? activeStyles : inactiveStyles
          )}
        >
          <span className="text-xl">{TYPE_EMOJI.All}</span>
          {t("allPlaces")}
          <span className="text-xs font-mono bg-black text-white px-1.5 py-0.5 ml-1">
            {totalPlaces}
          </span>
        </button>

        {/* Type Tabs */}
        {placeTypes.map((type) => (
          <button
            key={type.place_type}
            onClick={() =>
              router.push(`/${type.place_type.toLocaleLowerCase()}`)
            }
            className={cn(
              tabBase,
              filter.place_type === type.place_type
                ? "bg-neo-pink text-white border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                : inactiveStyles
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
  );
}
