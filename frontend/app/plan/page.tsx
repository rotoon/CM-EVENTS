"use client";

import { ItineraryView } from "@/components/trip-planner/itinerary-view";
import { TripPlannerForm } from "@/components/trip-planner/trip-form";
import { Itinerary, TripCriteria, planTrip } from "@/lib/api-trip";
import { Map, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function PlanPage() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreateTrip = async (data: TripCriteria) => {
    setLoading(true);
    try {
      const result = await planTrip(data);
      setItinerary(result);
      toast.success("Trip Generated! 🚀", {
        description: "Your personalized itinerary is ready.",
      });
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "Failed to generate trip",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neo-bg pb-20">
      {/* Hero Header */}
      <div className="bg-neo-black text-white py-16 px-4 mb-8 pattern-dots">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center justify-center p-3 bg-neo-pink border-2 border-white shadow-[4px_4px_0px_0px_#ffffff] mb-6 transform -rotate-2">
            <Sparkles className="w-6 h-6 mr-2" />
            <h1 className="text-2xl font-black uppercase tracking-wider">
              AI Trip Planner
            </h1>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Design Your{" "}
            <span className="text-neo-lime underline decoration-wavy decoration-neo-purple decoration-4 underline-offset-8">
              Perfect
            </span>{" "}
            Chiang Mai Trip
          </h2>
          <p className="text-xl md:text-2xl font-bold text-gray-300 max-w-2xl mx-auto">
            Tell us your style, we'll build the plan. <br />
            Powered by AI + Local Events.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4">
        {!itinerary ? (
          <div className="bg-white border-4 border-neo-black shadow-neo-lg p-6 md:p-10">
            <div className="flex items-center gap-3 mb-8 border-b-4 border-neo-black pb-4">
              <div className="bg-neo-purple p-2 border-2 border-neo-black text-white">
                <Map className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black uppercase">Start Planning</h3>
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
