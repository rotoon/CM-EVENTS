"use client";

import { ItineraryView } from "@/components/trip-planner/itinerary-view";
import { TripPlannerForm } from "@/components/trip-planner/trip-form";
import { Button } from "@/components/ui/button";
import { FloatingStickers } from "@/components/ui/floating-stickers";
import { Itinerary, TripCriteria, planTrip } from "@/lib/api-trip";
import { MOCK_ITINERARY } from "@/lib/mock-itinerary";
import { Coffee, Map, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

export default function PlanPage() {
  const t = useTranslations("tripPlanner");
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreateTrip = async (data: TripCriteria) => {
    setLoading(true);
    try {
      const result = await planTrip(data);
      setItinerary(result);
      toast.success(t("form.toasts.success"), {
        description: t("form.toasts.successDesc"),
      });
    } catch (error) {
      console.error(error);
      toast.error(t("form.toasts.error"), {
        description:
          error instanceof Error ? error.message : "Failed to generate trip",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f0f0f0] pb-20">
      {/* Hero Header */}
      <div className="relative bg-neo-black text-white py-20 px-4 mb-12 overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none translate-y-[-10%]"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        {/* Decorative Stickers */}
        <FloatingStickers />

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center justify-center px-6 py-3 bg-neo-pink border-4 border-white shadow-[8px_8px_0px_0px_#ffffff] mb-10 transform -rotate-2 hover:rotate-0 transition-transform duration-300">
            <Sparkles className="w-8 h-8 mr-3 animate-pulse" />
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic">
              {t("hero.tagline")}
            </h1>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-8xl font-black mb-8 leading-[0.9] tracking-tighter uppercase italic">
            {t("hero.title").split(" ").slice(0, 2).join(" ")} <br />
            <span className="text-neo-lime relative">
              {t("hero.title").split(" ")[2]}
              <svg
                className="absolute -bottom-2 md:-bottom-4 left-0 w-full h-4 text-neo-purple opacity-70"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 Q 25 0, 50 5 T 100 5"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                />
              </svg>
            </span>{" "}
            <br />
            {t("hero.title").split(" ").slice(3).join(" ")}
          </h2>

          <p className="text-2xl md:text-3xl font-display font-bold text-gray-300 max-w-2xl mx-auto leading-tight italic">
            {t("hero.p1")} <br />
            <span className="text-neo-pink">{t("hero.p2")}</span>
          </p>
        </div>

        {/* Bottom Wave Border-ish effect */}
        <div className="absolute bottom-0 left-0 w-full h-4 bg-neo-purple" />
      </div>

      <div className="container mx-auto max-w-4xl px-4">
        {!itinerary ? (
          <div className="bg-white border-4 border-neo-black shadow-neo-lg p-6 md:p-10 transform hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between mb-10 border-b-8 border-neo-black pb-6">
              <div className="flex items-center gap-4">
                <div className="bg-neo-purple p-4 border-4 border-neo-black text-white rotate-3">
                  <Map className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-3xl md:text-4xl font-black uppercase italic leading-none">
                    {t("hero.button")}
                  </h3>
                  <p className="font-bold text-neo-black/60 uppercase tracking-widest text-sm mt-1">
                    Free & Fast
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => {
                  setItinerary(MOCK_ITINERARY);
                  toast.success(t("form.toasts.demoLoaded"), {
                    description: t("form.toasts.demoLoadedDesc"),
                  });
                }}
                className="hidden md:flex border-4 border-neo-black rounded-none font-black uppercase italic gap-2 bg-neo-lime hover:bg-white shadow-neo active:shadow-none"
              >
                <Coffee className="w-5 h-5" />
                {t("form.demo")}
              </Button>
            </div>
            <TripPlannerForm onSubmit={handleCreateTrip} isLoading={loading} />
          </div>
        ) : (
          <ItineraryView
            itinerary={itinerary}
            onReset={() => setItinerary(null)}
          />
        )}
      </div>
    </main>
  );
}
