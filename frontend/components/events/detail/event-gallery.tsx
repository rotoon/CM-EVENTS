import { EventWithImages } from "@/lib/types";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface EventGalleryProps {
  event: EventWithImages;
}

export function EventGallery({ event }: EventGalleryProps) {
  const images = event.images || [];
  const coverImage =
    event.cover_image_url ||
    "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=2670&auto=format&fit=crop";

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="space-y-4">
      {/* Lightbox Modal (Portal) */}
      {selectedImage &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-neo-black/95 backdrop-blur-md p-4 animate-fadeIn"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 bg-neo-pink text-white border-2 border-white p-2 hover:rotate-90 transition-transform cursor-pointer shadow-neo z-[10000]"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <X className="w-8 h-8" />
            </button>
            <div
              className="relative w-full max-w-5xl h-full max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage}
                alt="Expanded view"
                fill
                className="object-contain"
                quality={100}
                priority
              />
            </div>
          </div>,
          document.body
        )}

      {/* Main Hero Image */}
      <div
        className="relative aspect-[4/5] md:aspect-square lg:aspect-[4/3] border-4 border-neo-black bg-gray-100 shadow-neo-lg overflow-hidden group cursor-zoom-in"
        onClick={() => setSelectedImage(coverImage)}
      >
        <Image
          src={coverImage}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute inset-0 ring-4 ring-inset ring-black/10 pointer-events-none" />
      </div>

      {/* Grid Images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className="relative aspect-square border-4 border-neo-black bg-white shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-zoom-in overflow-hidden group"
              onClick={() => setSelectedImage(img.image_url)}
            >
              <Image
                src={img.image_url}
                alt={`${event.title} - view ${idx + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
