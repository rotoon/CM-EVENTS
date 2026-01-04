"use client";

import type { Place } from "@/lib/api-places";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Place Type → Neo-Brutalist color scheme
const TYPE_STYLES: Record<string, { bg: string; text: string; emoji: string }> =
  {
    Cafe: { bg: "bg-neo-purple", text: "text-white", emoji: "☕" },
    Food: { bg: "bg-neo-pink", text: "text-white", emoji: "🍜" },
    Restaurant: { bg: "bg-neo-lime", text: "text-black", emoji: "🍽️" },
    Travel: { bg: "bg-neo-cyan", text: "text-black", emoji: "🌿" },
    "Bar/Nightlife": {
      bg: "bg-neo-black",
      text: "text-white",
      emoji: "🍸",
    },
  };

interface PlaceCardProps {
  place: Place;
  variant?:
    | "default"
    | "featured"
    | "cafe"
    | "food"
    | "restaurant"
    | "travel"
    | "nightlife";
}

// Sticker Mapping (from Plan Page)
const PLACE_TYPE_STICKERS: Record<string, string> = {
  Cafe: "cafe",
  Food: "food",
  Restaurant: "food",
  Travel: "nature",
  "Bar/Nightlife": "nightlife",
  Shopping: "shopping",
  Art: "art",
};

export function PlaceCard({ place, variant = "default" }: PlaceCardProps) {
  const typeStyle = TYPE_STYLES[place.place_type] || {
    bg: "bg-white",
    text: "text-black",
    emoji: "📍",
  };

  // Determine Image Source
  // Priority: 1. Cover Image -> 2. Category Sticker -> 3. Fallback Placeholder
  const stickerKey = PLACE_TYPE_STICKERS[place.place_type] || "culture";
  const stickerImage = `/stickers/${stickerKey}.png`;

  // Logic: Use Sticker if no cover image, OR if user wants category images effectively
  // User asked: "show category image INSTEAD" (taken as: if no cover, show category. Or maybe replace placeholder)
  const displayImage = place.cover_image_url || stickerImage;

  // Truncate description
  const truncatedDescription = place.description
    ? place.description
        .replace(/\. ❥.*/, "")
        .slice(0, 400)
        .trim() + "..."
    : null;

  const isFeatured = variant === "featured";

  return (
    <Link
      href={`/places/${place.id}`}
      className={cn(
        // Base Styles
        "group relative block overflow-hidden cursor-pointer h-full",
        "transition-all duration-300 ease-out",
        // Default Neo-Brutalist
        (variant === "default" || variant === "featured") && [
          "bg-white border-4 border-neo-black",
          "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]",
        ],
        // Cafe: Japandi, Minimal, Warm
        variant === "cafe" && [
          "bg-white rounded-[2rem] border border-[#E5E5E5]",
          "shadow-[0_4px_20px_-4px_rgba(111,78,55,0.08)] hover:shadow-[0_8px_30px_-4px_rgba(111,78,55,0.12)]",
          "hover:-translate-y-1",
        ],
        // Food: Vibrant, White Card, Orange Accent
        variant === "food" && [
          "bg-white border-2 border-black",
          "shadow-[4px_4px_0px_0px_#EA580C] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]",
          "hover:bg-orange-50",
        ],
        // Restaurant: Dark, Gold Border, Elegant
        variant === "restaurant" && [
          "bg-[#2A2A2A] border-2 border-[#FFD700]", // Lighter bg, thick solid border
          "shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(255,215,0,0.4)]",
          "hover:-translate-y-1",
          "text-white",
        ],
        // Travel: Royal Lanna (Midnight Blue & Gold)
        // Travel: Royal Lanna (Midnight Blue & Gold)
        variant === "travel" && [
          "bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md border border-[#FFD700]/60", // Milky Gradient Glass
          "shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] shadow-[#FFD700]/10", // Deep shadow + Subtle Gold Glow
          "hover:bg-[#0E1C36] hover:border-[#FFD700] hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] transition-all duration-500",
          "text-white",
        ],
        // Nightlife: Neon, Black, Glow
        variant === "nightlife" && [
          "bg-black border-2 border-[#FF0080]",
          "shadow-[4px_4px_0px_#00FFFF] hover:shadow-[6px_6px_0px_#FF0080] hover:border-[#00FFFF]",
          "hover:-translate-y-1 transition-all duration-200",
          "text-[#00FFFF] group-hover:text-white",
        ],

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
            "font-black leading-[0.9] mb-3 uppercase",
            variant === "nightlife"
              ? "text-white group-hover:text-[#00FFFF]"
              : variant === "restaurant" || variant === "travel"
              ? "text-white group-hover:text-[#FFD700]"
              : "text-neo-black group-hover:text-neo-pink",
            "transition-colors",
            isFeatured ? "text-4xl md:text-5xl" : "text-2xl"
          )}
        >
          {place.name}
        </h3>

        {/* Categories as brutalist tags */}
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
