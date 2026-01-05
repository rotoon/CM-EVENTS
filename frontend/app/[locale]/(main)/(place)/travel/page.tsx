import { PlacesGrid } from "@/components/places/places-grid";
import {
  fetchPlaceCategories,
  fetchPlaces,
  fetchPlaceTypes,
} from "@/lib/api-places";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Travel & Nature Chiang Mai | Hype CNX",
  description:
    "Explore waterfalls, mountains, and hidden gems in Chiang Mai nature.",
};

export default async function TravelPage() {
  const [placesResponse, categories, placeTypes] = await Promise.all([
    fetchPlaces({ limit: 20, place_type: "Travel" }),
    fetchPlaceCategories("Travel"),
    fetchPlaceTypes(),
  ]);

  return (
    <main className="min-h-screen bg-[#0E1C36] text-[#E2E8F0] relative font-sans selection:bg-[#FFD700] selection:text-[#0E1C36]">
      {/* Hero Section - Royal Lanna Blue */}
      <div className="relative h-[85vh] overflow-hidden flex items-end pb-20">
        {/* Deep Blue Gradient for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E1C36] via-[#0E1C36]/40 to-transparent z-10" />
        <img
          src="https://apis.airportthai.co.th/microsite/images/post/ckeditor/2021-12-15-16-20-409-shutterstock_530812552.jpg"
          alt="Chiang Mai Travel"
          className="w-full h-full object-cover fixed-bg-effect absolute inset-0 opacity-90"
        />
        <div className="relative z-20 px-8 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
            <div>
              <span className="block text-[#FFD700] font-mono text-sm tracking-[0.3em] mb-4 uppercase drop-shadow-md">
                The Unseen Journey
              </span>
              <h1 className="text-8xl md:text-[10rem] font-serif leading-[0.8] text-white mix-blend-overlay opacity-100 drop-shadow-2xl">
                DISCOVER <br />{" "}
                <span className="italic font-light ml-20 text-[#FFD700] opacity-100 mix-blend-normal">
                  CHIANG MAI
                </span>
              </h1>
            </div>
            <p className="text-gray-200 font-medium text-lg max-w-sm border-l-2 border-[#FFD700] pl-6 leading-relaxed drop-shadow-lg">
              Experience the timeless elegance of Northern Thailand, where
              golden temples meet the endless blue sky.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="container mx-auto px-4 py-12">
        <PlacesGrid
          initialPlaces={placesResponse.data}
          categories={categories}
          placeTypes={placeTypes}
          pagination={placesResponse.pagination}
          initialFilter={{ place_type: "Travel" }}
          variant="travel"
        />
      </section>
    </main>
  );
}
