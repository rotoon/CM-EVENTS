"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface PlaceGalleryProps {
  images: { id: number; image_url: string }[];
  placeName: string;
}

export function PlaceGallery({ images, placeName }: PlaceGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const t = useTranslations("places.placeDetail");

  // Navigation handlers
  const handlePrev = useCallback(
    (e?: React.MouseEvent | KeyboardEvent) => {
      e?.stopPropagation();
      setSelectedIndex((prev) =>
        prev !== null ? (prev === 0 ? images.length - 1 : prev - 1) : null
      );
    },
    [images.length]
  );

  const handleNext = useCallback(
    (e?: React.MouseEvent | KeyboardEvent) => {
      e?.stopPropagation();
      setSelectedIndex((prev) =>
        prev !== null ? (prev === images.length - 1 ? 0 : prev + 1) : null
      );
    },
    [images.length]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    if (selectedIndex !== null) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, handlePrev, handleNext]);

  if (images.length === 0) {
    return (
      <div className="bg-white border-4 border-neo-black p-8 text-center rotate-2 max-w-2xl mx-auto">
        <p className="text-black font-bold text-xl uppercase">
          {t("noVisuals")}
        </p>
        <p className="text-gray-500 font-mono text-sm mt-2">{t("vibeReal")}</p>
      </div>
    );
  }

  return (
    <>
      {/* Lightbox Modal (Portal) */}
      {selectedIndex !== null &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-neo-black/95 backdrop-blur-md p-4 animate-fadeIn"
            onClick={() => setSelectedIndex(null)}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 bg-neo-pink text-white border-2 border-white p-2 hover:rotate-90 transition-transform cursor-pointer shadow-neo z-[10000]"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(null);
              }}
            >
              <X className="w-8 h-8" />
            </button>

            {/* Prev Button */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white text-black border-2 border-neo-black p-3 hover:scale-110 transition-transform cursor-pointer shadow-[4px_4px_0px_0px_#ccff00] z-[10000] hidden md:block"
              onClick={handlePrev}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            {/* Next Button */}
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-black border-2 border-neo-black p-3 hover:scale-110 transition-transform cursor-pointer shadow-[4px_4px_0px_0px_#ccff00] z-[10000] hidden md:block"
              onClick={handleNext}
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <div
              className="relative w-full max-w-5xl h-full max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[selectedIndex].image_url}
                alt={`${placeName} - ${selectedIndex + 1}`}
                fill
                className="object-contain"
                quality={100}
                priority
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
              {/* Mobile Tap Areas for Navigation */}
              <div
                className="absolute left-0 top-0 w-1/4 h-full z-10 md:hidden"
                onClick={handlePrev}
              />
              <div
                className="absolute right-0 top-0 w-1/4 h-full z-10 md:hidden"
                onClick={handleNext}
              />
            </div>

            {/* Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 font-mono text-lg font-bold border-2 border-white">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>,
          document.body
        )}

      {/* Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img, index) => (
          <div
            key={index}
            className={cn(
              index === 0 ? "md:col-span-2 md:row-span-2" : "",
              "relative bg-white p-2 border-4 border-neo-black shadow-[8px_8px_0px_0px_#ccff00] hover:scale-[1.02] transition-transform cursor-zoom-in group",
              index % 2 === 0 ? "rotate-1" : "-rotate-1"
            )}
            onClick={() => setSelectedIndex(index)}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 border-2 border-neo-black">
              <Image
                src={img.image_url}
                alt={placeName}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
