"use client";

import {
  getVariantTheme,
  PLACE_TYPE_STICKERS,
  type PlaceVariant,
} from "@/components/places/theme";
import type { Place } from "@/lib/api-places";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface PlaceCardProps {
  place: Place;
  variant?: PlaceVariant;
  onCategoryClick?: (category: string) => void;
}

export function PlaceCard({
  place,
  variant = "default",
  onCategoryClick,
}: PlaceCardProps) {
  const theme = getVariantTheme(variant);

  // Determine Image Source
  const stickerKey = PLACE_TYPE_STICKERS[place.place_type] || "culture";
  const stickerImage = `/stickers/${stickerKey}.png`;
  const displayImage = place.cover_image_url || stickerImage;

  const isFeatured = variant === "featured";

  const handleTagClick = (e: React.MouseEvent, category: string) => {
    e.preventDefault();
    e.stopPropagation();
    onCategoryClick?.(category);
  };

  return (
    <Link
      href={`/places/${place.id}`}
      className={cn(
        // Base Styles
        "group relative block cursor-pointer h-full",
        isFeatured && "md:col-span-2 md:row-span-2"
      )}
    >
      {/* Image Section */}
      <div
        className={cn(
          "relative w-full overflow-hidden transition-all duration-300 ease-out",
          // Apply card styles to the image container instead of the whole card
          theme.cardBase,
          variant === "travel"
            ? "aspect-[3/4] border-none rounded-sm shadow-xl"
            : "aspect-[4/3]",
          !place.cover_image_url
            ? "bg-neo-black/5 p-8 flex items-center justify-center"
            : "bg-gray-100"
        )}
      >
        <img
          src={displayImage}
          alt={place.name}
          className={cn(
            "transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1",
            place.cover_image_url
              ? "w-full h-full object-cover"
              : "w-full h-full object-contain filter drop-shadow-xl"
          )}
        />
      </div>

      {/* Card Content - Clean, no borders */}
      <div className={cn("pt-4 flex flex-col", isFeatured && "pt-6")}>
        {/* Place Name */}
        <h3
          className={cn(
            "font-black leading-[0.9] mb-2 uppercase transition-colors line-clamp-2",
            theme.cardText,
            theme.cardHoverText,
            isFeatured ? "text-4xl md:text-5xl" : "text-xl md:text-2xl"
          )}
        >
          {place.name}
        </h3>

        {/* Categories - Clickable Tags */}
        {place.category_names && place.category_names.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {place.category_names.slice(0, 3).map((cat) => (
              <button
                key={cat}
                onClick={(e) => handleTagClick(e, cat)}
                className={cn(
                  "text-[10px] font-bold uppercase tracking-wider border px-2 py-0.5 transition-all cursor-pointer",
                  theme.cardTag,
                  theme.cardTagHover,
                  onCategoryClick && "hover:scale-105"
                )}
              >
                #{cat}
              </button>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
