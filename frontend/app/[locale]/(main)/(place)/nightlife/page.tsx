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
  const t = await getTranslations({
    locale,
    namespace: "places.nightlife.meta",
  });

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
      "ไนท์ไลฟ์เชียงใหม่",
      "nightlife chiang mai",
      "bar",
      "club",
      "happy hour",
      "party",
    ],
  };
}

export default async function NightlifePage() {
  const [placesResponse, categories, placeTypes] = await Promise.all([
    fetchPlaces({ limit: 20, place_type: "Bar/Nightlife" }),
    fetchPlaceCategories("Bar/Nightlife"),
    fetchPlaceTypes(),
  ]);

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-neo-pink opacity-20 blur-[100px]"></div>

      {/* Hero Section - Neon Cyberpunk */}
      <div className="relative h-[600px] overflow-hidden border-b-4 border-neo-pink">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
        <Image
          src="https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1740&auto=format&fit=crop"
          alt="Chiang Mai Nightlife"
          fill
          priority
          className="object-cover grayscale contrast-[1.2] brightness-75"
          sizes="100vw"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
          <div className="relative">
            <h1
              className="text-7xl md:text-[8rem] font-black text-white mb-2 uppercase italic tracking-tighter leading-none"
              style={{
                textShadow: "4px 4px 0px #FF0080, -2px -2px 0px #00FFFF",
              }}
            >
              NIGHT <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF0080] to-[#00FFFF]">
                LIFE
              </span>
            </h1>
          </div>

          <div className="mt-8 flex gap-4">
            <div className="bg-[#FF0080] text-black px-6 py-2 font-mono font-bold text-xl uppercase -skew-x-12 border-2 border-white shadow-[4px_4px_0px_#fff]">
              Until Morning
            </div>
            <div className="bg-[#00FFFF] text-black px-6 py-2 font-mono font-bold text-xl uppercase -skew-x-12 border-2 border-white shadow-[4px_4px_0px_#fff]">
              Underground
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="container mx-auto px-4 py-12 relative z-10">
        <PlacesGrid
          initialPlaces={placesResponse.data}
          categories={categories}
          placeTypes={placeTypes}
          pagination={placesResponse.pagination}
          initialFilter={{ place_type: "Bar/Nightlife" }}
          variant="nightlife"
        />
      </section>
    </main>
  );
}
