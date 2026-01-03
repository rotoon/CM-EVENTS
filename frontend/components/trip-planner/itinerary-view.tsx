"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Itinerary } from "@/lib/api-trip";
import { Clock, Globe, MapPin, Navigation, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

interface ItineraryViewProps {
  itinerary: Itinerary;
  onReset: () => void;
}

export function ItineraryView({ itinerary, onReset }: ItineraryViewProps) {
  const t = useTranslations("itinerary");

  return (
    <div className="space-y-20 animate-in fade-in slide-in-from-bottom-5 duration-700 font-sans">
      {/* Header Summary - Ultra Brutalist */}
      <div className="bg-neo-lime border-8 border-neo-black p-8 md:p-12 shadow-[16px_16px_0px_0px_#000000] relative overflow-hidden group transform -rotate-1">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition-all group-hover:scale-110">
          <Navigation className="w-48 h-48 md:w-72 md:h-72" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-7xl font-display font-black uppercase mb-4 tracking-tighter leading-[0.85] italic">
                {t("title").split(" ")[0]}
                <br />
                {t("title").split(" ").slice(1).join(" ")}
              </h2>
              <div className="bg-white inline-block px-4 py-3 border-4 border-neo-black shadow-neo transform rotate-1">
                <p className="text-xl md:text-2xl font-black uppercase leading-tight italic">
                  {itinerary.tripMeta.summary}
                </p>
              </div>
            </div>

            <button
              onClick={onReset}
              className="px-8 py-4 bg-neo-black text-white font-black text-xl uppercase hover:bg-neo-pink hover:text-white border-4 border-neo-black transition-all shadow-neo-lg hover:shadow-neo active:translate-y-2 active:shadow-none group"
            >
              <span className="flex items-center gap-2 group-hover:translate-x-2 transition-transform text-nowrap">
                {t("rePlan")}
                <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              </span>
            </button>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="bg-neo-black text-white px-4 py-1 font-black text-sm uppercase tracking-widest flex items-center gap-2">
              <Globe className="w-4 h-4" />
              {t("vibeStack")}
            </div>
            {(Array.isArray(itinerary.tripMeta.travelerProfile.style)
              ? itinerary.tripMeta.travelerProfile.style
              : [itinerary.tripMeta.travelerProfile.style]
            ).map((s) => (
              <Badge
                key={s}
                variant="outline"
                className="bg-white text-neo-black border-4 border-neo-black font-black px-4 py-2 rounded-none shadow-neo-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all text-base uppercase italic"
              >
                #{s}
              </Badge>
            ))}
            <Badge
              variant="outline"
              className="bg-neo-pink text-white border-4 border-neo-black font-black px-4 py-2 rounded-none shadow-neo-sm text-base uppercase italic"
            >
              {t("level")} {itinerary.tripMeta.travelerProfile.budgetLevel}
            </Badge>
          </div>

          {itinerary.overallNotes && (
            <div className="mt-10 p-6 bg-white border-4 border-neo-black shadow-neo text-lg font-bold flex gap-4 items-start max-w-2xl transform -rotate-1">
              <span className="text-4xl animate-bounce italic">!</span>
              <p className="italic leading-snug">"{itinerary.overallNotes}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Days Loop */}
      <div className="space-y-32">
        {itinerary.days.map((day) => (
          <div key={day.dayIndex} className="relative">
            {/* Massive Day Header */}
            <div className="sticky top-29 z-20 mb-12 flex items-center justify-center pointer-events-none">
              <div className="bg-neo-purple text-white px-6 py-3 md:px-10 md:py-4 border-4 border-neo-black shadow-neo-lg font-black text-2xl md:text-6xl uppercase tracking-tighter transform -rotate-2 pointer-events-auto hover:rotate-0 transition-transform cursor-default">
                {t("day")} {day.dayIndex}
              </div>
            </div>

            <div className="text-center mb-16 px-4">
              <h3 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-neo-black underline decoration-8 decoration-neo-lime underline-offset-8">
                {day.theme}
              </h3>
              <p className="mt-4 font-bold text-xl text-neo-black/60 uppercase tracking-widest">
                {day.date}
              </p>
            </div>

            <div className="grid gap-16 relative container mx-auto px-4 max-w-3xl">
              {/* Central Line */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-2 bg-neo-black hidden md:block opacity-10" />

              {day.items.map((item, idx) => (
                <div key={idx} className="relative group">
                  <Card className="rounded-none border-4 border-neo-black shadow-neo-lg hover:shadow-[12px_12px_0px_0px_#ff00ff] transition-all duration-500 overflow-hidden bg-white group hover:-translate-y-2">
                    <div className="flex flex-col md:flex-row">
                      {/* Image Space */}
                      <div className="w-full md:w-72 h-64 md:h-auto relative bg-neo-black border-b-4 md:border-b-0 md:border-r-4 border-neo-black shrink-0 group-hover:bg-neo-pink transition-colors">
                        {item.place.coverImageUrl ? (
                          <>
                            <Image
                              src={item.place.coverImageUrl}
                              alt={item.place.title}
                              fill
                              className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-90"
                            />
                            <div className="absolute inset-0 bg-neo-pink mix-blend-multiply opacity-0 group-hover:opacity-40 transition-opacity" />
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-8xl transform group-hover:scale-110 transition-transform">
                              {item.place.type === "event" ? "🎟️" : "📍"}
                            </span>
                          </div>
                        )}

                        {item.place.isFromHiveDatabase && (
                          <div className="absolute bottom-4 right-4 bg-neo-pink text-white text-xs font-black px-3 py-1 border-2 border-neo-black uppercase shadow-neo-sm transform -rotate-12 group-hover:rotate-0 transition-transform">
                            {t("verified")}
                          </div>
                        )}

                        <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-neo-lime text-neo-black font-black text-sm md:text-lg px-3 py-1 md:px-4 md:py-2 border-2 md:border-4 border-neo-black z-10 shadow-neo-sm group-hover:bg-white transition-colors">
                          {item.startTime}
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                        <div>
                          <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6">
                            <h4 className="text-3xl md:text-4xl font-display font-black uppercase leading-none italic group-hover:text-neo-purple transition-colors">
                              {item.place.title}
                            </h4>
                            {item.place.priceLevel && (
                              <div className="bg-neo-black text-neo-lime px-3 py-1 h-fit font-black text-lg border-2 border-neo-black transform rotate-6">
                                {item.place.priceLevel === "high"
                                  ? "$$$"
                                  : item.place.priceLevel === "medium"
                                  ? "$$"
                                  : "$"}
                              </div>
                            )}
                          </div>

                          <p className="text-lg font-bold text-neo-black/80 mb-8 leading-snug italic">
                            {item.place.shortDescription || item.notes}
                          </p>

                          <div className="flex flex-wrap gap-3">
                            {item.place.locationText && (
                              <div className="flex items-center gap-2 px-3 py-2 bg-neo-lime/10 border-2 border-neo-black text-sm font-black uppercase italic">
                                <MapPin className="w-5 h-5" />
                                {item.place.locationText}
                              </div>
                            )}
                            {item.travelFromPrevious?.transportMode && (
                              <div className="flex items-center gap-2 px-3 py-2 bg-neo-purple/10 border-2 border-neo-black text-sm font-black uppercase italic">
                                <Navigation className="w-5 h-5" />
                                {item.travelFromPrevious.transportMode} (
                                {item.travelFromPrevious.durationMinutes}m)
                              </div>
                            )}
                            <div className="flex items-center gap-2 px-3 py-2 bg-neo-pink/10 border-2 border-neo-black text-sm font-black uppercase italic">
                              <Clock className="w-5 h-5" />
                              {item.durationMinutes}m {t("slay")}
                            </div>
                          </div>
                        </div>

                        {/* Radical Actions */}
                        {(item.place.googleMapsUrl ||
                          item.place.socialMediaUrl) && (
                          <div className="mt-8 pt-8 border-t-4 border-neo-black flex justify-between items-center">
                            <div className="flex gap-6">
                              {item.place.socialMediaUrl && (
                                <Link
                                  href={item.place.socialMediaUrl}
                                  target="_blank"
                                  className="group/link flex items-center gap-2 text-base font-black uppercase italic"
                                >
                                  <div className="bg-neo-black p-1 text-white group-hover:bg-neo-pink transition-colors">
                                    <Globe className="w-4 h-4" />
                                  </div>
                                  {t("social")}
                                </Link>
                              )}
                              {item.place.googleMapsUrl && (
                                <Link
                                  href={item.place.googleMapsUrl}
                                  target="_blank"
                                  className="group/link flex items-center gap-2 text-base font-black uppercase italic"
                                >
                                  <div className="bg-neo-black p-1 text-white group-hover:bg-neo-lime group-hover:text-neo-black transition-colors">
                                    <Navigation className="w-4 h-4" />
                                  </div>
                                  {t("reachIt")}
                                </Link>
                              )}
                            </div>
                            <div className="text-neo-black/20 font-black text-3xl select-none group-hover:opacity-100 opacity-0 transition-opacity">
                              #{idx + 1}
                            </div>
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
