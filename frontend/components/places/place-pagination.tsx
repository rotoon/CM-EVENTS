"use client";

/**
 * PlacePagination - Page navigation controls with variant theming
 */

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getVariantTheme, type PlaceVariant } from "./theme";

interface PlacePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  variant?: PlaceVariant;
}

export function PlacePagination({
  currentPage,
  totalPages,
  onPageChange,
  variant = "default",
}: PlacePaginationProps) {
  if (totalPages <= 1) return null;

  const theme = getVariantTheme(variant);

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

  return (
    <div className="flex justify-center items-center gap-2 pt-12 pb-20">
      {/* Previous Button */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "px-4 py-3 font-bold uppercase transition-all duration-200",
          "hover:translate-x-[2px] hover:translate-y-[2px]",
          theme.paginationButton,
          currentPage === 1 && theme.paginationButtonDisabled
        )}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Page Numbers */}
      <div className="flex gap-2">
        {getPageNumbers().map((page, idx) =>
          page === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-4 py-3 opacity-50 font-mono"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={cn(
                "px-5 py-3 font-bold uppercase transition-all duration-200",
                "hover:translate-x-[2px] hover:translate-y-[2px]",
                currentPage === page
                  ? theme.paginationActive
                  : theme.paginationInactive
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
        className={cn(
          "px-4 py-3 font-bold uppercase transition-all duration-200",
          "hover:translate-x-[2px] hover:translate-y-[2px]",
          theme.paginationButton,
          currentPage === totalPages && theme.paginationButtonDisabled
        )}
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}
