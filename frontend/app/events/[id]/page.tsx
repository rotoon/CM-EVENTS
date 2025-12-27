"use client";

import { FooterNeo } from "@/components/footer-neo";
import { NavbarNeo } from "@/components/navbar-neo";
import { TopMarquee } from "@/components/top-marquee";
import { ButtonNeo } from "@/components/ui/button-neo";
import { useEventById } from "@/hooks/use-events";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  Facebook,
  MapPin,
  Share2,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";

function EventLoading() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <div className="h-10 w-48 bg-gray-200 animate-pulse mb-8"></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-[4/5] bg-gray-200 animate-pulse border-8 border-neo-black"></div>
        <div className="space-y-8">
          <div className="h-64 bg-gray-200 animate-pulse border-8 border-neo-black"></div>
          <div className="h-48 bg-gray-200 animate-pulse border-8 border-neo-black"></div>
        </div>
      </div>
    </main>
  );
}

function EventNotFound() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12 text-center">
      <h1 className="font-display font-black text-6xl mb-4">404</h1>
      <p className="text-xl font-bold mb-8">ไม่พบ Event นี้</p>
      <a
        href="/"
        className="inline-flex items-center gap-2 bg-neo-lime border-4 border-neo-black px-6 py-3 font-bold shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
      >
        <ArrowLeft className="w-5 h-5" /> กลับหน้าหลัก
      </a>
    </main>
  );
}

export default function EventDetailPage() {
  const params = useParams();
  const eventId = parseInt(params.id as string);

  const { data: event, isLoading, error } = useEventById(eventId);

  if (isLoading) {
    return (
      <>
        <TopMarquee />
        <NavbarNeo />
        <EventLoading />
        <FooterNeo />
      </>
    );
  }

  if (error || !event) {
    return (
      <>
        <TopMarquee />
        <NavbarNeo />
        <EventNotFound />
        <FooterNeo />
      </>
    );
  }

  return (
    <>
      <TopMarquee />
      <NavbarNeo />

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-white border-4 border-neo-black px-4 py-2 font-bold shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            <ArrowLeft className="w-5 h-5" /> BACK TO EVENTS
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Images */}
          <div className="space-y-6">
            <div className="relative aspect-[4/5] border-8 border-neo-black bg-white shadow-neo-lg overflow-hidden group">
              <Image
                src={
                  event.cover_image_url ||
                  "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=2670&auto=format&fit=crop"
                }
                alt={event.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {event.is_ended === 0 && (
                <div className="absolute top-4 left-4 bg-neo-lime border-4 border-neo-black px-3 py-1 font-black text-sm rotate-[-2deg] shadow-neo">
                  UPCOMING
                </div>
              )}
              {event.is_ended === 1 && (
                <div className="absolute top-4 left-4 bg-gray-400 border-4 border-neo-black px-3 py-1 font-black text-sm rotate-[-2deg] shadow-neo text-white">
                  ENDED
                </div>
              )}
            </div>

            {/* Gallery (if any extra images) */}
            {event.images && event.images.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {event.images.map((img, idx) => (
                  <div
                    key={img.id}
                    className="relative aspect-square border-4 border-neo-black bg-white shadow-neo hover:-translate-y-1 transition-transform cursor-pointer overflow-hidden group"
                  >
                    <Image
                      src={img.image_url}
                      alt={`${event.title} gallery ${idx + 1}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-all"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            <div className="bg-neo-purple text-white border-8 border-neo-black p-8 shadow-neo-lg mb-8 rotate-1">
              <h1 className="font-display font-black text-4xl md:text-5xl leading-none uppercase mb-4">
                {event.title}
              </h1>
              <div className="flex flex-wrap gap-3 mt-6">
                <div className="flex items-center gap-2 bg-neo-black text-white px-3 py-1 font-mono font-bold text-sm border-2 border-white">
                  <Calendar className="w-4 h-4" /> {event.date_text || "TBD"}
                </div>
                {event.time_text && (
                  <div className="flex items-center gap-2 bg-neo-pink text-white px-3 py-1 font-mono font-bold text-sm border-2 border-neo-black">
                    <Clock className="w-4 h-4" /> {event.time_text}
                  </div>
                )}
                <div className="flex items-center gap-2 bg-neo-lime text-black px-3 py-1 font-mono font-bold text-sm border-2 border-neo-black">
                  <MapPin className="w-4 h-4" />{" "}
                  {event.location || "Chiang Mai"}
                </div>
              </div>
            </div>

            <div className="bg-white border-8 border-neo-black p-8 shadow-neo mb-8 relative">
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-neo-pink rounded-full border-4 border-neo-black flex items-center justify-center -rotate-12 font-black text-xs text-center leading-none shadow-neo">
                LOCAL
                <br />
                VIBES
                <br />
                ONLY
              </div>
              <h3 className="font-display font-black text-2xl uppercase mb-4 border-b-4 border-neo-black inline-block">
                Description
              </h3>
              <div className="prose prose-neo max-w-none font-bold text-lg leading-relaxed whitespace-pre-wrap">
                {event.description_markdown ||
                  event.description ||
                  "No description provided for this event. Chiang Mai is waiting for you to discover the details yourself!"}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-auto">
              <a
                href={event.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-neo-lime border-4 border-neo-black p-4 font-black text-xl shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase"
              >
                <ExternalLink className="w-6 h-6" /> VIEW ORIGINAL
              </a>
              {event.facebook_url && (
                <a
                  href={event.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white border-4 border-neo-black p-4 font-black text-xl shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase"
                >
                  <Facebook className="w-6 h-6" /> FACEBOOK
                </a>
              )}
              {event.google_maps_url && (
                <a
                  href={event.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 bg-green-500 text-white border-4 border-neo-black p-4 font-black text-xl shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase"
                >
                  <MapPin className="w-6 h-6" /> GOOGLE MAPS
                </a>
              )}
              <ButtonNeo
                variant="secondary"
                className="w-full flex items-center justify-center gap-3 bg-white border-4 border-neo-black p-4 font-black text-xl shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase"
              >
                <Share2 className="w-6 h-6" /> SHARE EVENT
              </ButtonNeo>
            </div>
          </div>
        </div>
      </main>

      <FooterNeo />
    </>
  );
}
