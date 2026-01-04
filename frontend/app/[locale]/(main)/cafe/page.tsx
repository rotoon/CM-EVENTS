import { PlacesGrid } from "@/components/places/places-grid";
import {
  fetchPlaceCategories,
  fetchPlaces,
  fetchPlaceTypes,
} from "@/lib/api-places";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cafe Hopping Chiang Mai | Hype CNX",
  description:
    "Best cafes in Chiang Mai. Specialty coffee, cozy vibes, and work-friendly spaces.",
};

export default async function CafePage() {
  const [placesResponse, categories, placeTypes] = await Promise.all([
    fetchPlaces({ limit: 20, place_type: "Cafe" }),
    fetchPlaceCategories(),
    fetchPlaceTypes(),
  ]);

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#2C1810] relative font-sans selection:bg-[#A58D71] selection:text-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img
          src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2071&auto=format&fit=crop"
          alt="Chiang Mai Cafe"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
          <div className="inline-block bg-[#FDFBF7]/95 backdrop-blur-md text-[#2C1810] px-6 py-2 rounded-full font-bold uppercase tracking-[0.2em] text-xs mb-6 shadow-sm border border-[#E5E5E5]">
            Chiang Mai • Coffee Culture
          </div>
          <h1 className="text-5xl md:text-7xl font-medium text-white mb-4 tracking-tight drop-shadow-xl">
            The <span className="font-serif italic font-bold">Art</span> of Slow
            Bar
          </h1>
          <p className="text-white font-medium text-lg tracking-wide max-w-lg leading-relaxed drop-shadow-lg text-shadow-sm">
            Curated spaces for focus, conversation, and exceptional coffee.
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
          initialFilter={{ place_type: "Cafe" }}
          variant="cafe"
        />
      </section>
    </main>
  );
}
