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
}

export function PlaceCard({ place, variant = "default" }: PlaceCardProps) {
  const theme = getVariantTheme(variant);

  // Determine Image Source
  const stickerKey = PLACE_TYPE_STICKERS[place.place_type] || "culture";
  const stickerImage = `/stickers/${stickerKey}.png`;
  const displayImage = place.cover_image_url || stickerImage;

  const isFeatured = variant === "featured";

  return (
    <Link
      href={`/places/${place.id}`}
      className={cn(
        // Base Styles
        "group relative block overflow-hidden cursor-pointer h-full",
        "transition-all duration-300 ease-out",
        // Variant Styles from theme
        theme.cardBase,
        isFeatured && "md:col-span-2 md:row-span-2"
      )}
    >
      {/* Image Section */}
      <div
        className={cn(
          "relative w-full border-b-4 border-neo-black overflow-hidden",
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

      {/* Card Content */}
      <div className={cn("p-5 flex flex-col", isFeatured && "p-8")}>
        {/* Place Name */}
        <h3
          className={cn(
            "font-black leading-[0.9] mb-3 uppercase transition-colors",
            theme.cardText,
            theme.cardHoverText,
            isFeatured ? "text-4xl md:text-5xl" : "text-2xl"
          )}
        >
          {place.name}
        </h3>

        {/* Categories */}
        {place.category_names && place.category_names.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-auto">
            {place.category_names.map((cat) => (
              <span
                key={cat}
                className="text-[10px] font-bold text-black uppercase tracking-wider bg-gray-100 border border-neo-black px-2 py-0.5 hover:bg-neo-lime hover:border-black transition-colors"
              >
                #{cat}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
