"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Itinerary } from "@/lib/api-trip";
import { Clock, Globe, MapPin, Navigation } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ItineraryViewProps {
  itinerary: Itinerary;
  onReset: () => void;
}

export function ItineraryView({ itinerary, onReset }: ItineraryViewProps) {
  return (
    <div className="space-y-12 animate-in fade-in duration-500 font-sans">
      {/* Header Summary */}
      <div className="bg-neo-lime border-4 border-neo-black p-6 md:p-8 shadow-neo-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Navigation className="w-32 h-32 md:w-48 md:h-48" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-black uppercase mb-3 tracking-tight leading-none">
                Trip Summary
              </h2>
              <p className="text-xl font-bold bg-white inline-block px-2 py-1 border-2 border-neo-black shadow-neo-sm transform -rotate-1">
                {itinerary.tripMeta.summary}
              </p>
            </div>

            <button
              onClick={onReset}
              className="px-6 py-2 bg-neo-black text-white font-bold hover:bg-white hover:text-neo-black border-2 border-neo-black transition-all shadow-neo hover:shadow-neo-lg hover:-translate-y-1 active:translate-y-0"
            >
              Plan New Trip
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            {(Array.isArray(itinerary.tripMeta.travelerProfile.style)
              ? itinerary.tripMeta.travelerProfile.style
              : [itinerary.tripMeta.travelerProfile.style]
            ).map((s) => (
              <Badge
                key={s}
                variant="outline"
                className="bg-white text-neo-black border-2 border-neo-black font-bold px-3 py-1 rounded-none shadow-neo-sm hover:shadow-neo hover:-translate-y-0.5 transition-all text-sm uppercase"
              >
                {s}
              </Badge>
            ))}
            <Badge
              variant="outline"
              className="bg-white text-neo-black border-2 border-neo-black font-bold px-3 py-1 rounded-none shadow-neo-sm hover:translate-y-0.5 transition-all text-sm uppercase"
            >
              Budget: {itinerary.tripMeta.travelerProfile.budgetLevel}
            </Badge>
          </div>

          {itinerary.overallNotes && (
            <div className="mt-6 p-4 bg-white border-2 border-neo-black shadow-neo text-base font-medium flex gap-3 items-start">
              <span className="text-2xl">💡</span>
              <p>{itinerary.overallNotes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Days Loop */}
      <div className="space-y-16">
        {itinerary.days.map((day) => (
          <div key={day.dayIndex} className="relative">
            <div className="sticky top-20 z-10 bg-white/95 backdrop-blur-sm py-4 mb-8 border-y-2 border-neo-black shadow-sm">
              <div className="flex items-center gap-4 px-2">
                <div className="bg-neo-purple text-white px-4 py-2 border-2 border-neo-black shadow-neo font-black text-xl uppercase tracking-wider transform -rotate-2">
                  DAY {day.dayIndex}
                </div>
                <div className="text-xl md:text-2xl font-display font-bold text-neo-black uppercase tracking-tight">
                  {day.date} —{" "}
                  <span className="text-neo-purple">{day.theme}</span>
                </div>
              </div>
            </div>

            <div className="grid gap-8 pl-4 md:pl-8 border-l-4 border-neo-black ml-4 md:ml-6 relative">
              {day.items.map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[29px] md:-left-[46px] top-8 w-6 h-6 bg-neo-lime border-4 border-neo-black group-hover:scale-125 transition-transform z-10" />

                  <Card className="rounded-none border-2 border-neo-black shadow-neo hover:shadow-neo-lg transition-all duration-300 overflow-hidden bg-white group hover:-translate-y-1">
                    <div className="flex flex-col md:flex-row">
                      {/* Image Logic */}
                      <div className="w-full md:w-64 h-48 md:h-auto relative bg-gray-100 border-b-2 md:border-b-0 md:border-r-2 border-neo-black shrink-0">
                        {item.place.coverImageUrl ? (
                          <Image
                            src={item.place.coverImageUrl}
                            alt={item.place.title}
                            fill
                            className="object-cover transition-all duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-neo-black/5">
                            <span className="text-6xl filter transition-all">
                              {item.place.type === "event" ? "🎟️" : "📍"}
                            </span>
                          </div>
                        )}
                        {item.place.isFromHiveDatabase && (
                          <div className="absolute top-0 right-0 bg-neo-pink text-white text-xs font-black px-2 py-1 border-l-2 border-b-2 border-neo-black uppercase shadow-sm">
                            HYPE Verified
                          </div>
                        )}

                        {/* Time Badge (Mobile Overlay / Desktop Top Left) */}
                        <div className="absolute top-0 left-0 bg-neo-lime text-neo-black font-bold text-sm px-3 py-1 border-r-2 border-b-2 border-neo-black z-10">
                          {item.startTime}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex flex-col md:flex-row justify-between md:items-start gap-2 mb-3">
                            <h4 className="text-2xl font-display font-black uppercase leading-tight group-hover:text-neo-purple transition-colors">
                              {item.place.title}
                            </h4>
                            <div className="flex items-center gap-1 shrink-0">
                              {item.place.priceLevel && (
                                <Badge
                                  variant="outline"
                                  className="rounded-none border-2 border-neo-black bg-gray-50 text-xs font-bold"
                                >
                                  {item.place.priceLevel === "high"
                                    ? "💰💰💰"
                                    : item.place.priceLevel === "medium"
                                    ? "💰💰"
                                    : "💰"}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <p className="text-base font-medium text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                            {item.place.shortDescription || item.notes}
                          </p>

                          <div className="flex flex-wrap gap-2 text-sm font-bold text-gray-500">
                            {item.place.locationText && (
                              <div className="flex items-center gap-1.5 px-2 py-1 bg-yellow-50 border border-neo-black/20 text-neo-black">
                                <MapPin className="w-4 h-4" />
                                {item.place.locationText}
                              </div>
                            )}
                            {item.travelFromPrevious?.transportMode && (
                              <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 border border-neo-black/20 text-neo-black">
                                <Navigation className="w-4 h-4" />
                                <span className="capitalize">
                                  {item.travelFromPrevious.transportMode}
                                </span>
                                <span>
                                  ({item.travelFromPrevious.durationMinutes}m)
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 border border-neo-black/20 text-neo-black">
                              <Clock className="w-4 h-4" />
                              {item.durationMinutes}m duration
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        {(item.place.googleMapsUrl ||
                          item.place.socialMediaUrl) && (
                          <div className="mt-4 pt-4 border-t-2 border-neo-black/10 flex justify-end gap-4">
                            {item.place.socialMediaUrl && (
                              <Link
                                href={item.place.socialMediaUrl}
                                target="_blank"
                                className="group/btn flex items-center gap-2 text-sm font-black uppercase hover:underline decoration-2 underline-offset-4 decoration-neo-pink"
                              >
                                Social{" "}
                                <Globe className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                              </Link>
                            )}
                            {item.place.googleMapsUrl && (
                              <Link
                                href={item.place.googleMapsUrl}
                                target="_blank"
                                className="group/btn flex items-center gap-2 text-sm font-black uppercase hover:underline decoration-2 underline-offset-4 decoration-neo-pink"
                              >
                                Open Map{" "}
                                <Navigation className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                              </Link>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
