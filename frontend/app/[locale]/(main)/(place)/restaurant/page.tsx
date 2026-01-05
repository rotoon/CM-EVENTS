import { PlacesGrid } from "@/components/places/places-grid";
import {
  fetchPlaceCategories,
  fetchPlaces,
  fetchPlaceTypes,
} from "@/lib/api-places";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fine Dining & Restaurants Chiang Mai | Hype CNX",
  description:
    "Discover premium dining experiences and top-rated restaurants in Chiang Mai.",
};

export default async function RestaurantPage() {
  const [placesResponse, categories, placeTypes] = await Promise.all([
    fetchPlaces({ limit: 20, place_type: "Restaurant" }),
    fetchPlaceCategories("Restaurant"),
    fetchPlaceTypes(),
  ]);

  return (
    <main className="min-h-screen bg-[#050505] text-white relative font-serif selection:bg-[#D4AF37] selection:text-black">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/70 z-10" />
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop"
          alt="Chiang Mai Fine Dining"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
          <div className="inline-block bg-black/80 text-[#FFD700] px-8 py-3 border-2 border-[#FFD700] tracking-[0.2em] text-sm mb-8 backdrop-blur-md font-medium uppercase shadow-[0_0_20px_rgba(212,175,55,0.3)]">
            Chiang Mai • Fine Dining
          </div>
          <h1 className="text-5xl md:text-7xl font-normal text-white mb-6 tracking-wide drop-shadow-2xl">
            Culinary{" "}
            <span className="font-serif italic text-[#FFD700] font-medium">
              Excellence
            </span>
          </h1>
          <p className="text-white/90 font-normal text-xl tracking-wider max-w-xl leading-relaxed font-sans drop-shadow-lg">
            Experience the pinnacle of gastronomy in an atmosphere of refined
            elegance.
          </p>
        </div>
      </div>

      {/* Content */}
      <section className="container mx-auto px-4 py-16">
        <PlacesGrid
          initialPlaces={placesResponse.data}
          categories={categories}
          placeTypes={placeTypes}
          pagination={placesResponse.pagination}
          initialFilter={{ place_type: "Restaurant" }}
          variant="restaurant"
        />
      </section>
    </main>
  );
}
