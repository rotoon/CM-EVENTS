import { PlacesGrid } from "@/components/places/places-grid";
import {
  fetchPlaceCategories,
  fetchPlaces,
  fetchPlaceTypes,
} from "@/lib/api-places";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ร้านอาหาร & คาเฟ่เชียงใหม่ | Hype CNX",
  description:
    "รวมร้านอาหาร คาเฟ่ ที่เที่ยว บาร์ และสถานที่น่าไปในเชียงใหม่ กว่า 700 ร้าน คัดสรรโดย Newbie.CNX",
  keywords: [
    "ร้านอาหารเชียงใหม่",
    "คาเฟ่เชียงใหม่",
    "ที่เที่ยวเชียงใหม่",
    "Chiang Mai cafe",
    "Chiang Mai restaurant",
  ],
  openGraph: {
    title: "ร้านอาหาร & คาเฟ่เชียงใหม่ | Hype CNX",
    description:
      "รวมร้านอาหาร คาเฟ่ ที่เที่ยว บาร์ และสถานที่น่าไปในเชียงใหม่ กว่า 700 ร้าน",
    type: "website",
  },
};

export default async function PlacesPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const filter = {
    limit: 20,
    place_type: searchParams.place_type as string | undefined,
    category: searchParams.category as string | undefined,
    search: searchParams.search as string | undefined,
  };

  const [placesResponse, categories, placeTypes] = await Promise.all([
    fetchPlaces(filter),
    fetchPlaceCategories(),
    fetchPlaceTypes(),
  ]);

  const totalPlaces = (placeTypes || []).reduce((sum, t) => sum + t.count, 0);

  return (
    <main className="min-h-screen bg-neo-black text-white relative overflow-hidden">
      {/* Noise Texture Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03]"
        style={{ filter: "url(#noiseFilter)" }}
      >
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-16 md:pt-24 pb-8 relative z-10">
        {/* Hashtag Badge */}
        <div className="inline-block bg-neo-pink text-white px-4 py-2 font-display font-black text-sm border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] mb-6 animate-bounce-slow -rotate-2">
          #CHIANGMAI_EATS
        </div>

        {/* Hero Title */}
        <h1 className="font-black text-6xl md:text-8xl lg:text-9xl leading-[0.8] mb-8 text-neo-lime uppercase italic">
          PLACES <br />
          <span
            className="text-white animate-pulse"
            style={{ WebkitTextStroke: "2px #a3e635" }}
          >
            TO&nbsp;VIBE
          </span>
        </h1>
      </div>

      {/* Places Content */}
      <section className="container mx-auto px-4 py-8 relative z-10">
        <PlacesGrid
          initialPlaces={placesResponse.data}
          categories={categories}
          placeTypes={placeTypes}
          pagination={placesResponse.pagination}
          initialFilter={filter}
        />
      </section>
    </main>
  );
}
