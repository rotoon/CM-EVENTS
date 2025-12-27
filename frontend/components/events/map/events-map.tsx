"use client";

import { TAGS } from "@/lib/constants";
import { Event } from "@/lib/types";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

// Fix for default Leaflet icon not loading correctly in Next.js
// We are using a custom DivIcon, so this might not be strictly necessary,
// but good for safety if we fallback to default icons.
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Neo-Brutalist Marker using DivIcon
const createCustomIcon = (isEnded: boolean) => {
  const colorClass = isEnded ? "bg-gray-400 grayscale" : "bg-neo-pink";
  return L.divIcon({
    className: "custom-marker",
    html: `<div class="w-8 h-8 ${colorClass} border-4 border-neo-black transform -rotate-45 shadow-neo hover:scale-110 transition-transform cursor-pointer flex items-center justify-center">
             <div class="w-2 h-2 bg-white rounded-full"></div>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32], // Center bottom-ish
    popupAnchor: [0, -32],
  });
};

interface EventsMapProps {
  events: Event[];
}

export default function EventsMap({ events }: EventsMapProps) {
  // Default center: Chiang Mai Old City
  const center: [number, number] = [18.7883, 98.9853];

  // Filter events that have valid GPS
  const validEvents = events.filter(
    (e) => e.latitude && e.longitude && e.latitude !== 0 && e.longitude !== 0
  );

  return (
    <div className="w-full h-[600px] border-4 border-neo-black shadow-neo relative z-10">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full"
        style={{ background: "#f0f0f0" }}
      >
        {/* CartoDB Voyager Tile Layer - Clean & Professional */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {validEvents.map((event) => (
          <Marker
            key={event.id}
            position={[event.latitude!, event.longitude!]}
            icon={createCustomIcon(!!event.is_ended)}
          >
            <Popup className="neo-popup" closeButton={false}>
              <div className="w-full p-0 font-sans">
                {/* Image Header */}
                <div className="relative h-32 w-full bg-neo-black border-b-2 border-neo-black">
                  {event.cover_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${event.cover_image_url})`,
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-400 font-mono text-xs">
                        NO IMAGE
                      </span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                    {event.is_ended ? (
                      <div className="bg-neo-pink text-white px-2 py-0.5 border-2 border-neo-black text-[10px] font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase">
                        ENDED
                      </div>
                    ) : (
                      <div className="bg-neo-lime px-2 py-0.5 border-2 border-neo-black text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-neo-black uppercase">
                        {TAGS[event.id % TAGS.length]}
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 bg-white">
                  <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2">
                    {event.title}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs font-mono text-gray-600">
                      <Calendar className="w-3 h-3 text-neo-pink" />
                      <span>{event.date_text || "TBA"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-gray-600">
                      <Clock className="w-3 h-3 text-neo-purple" />
                      <span>{event.time_text || "All Day"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-gray-600 truncate">
                      <MapPin className="w-3 h-3 text-neo-black" />
                      <span className="truncate">
                        {event.location || "Chiang Mai"}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/events/${event.id}`}
                    className="block w-full bg-neo-black text-white text-center py-2 font-black text-xs uppercase hover:bg-neo-pink transition-colors flex items-center justify-center gap-1 group"
                  >
                    <span className="text-white">View Details</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform text-white" />
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
