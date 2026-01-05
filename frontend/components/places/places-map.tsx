"use client";

import { API_BASE } from "@/lib/api-config";
import { Place } from "@/types";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { PLACE_TYPE_STICKERS } from "./theme";

// Fix for default Leaflet icon
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Map Theme Configuration
const MAP_THEMES: Record<
  string, // PlaceVariant
  {
    tileUrl: string;
    bgColor: string;
    markerColor: string;
    markerBorder: string;
    markerGlow: string;
  }
> = {
  default: {
    tileUrl: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    bgColor: "#212121",
    markerColor: "bg-neo-lime text-black",
    markerBorder: "border-white",
    markerGlow: "shadow-[0_0_10px_rgba(204,255,0,0.6)]",
  },
  featured: {
    tileUrl: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    bgColor: "#212121",
    markerColor: "bg-neo-lime text-black",
    markerBorder: "border-white",
    markerGlow: "shadow-[0_0_10px_rgba(204,255,0,0.6)]",
  },
  cafe: {
    tileUrl:
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    bgColor: "#FDFBF7",
    markerColor: "bg-[#6F4E37] text-white",
    markerBorder: "border-white",
    markerGlow: "shadow-[0_0_10px_rgba(111,78,55,0.4)]",
  },
  food: {
    tileUrl: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", // Positron (Clean)
    bgColor: "#FFF7ED",
    markerColor: "bg-[#EA580C] text-white",
    markerBorder: "border-black",
    markerGlow: "shadow-[0_0_10px_rgba(234,88,12,0.4)]",
  },
  restaurant: {
    tileUrl: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    bgColor: "#2A2A2A",
    markerColor: "bg-[#FFD700] text-black",
    markerBorder: "border-white",
    markerGlow: "shadow-[0_0_15px_rgba(255,215,0,0.6)]",
  },
  travel: {
    tileUrl:
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    bgColor: "#0E1C36",
    markerColor: "bg-[#0E1C36] text-[#FFD700]",
    markerBorder: "border-[#FFD700]",
    markerGlow: "shadow-[0_0_15px_rgba(255,215,0,0.4)]",
  },
  nightlife: {
    tileUrl: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    bgColor: "#000000",
    markerColor: "bg-[#FF0080] text-black",
    markerBorder: "border-[#00FFFF]",
    markerGlow: "shadow-[0_0_15px_#FF0080]",
  },
};

// Custom Neo-Brutalist Marker Factory
const createCustomIcon = (theme: (typeof MAP_THEMES)["default"]) => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div class="w-8 h-8 ${theme.markerColor} border-2 ${theme.markerBorder} transform -rotate-45 ${theme.markerGlow} hover:scale-110 transition-transform cursor-pointer flex items-center justify-center">
             <div class="w-2 h-2 bg-current rounded-full"></div>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

interface PlacesMapProps {
  places: Place[];
  variant?: string; // PlaceVariant
}

export default function PlacesMap({
  places,
  variant = "default",
}: PlacesMapProps) {
  // Default center: Chiang Mai Old City
  const center: [number, number] = [18.7883, 98.9853];

  // Get Theme Config
  const mapTheme = MAP_THEMES[variant] || MAP_THEMES.default;

  // Filter places with valid GPS
  const validPlaces = places.filter(
    (p) => p.latitude && p.longitude && p.latitude !== 0 && p.longitude !== 0
  );

  // Helper to resolve image
  const getDisplayImage = (place: Place) => {
    const stickerKey = PLACE_TYPE_STICKERS[place.place_type] || "culture";
    const stickerImage = `/stickers/${stickerKey}.png`;

    // Helper logic duplicated from PlaceCardNeo
    const resolveImageUrl = (url: string) => {
      if (url && url.startsWith("google_ref:")) {
        const ref = url.split("google_ref:")[1];
        return `${API_BASE}/places/photo?ref=${ref}`;
      }
      return url;
    };

    if (place.images && place.images.length > 0) {
      return resolveImageUrl(place.images[0].image_url);
    }
    if (place.cover_image_url) return place.cover_image_url;
    return stickerImage;
  };

  return (
    <div
      className={`w-full h-[600px] border-4 border-neo-black shadow-neo relative z-10 my-8`}
      style={{ borderColor: variant === "nightlife" ? "#FF0080" : "" }}
    >
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full"
        style={{ background: mapTheme.bgColor }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={mapTheme.tileUrl}
        />

        {validPlaces.map((place) => {
          const displayImage = getDisplayImage(place);
          const isSticker = displayImage.startsWith("/stickers");

          return (
            <Marker
              key={place.id}
              position={[place.latitude!, place.longitude!]}
              icon={createCustomIcon(mapTheme)}
            >
              <Popup className="neo-popup" closeButton={false}>
                <div className="w-[240px] p-0 font-sans">
                  {/* Image Header */}
                  <div className="relative h-32 w-full bg-neo-black border-b-2 border-neo-black overflow-hidden">
                    <img
                      src={displayImage}
                      alt={place.name}
                      className={`w-full h-full ${
                        !isSticker
                          ? "object-cover"
                          : "object-contain p-4 bg-neo-black/5"
                      }`}
                    />
                    <div className="absolute top-2 right-2">
                      <div className="bg-neo-lime px-2 py-0.5 border-2 border-neo-black text-[10px] font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-neo-black uppercase">
                        {place.place_type}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 bg-white">
                    <h3 className="font-black text-lg leading-tight mb-2 line-clamp-2 uppercase">
                      {place.name}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs font-mono text-gray-600">
                        <MapPin className="w-3 h-3 text-neo-black" />
                        <span className="truncate">
                          {place.google_maps_url
                            ? "View on Google Maps"
                            : "Chiang Mai"}
                        </span>
                      </div>
                      {/* Rating or Category? */}
                      {place.category_names &&
                        place.category_names.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {place.category_names.slice(0, 2).map((c) => (
                              <span
                                key={c}
                                className="text-[10px] bg-gray-100 px-1 border border-gray-300"
                              >
                                #{c}
                              </span>
                            ))}
                          </div>
                        )}
                    </div>

                    <Link
                      href={`/places/${place.id}`}
                      className="block w-full bg-neo-black text-white text-center py-2 font-black text-xs uppercase hover:bg-neo-blue transition-colors flex items-center justify-center gap-1 group"
                    >
                      <span className="text-white">View Place</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform text-white" />
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
