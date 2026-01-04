"use client";

import type { Place } from "@/lib/api-places";
import { cn } from "@/lib/utils";
import { ExternalLink, Heart, MessageCircle } from "lucide-react";
import Link from "next/link";

// Place Type → Warm color scheme for food/cafe
const TYPE_STYLES: Record<string, { bg: string; text: string; emoji: string }> =
  {
    Cafe: { bg: "bg-amber-100", text: "text-amber-800", emoji: "☕" },
    Food: { bg: "bg-orange-100", text: "text-orange-800", emoji: "🍜" },
    Restaurant: { bg: "bg-red-100", text: "text-red-800", emoji: "🍽️" },
    Travel: { bg: "bg-emerald-100", text: "text-emerald-800", emoji: "🌿" },
    "Bar/Nightlife": {
      bg: "bg-purple-100",
      text: "text-purple-800",
      emoji: "🍸",
    },
  };

interface PlaceCardProps {
  place: Place;
  variant?: "default" | "featured";
}

export function PlaceCard({ place, variant = "default" }: PlaceCardProps) {
  const typeStyle = TYPE_STYLES[place.place_type] || {
    bg: "bg-stone-100",
    text: "text-stone-800",
    emoji: "📍",
  };

  // Truncate description
  const truncatedDescription = place.description
    ? place.description
        .replace(/\. ❥.*/, "")
        .slice(0, 100)
        .trim() + "..."
    : null;

  const isFeatured = variant === "featured";

  return (
    <Link
      href={`/places/${place.id}`}
      className={cn(
        "group relative block rounded-2xl overflow-hidden cursor-pointer",
        "bg-white border border-stone-200",
        "shadow-sm hover:shadow-lg",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1",
        isFeatured && "md:col-span-2 md:row-span-2"
      )}
    >
      {/* Card Content */}
      <div className={cn("p-5 flex flex-col h-full", isFeatured && "p-7")}>
        {/* Header: Type Badge */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium",
              typeStyle.bg,
              typeStyle.text
            )}
          >
            <span>{typeStyle.emoji}</span>
            {place.place_type}
          </span>

          {/* Engagement */}
          {(place.likes ?? 0) > 0 && (
            <div className="flex items-center gap-3 text-stone-400">
              {place.likes !== null && place.likes > 0 && (
                <span className="flex items-center gap-1 text-xs">
                  <Heart className="w-3.5 h-3.5" />
                  {place.likes >= 1000
                    ? `${(place.likes / 1000).toFixed(1)}k`
                    : place.likes}
                </span>
              )}
              {place.comments !== null && place.comments > 0 && (
                <span className="flex items-center gap-1 text-xs">
                  <MessageCircle className="w-3.5 h-3.5" />
                  {place.comments}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Place Name */}
        <h3
          className={cn(
            "font-semibold text-stone-900 leading-snug mb-2",
            "group-hover:text-orange-600 transition-colors",
            isFeatured ? "text-xl md:text-2xl" : "text-base"
          )}
        >
          {place.name}
        </h3>

        {/* Description (featured only or truncated) */}
        {truncatedDescription && (
          <p
            className={cn(
              "text-stone-500 text-sm leading-relaxed mb-4 flex-grow",
              isFeatured ? "line-clamp-4" : "line-clamp-2"
            )}
          >
            {truncatedDescription}
          </p>
        )}

        {/* Categories as minimal tags */}
        {place.category_names && place.category_names.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {place.category_names.slice(0, isFeatured ? 5 : 3).map((cat) => (
              <span
                key={cat}
                className="text-[10px] font-medium text-stone-400 uppercase tracking-wider"
              >
                #{cat}
              </span>
            ))}
          </div>
        )}

        {/* Instagram indicator */}
        {place.instagram_url && (
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="inline-flex items-center gap-1 text-xs text-stone-400">
              <ExternalLink className="w-3 h-3" />
              IG
            </span>
          </div>
        )}
      </div>

      {/* Bottom accent line on hover */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-1",
          "bg-gradient-to-r from-orange-400 via-red-400 to-amber-400",
          "transform scale-x-0 group-hover:scale-x-100",
          "transition-transform duration-300 origin-left"
        )}
      />
    </Link>
  );
}
