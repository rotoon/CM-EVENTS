"use client";

/**
 * PlacePagination - Page navigation controls
 */

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PlacePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PlacePagination({
  currentPage,
  totalPages,
  onPageChange,
}: PlacePaginationProps) {
  if (totalPages <= 1) return null;

  // Generate page numbers to show
  const getPageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];
    const showPages = 5;

    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pages;
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const buttonBase = cn(
    "px-4 py-3 font-bold uppercase border-4 border-white transition-all duration-200",
    "bg-neo-black text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]",
    "hover:bg-white hover:text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
  );

  const disabledStyles =
    "opacity-50 cursor-not-allowed hover:bg-neo-black hover:text-white hover:translate-x-0 hover:translate-y-0 hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]";

  return (
    <div className="flex justify-center items-center gap-2 pt-12 pb-20">
      {/* Previous Button */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(buttonBase, currentPage === 1 && disabledStyles)}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Page Numbers */}
      <div className="flex gap-2">
        {getPageNumbers().map((page, idx) =>
          page === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-4 py-3 text-white/50 font-mono"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={cn(
                "px-5 py-3 font-bold uppercase border-4 transition-all duration-200",
                "shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]",
                "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]",
                currentPage === page
                  ? "bg-neo-lime text-black border-white"
                  : "bg-neo-black text-white border-white hover:bg-white hover:text-black"
              )}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(buttonBase, currentPage === totalPages && disabledStyles)}
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}
