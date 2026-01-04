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

export default async function PlacesPage() {
  const [placesResponse, categories, placeTypes] = await Promise.all([
    fetchPlaces({ limit: 20 }),
    fetchPlaceCategories(),
    fetchPlaceTypes(),
  ]);

  const totalPlaces = placeTypes.reduce((sum, t) => sum + t.count, 0);

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Compact Hero */}
      <section className="bg-white border-b border-stone-200">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-stone-900">
                Places
              </h1>
              <p className="text-sm text-stone-500 mt-1">
                {totalPlaces.toLocaleString()} ร้านอาหาร คาเฟ่
                และสถานที่น่าไปในเชียงใหม่
              </p>
            </div>
            <a
              href="https://www.instagram.com/newbie.cnx/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-full hover:opacity-90 transition-opacity"
            >
              📸 @newbie.cnx
            </a>
          </div>
        </div>
      </section>

      {/* Places Content */}
      <section className="container mx-auto px-4 py-6">
        <PlacesGrid
          initialPlaces={placesResponse.data}
          categories={categories}
          placeTypes={placeTypes}
          pagination={placesResponse.pagination}
        />
      </section>
    </main>
  );
}
