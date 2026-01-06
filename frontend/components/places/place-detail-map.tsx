"use client";

import { Place } from "@/lib/api-places";
import { ExternalLink, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

function MapLoader() {
  // Safe to use hooks here?
  // `dynamic` loads this component.
  return (
    <div className="w-full h-full bg-neo-black/10 flex items-center justify-center border-4 border-neo-black animate-pulse">
      <span className="font-black text-xl text-neo-black">LOADING...</span>
    </div>
  );
}

// Re-define dynamic with custom loader component
const PlacesMapWithLoader = dynamic(() => import("./places-map"), {
  ssr: false,
  loading: MapLoader,
});

interface PlaceDetailMapProps {
  place: Place;
}

export function PlaceDetailMap({ place }: PlaceDetailMapProps) {
  const t = useTranslations("places.placeDetail");

  if (!place.latitude || !place.longitude) return null;

  return (
    <div className="bg-white border-4 border-neo-black shadow-[8px_8px_0px_0px_#ffffff] p-2 rotate-1 hover:rotate-0 transition-transform">
      <div className="bg-neo-black text-white p-2 mb-2 flex items-center justify-between">
        <span className="font-bold flex items-center gap-2">
          <MapPin className="w-4 h-4" /> {t("location")}
        </span>
        <span className="text-xs font-mono opacity-70">
          {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
        </span>
      </div>
      <div className="w-full relative">
        <PlacesMapWithLoader
          places={[place]}
          variant="places"
          center={[place.latitude, place.longitude]}
          zoom={15}
        />
      </div>
      <div className="mt-4">
        <a
          href={
            place.google_maps_url ||
            `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="text-center flex items-center justify-center gap-3 w-full px-6 py-4 bg-neo-lime text-black font-black text-lg uppercase border-4 border-neo-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          <MapPin className="w-6 h-6" />
          {t("viewOnGoogleMaps")}
          <ExternalLink className="w-5 h-5 ml-auto" />
        </a>
      </div>
    </div>
  );
}
