import { PlacesGrid } from "@/components/places/places-grid";
import {
  fetchPlaceCategories,
  fetchPlaces,
  fetchPlaceTypes,
} from "@/lib/api-places";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "places.travel.meta" });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      locale: locale === "th" ? "th_TH" : "en_US",
    },
    keywords: [
      "ที่เที่ยวเชียงใหม่",
      "travel chiang mai",
      "nature",
      "waterfall",
      "mountain",
      "doi suthep",
    ],
  };
}

export default async function TravelPage() {
  const [placesResponse, categories, placeTypes] = await Promise.all([
    fetchPlaces({ limit: 20, place_type: "Travel" }),
    fetchPlaceCategories("Travel"),
    fetchPlaceTypes(),
  ]);

  return (
    <main className="min-h-screen bg-[#0E1C36] text-[#E2E8F0] relative font-sans selection:bg-[#FFD700] selection:text-[#0E1C36]">
      {/* Hero Section - Royal Lanna Blue */}
      <div className="relative h-[60vh] overflow-hidden flex items-end pb-16">
        {/* Deep Blue Gradient for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E1C36] via-[#0E1C36]/50 to-transparent z-10" />
        <Image
          src="https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=2070&auto=format&fit=crop"
          alt="Chiang Mai Travel"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="relative z-20 px-8 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
            <div>
              <span className="block text-[#FFD700] font-mono text-sm tracking-[0.3em] mb-4 uppercase drop-shadow-md">
                The Unseen Journey
              </span>
              <h1 className="text-6xl md:text-8xl font-serif leading-[0.9] text-white drop-shadow-2xl">
                DISCOVER <br />{" "}
                <span className="italic font-light ml-10 text-[#FFD700]">
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
