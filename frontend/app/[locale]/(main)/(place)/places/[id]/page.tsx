import { PlaceDetailMap } from "@/components/places/place-detail-map";
import { PlaceGallery } from "@/components/places/place-gallery";
import { fetchPlaceById } from "@/lib/api-places";
import { cn } from "@/lib/utils";
import { ArrowLeft, ImageIcon } from "lucide-react";
import type { Metadata } from "next";
// Removed dynamic import since we use a Client Component wrapper now
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";

// Place Type → Neo-Brutalist color scheme
const TYPE_STYLES: Record<string, { bg: string; text: string }> = {
  Cafe: { bg: "bg-neo-purple", text: "text-white" },
  Food: { bg: "bg-neo-pink", text: "text-white" },
  Restaurant: { bg: "bg-neo-lime", text: "text-black" },
  Travel: { bg: "bg-neo-cyan", text: "text-black" },
  "Bar/Nightlife": {
    bg: "bg-neo-black",
    text: "text-white",
  },
};

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const place = await fetchPlaceById(parseInt(id));

  if (!place) {
    return { title: "ไม่พบร้าน | Hype CNX" };
  }

  return {
    title: `${place.name} | ${place.place_type} | Hype CNX`,
    description:
      place.description?.slice(0, 160) ||
      `${place.name} - ${place.place_type} ในเชียงใหม่`,
    openGraph: {
      title: `${place.name} | Hype CNX`,
      description:
        place.description?.slice(0, 160) ||
        `${place.name} - ${place.place_type} ในเชียงใหม่`,
      type: "article",
    },
  };
}

export default async function PlaceDetailPage({ params }: PageProps) {
  const { id, locale } = await params;
  const place = await fetchPlaceById(parseInt(id));
  const t = await getTranslations({ locale, namespace: "places.placeDetail" });

  if (!place) {
    notFound();
  }

  const typeStyle = TYPE_STYLES[place.place_type] || {
    bg: "bg-white",
    text: "text-black",
  };

  const images = place.images || [];
  // Ensure cover image is included if no images or distinct
  const allImages = [...images];
  if (
    place.cover_image_url &&
    !allImages.find((img) => img.image_url === place.cover_image_url)
  ) {
    allImages.unshift({
      id: 0,
      place_id: place.id,
      image_url: place.cover_image_url,
      caption: null,
    });
  }

  return (
    <main className="min-h-screen bg-neo-black text-white relative overflow-hidden">
      {/* Noise Texture Overlay */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Back Navigation */}
      <div className="sticky top-0 z-20 bg-neo-black/80 backdrop-blur-md border-b-4 border-neo-black shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            href="/places"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase text-white hover:text-neo-lime transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {t("backToPlaces")}
          </Link>
        </div>
      </div>

      {/* Detail Content */}
      <section className="relative z-10 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="space-y-16">
            {/* 1. Info Section */}
            <div className="space-y-6 max-w-4xl">
              {/* Type Badge */}
              <span
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-1.5 text-base font-black uppercase tracking-wide",
                  "border-2 border-neo-lime shadow-[4px_4px_0px_0px_#ccff00]",
                  typeStyle.bg,
                  typeStyle.text
                )}
              >
                {place.place_type}
              </span>

              {/* Place Name */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black text-white uppercase italic tracking-tighter leading-none [text-shadow:_4px_4px_0_rgb(0_0_0)]">
                {place.name}
              </h1>

              {/* Categories */}
              {place.category_names && place.category_names.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {place.category_names.map((cat) => (
                    <Link
                      key={cat}
                      href={`/places?category=${cat}`}
                      className="px-4 py-2 text-sm font-bold uppercase tracking-wider bg-neo-black text-white border-2 border-white/20 hover:bg-neo-lime hover:text-black hover:border-neo-black transition-all"
                    >
                      #{cat}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Gallery Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-neo-pink p-2 border-2 border-neo-black shadow-[4px_4px_0px_0px_#ffffff] -rotate-3">
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black uppercase italic">
                  {t("gallery")}
                </h2>
              </div>

              <PlaceGallery images={allImages} placeName={place.name} />
            </div>
          </div>
          <div className="mt-6">
            <PlaceDetailMap place={place} />
          </div>
        </div>
      </section>
    </main>
  );
}
