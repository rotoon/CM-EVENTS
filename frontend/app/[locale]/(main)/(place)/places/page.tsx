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
    <main className="min-h-screen bg-white relative overflow-hidden">
      {/* Grid Pattern Background */}
      <div
        className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 pt-16 md:pt-24 pb-8 relative z-10">
        {/* Hashtag Badge */}
        <div className="inline-block bg-neo-pink text-white px-4 py-2 font-display font-black text-sm border-2 border-neo-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6 animate-bounce-slow -rotate-2">
          #CHIANGMAI_EATS
        </div>

        {/* Hero Title */}
        <h1 className="font-black text-6xl md:text-8xl lg:text-9xl leading-tight mb-8 uppercase text-neo-black">
          PLACES <br />
          <span
            className="text-white bg-neo-black px-4 inline-block mt-2"
            style={{ WebkitTextStroke: "2px black" }}
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
