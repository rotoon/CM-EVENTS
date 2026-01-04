import { PlacesGrid } from "@/components/places/places-grid";
import {
  fetchPlaceCategories,
  fetchPlaces,
  fetchPlaceTypes,
} from "@/lib/api-places";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Street Food & Local Eats Chiang Mai | Hype CNX",
  description:
    "Must-try street food and local restaurants in Chiang Mai. Khao Soi, Sai Ua, and more.",
};

export default async function FoodPage() {
  const [placesResponse, categories, placeTypes] = await Promise.all([
    fetchPlaces({ limit: 20, place_type: "Food" }),
    fetchPlaceCategories(),
    fetchPlaceTypes(),
  ]);

  return (
    <main className="min-h-screen bg-white text-neutral-900 relative font-sans selection:bg-[#EA580C] selection:text-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10" />
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop"
          alt="Chiang Mai Street Food"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
          <div className="inline-block bg-[#EA580C] text-white px-6 py-2 transform -rotate-2 font-black uppercase tracking-wider text-sm mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
            Chiang Mai • Street Eats
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-4 tracking-tighter drop-shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase">
            Aroi{" "}
            <span className="text-[#EA580C] text-stroke-white">Mak Mak</span>
          </h1>
          <p className="text-white font-bold text-xl tracking-wide max-w-lg leading-relaxed drop-shadow-md bg-black/60 px-4 py-2 backdrop-blur-sm">
            From spicy street stalls to legendary local spots.
          </p>
        </div>
      </div>

      {/* Content */}
      <section className="container mx-auto px-4 py-12">
        <PlacesGrid
          initialPlaces={placesResponse.data}
          categories={categories}
          placeTypes={placeTypes}
          pagination={placesResponse.pagination}
          initialFilter={{ place_type: "Food" }}
          variant="food"
        />
      </section>
    </main>
  );
}
