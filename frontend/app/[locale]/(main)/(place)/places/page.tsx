import { PlacesGrid } from "@/components/places/places-grid";
import { FloatingStickers } from "@/components/ui/floating-stickers";
import {
  fetchPlaceCategories,
  fetchPlaces,
  fetchPlaceTypes,
} from "@/lib/api-places";
import { MapPin, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "places.main.meta" });

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
      "ร้านอาหารเชียงใหม่",
      "คาเฟ่เชียงใหม่",
      "ที่เที่ยวเชียงใหม่",
      "Chiang Mai cafe",
      "Chiang Mai restaurant",
      "Chiang Mai travel",
    ],
  };
}

export default async function PlacesPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "places.main" });
  const resolvedSearchParams = await searchParams;
  const filter = {
    limit: 20,
    place_type: resolvedSearchParams.place_type as string | undefined,
    category: resolvedSearchParams.category as string | undefined,
    search: resolvedSearchParams.search as string | undefined,
  };

  const [placesResponse, categories, placeTypes] = await Promise.all([
    fetchPlaces(filter),
    fetchPlaceCategories(),
    fetchPlaceTypes(),
  ]);

  return (
    <main className="min-h-screen bg-[#f0f0f0] pb-20">
      {/* Hero Header - Same style as Plan page */}
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
              #CHIANGMAI_EATS
            </h1>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-8xl font-black mb-8 leading-[0.9] tracking-tighter uppercase italic">
            {t("hero.title1")} <br />
            <span className="text-neo-lime relative">
              {t("hero.title2")}
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
            </span>
          </h2>

          <p className="text-2xl md:text-3xl font-display font-bold text-gray-300 max-w-2xl mx-auto leading-tight italic">
            {t("hero.subtitle1")} <br />
            <span className="text-neo-pink">{t("hero.subtitle2")}</span>
          </p>
        </div>

        {/* Bottom Wave Border-ish effect */}
        <div className="absolute bottom-0 left-0 w-full h-4 bg-neo-purple" />
      </div>

      {/* Places Content */}
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex items-center gap-4 mb-10 border-b-8 border-neo-black pb-6">
          <div className="bg-neo-purple p-3 md:p-4 border-4 border-neo-black text-white rotate-3 shrink-0">
            <MapPin className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <div>
            <h3 className="text-3xl md:text-4xl font-black uppercase italic leading-none">
              {t("header.title")}
            </h3>
            <p className="font-bold text-neo-black/60 uppercase tracking-widest text-sm mt-1">
              {t("header.subtitle")}
            </p>
          </div>
        </div>

        <PlacesGrid
          initialPlaces={placesResponse.data}
          categories={categories}
          placeTypes={placeTypes}
          pagination={placesResponse.pagination}
          initialFilter={filter}
        />
      </div>
    </main>
  );
}
