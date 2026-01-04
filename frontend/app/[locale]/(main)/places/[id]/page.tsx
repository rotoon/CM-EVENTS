import { fetchPlaceById } from "@/lib/api-places";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Heart,
  Instagram,
  MapPin,
  MessageCircle,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

// Place Type → Color scheme
const TYPE_STYLES: Record<
  string,
  { bg: string; text: string; accent: string }
> = {
  Cafe: {
    bg: "from-amber-50 to-orange-50",
    text: "text-amber-800",
    accent: "bg-amber-500",
  },
  Food: {
    bg: "from-orange-50 to-red-50",
    text: "text-orange-800",
    accent: "bg-orange-500",
  },
  Restaurant: {
    bg: "from-red-50 to-rose-50",
    text: "text-red-800",
    accent: "bg-red-500",
  },
  Travel: {
    bg: "from-emerald-50 to-teal-50",
    text: "text-emerald-800",
    accent: "bg-emerald-500",
  },
  "Bar/Nightlife": {
    bg: "from-purple-50 to-indigo-50",
    text: "text-purple-800",
    accent: "bg-purple-500",
  },
};

interface PageProps {
  params: Promise<{ id: string }>;
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
  const { id } = await params;
  const place = await fetchPlaceById(parseInt(id));

  if (!place) {
    notFound();
  }

  const typeStyle = TYPE_STYLES[place.place_type] || {
    bg: "from-stone-50 to-slate-50",
    text: "text-stone-800",
    accent: "bg-stone-500",
  };

  // Format date
  const postDate = place.post_date
    ? new Date(place.post_date).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <main className="min-h-screen bg-white">
      {/* Back Navigation */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-stone-100">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/places"
            className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-orange-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            กลับไปหน้ารายการ
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className={cn("bg-gradient-to-br", typeStyle.bg)}>
        <div className="container mx-auto px-4 py-12 md:py-20">
          {/* Type Badge */}
          <span
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6",
              "bg-white/80 backdrop-blur-sm border border-stone-200/50",
              typeStyle.text
            )}
          >
            {place.place_type}
          </span>

          {/* Place Name */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-stone-900 mb-6 tracking-tight leading-tight">
            {place.name}
          </h1>

          {/* Stats */}
          <div className="flex flex-wrap gap-4">
            {place.likes !== null && place.likes > 0 && (
              <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl shadow-sm">
                <Heart className="w-4 h-4 text-pink-500" />
                <span className="text-sm font-medium text-stone-700">
                  {place.likes >= 1000
                    ? `${(place.likes / 1000).toFixed(1)}k`
                    : place.likes}{" "}
                  likes
                </span>
              </div>
            )}
            {place.comments !== null && place.comments > 0 && (
              <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl shadow-sm">
                <MessageCircle className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-stone-700">
                  {place.comments} comments
                </span>
              </div>
            )}
            {postDate && (
              <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl shadow-sm">
                <Calendar className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-stone-700">
                  {postDate}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {place.description && (
              <div>
                <h2 className="text-lg font-semibold text-stone-900 mb-4">
                  รายละเอียด
                </h2>
                <div className="prose prose-stone prose-sm max-w-none">
                  <p className="text-stone-600 leading-relaxed whitespace-pre-wrap">
                    {place.description}
                  </p>
                </div>
              </div>
            )}

            {/* Categories */}
            {place.category_names && place.category_names.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-stone-900 mb-4">
                  หมวดหมู่
                </h2>
                <div className="flex flex-wrap gap-2">
                  {place.category_names.map((cat) => (
                    <Link
                      key={cat}
                      href={`/places?category=${cat}`}
                      className="px-4 py-2 rounded-full text-sm font-medium bg-stone-100 text-stone-600 hover:bg-orange-100 hover:text-orange-600 transition-colors"
                    >
                      #{cat}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="bg-stone-50 rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-stone-900">ลิงก์</h3>

              {/* Instagram */}
              {place.instagram_url && (
                <a
                  href={place.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center gap-3 w-full px-5 py-4 rounded-xl",
                    "bg-gradient-to-r from-purple-500 to-pink-500",
                    "text-white font-medium text-sm",
                    "hover:opacity-90 transition-opacity"
                  )}
                >
                  <Instagram className="w-5 h-5" />
                  ดูโพสต์ต้นฉบับบน Instagram
                  <ExternalLink className="w-4 h-4 ml-auto" />
                </a>
              )}

              {/* Google Maps */}
              {place.google_maps_url ? (
                <a
                  href={place.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center gap-3 w-full px-5 py-4 rounded-xl",
                    "bg-white border border-stone-200",
                    "text-stone-700 font-medium text-sm",
                    "hover:bg-stone-50 transition-colors"
                  )}
                >
                  <MapPin className="w-5 h-5 text-green-600" />
                  เปิดใน Google Maps
                  <ExternalLink className="w-4 h-4 ml-auto text-stone-400" />
                </a>
              ) : (
                <a
                  href={`https://www.google.com/maps/search/${encodeURIComponent(
                    place.name + " เชียงใหม่"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center gap-3 w-full px-5 py-4 rounded-xl",
                    "bg-white border border-stone-200",
                    "text-stone-700 font-medium text-sm",
                    "hover:bg-stone-50 transition-colors"
                  )}
                >
                  <MapPin className="w-5 h-5 text-stone-400" />
                  ค้นหาใน Google Maps
                  <ExternalLink className="w-4 h-4 ml-auto text-stone-400" />
                </a>
              )}
            </div>

            {/* Credit */}
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
              <p className="text-sm text-amber-800">
                📸 ข้อมูลนี้คัดสรรโดย{" "}
                <a
                  href="https://www.instagram.com/newbie.cnx/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline hover:text-orange-600"
                >
                  @newbie.cnx
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
