"use client";

import { ButtonNeo } from "@/components/ui/button-neo";
import { useCategories } from "@/hooks/use-events";
import {
  BookOpen,
  Coffee,
  Mic,
  Palette,
  ShoppingBag,
  Sparkles,
  Tag,
  Utensils,
} from "lucide-react";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

// Icon mapping default
const ICON_MAP: Record<string, any> = {
  festival: Sparkles,
  music: Mic,
  art: Palette,
  cafe: Coffee,
  market: ShoppingBag,
  workshop: BookOpen,
  food: Utensils,
};

const CATEGORY_STYLES: Record<string, { active: string; hover: string }> = {
  festival: {
    active:
      "bg-neo-black text-white shadow-none translate-x-1 translate-y-1 hover:bg-neo-black hover:text-white",
    hover: "hover:bg-neo-black hover:text-white",
  },
  music: {
    active:
      "bg-neo-lime text-black shadow-none translate-x-1 translate-y-1 hover:bg-neo-lime hover:text-black",
    hover: "hover:bg-neo-lime",
  },
  art: {
    active:
      "bg-neo-pink text-black shadow-none translate-x-1 translate-y-1 hover:bg-neo-pink hover:text-black",
    hover: "hover:bg-neo-pink hover:text-black",
  },
  cafe: {
    active:
      "bg-neo-purple text-white shadow-none translate-x-1 translate-y-1 hover:bg-neo-purple hover:text-white",
    hover: "hover:bg-neo-purple hover:text-white ",
  },
  market: {
    active:
      "bg-neo-black text-white shadow-none translate-x-1 translate-y-1 hover:bg-neo-black hover:text-white",
    hover: "hover:bg-neo-black hover:text-white",
  },
  workshop: {
    active:
      "bg-neo-lime text-black shadow-none translate-x-1 translate-y-1 hover:bg-neo-lime hover:text-black",
    hover: "hover:bg-neo-lime",
  },
  food: {
    active:
      "bg-neo-pink text-black shadow-none translate-x-1 translate-y-1 hover:bg-neo-pink hover:text-black",
    hover: "hover:bg-neo-pink ",
  },
};

const DEFAULT_STYLE = {
  active:
    "bg-neo-lime text-black shadow-none translate-x-1 translate-y-1 hover:bg-neo-lime hover:text-black",
  hover: "hover:bg-neo-lime",
};

interface CategoryFilterProps {
  activeCategory?: string;
  activeMonth?: string;
  availableMonths?: string[];
}

function CategoryFilterContent({
  activeMonth: activeMonthProp,
  availableMonths = [],
}: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: categories = [], isLoading } = useCategories();

  // Derive active state directly from URL, fallback to prop for initial load
  const activeCategory = searchParams.get("category");
  const activeMonth = searchParams.get("month") || activeMonthProp;

  const handleToggle = (key: "category" | "month", value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // Strict toggle logic
    const currentValue = params.get(key);
    if (currentValue === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : "/", { scroll: false });

    // Scroll to events list after a short delay to allow Next.js to start navigation/rendering
    setTimeout(() => {
      const element = document.getElementById("events-list");
      if (element) {
        const offset = 100; // Small offset for a better view
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  return (
    <div
      className="border-y-4 border-neo-black bg-white py-6 overflow-hidden"
      role="navigation"
      aria-label="Event filters"
    >
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {/* Months - Primary Filter (Neo-brutalism Style) */}
        {availableMonths.length > 0 && (
          <div role="group" aria-label="Filter by month">
            {/* Header */}
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="w-8 h-1 bg-neo-black" aria-hidden="true" />
              <span className="font-display font-black text-sm uppercase tracking-wider">
                Select Month
              </span>
              <div className="w-8 h-1 bg-neo-black" aria-hidden="true" />
            </div>

            {/* Month pills - sorted oldest to newest */}
            <div className="flex gap-3 justify-center flex-wrap">
              {[...availableMonths].reverse().map((month, index) => {
                const isActive = activeMonth === month;
                // Format: "2025-12" → "Dec 2025"
                const [year, monthNum] = month.split("-");
                const monthNames = [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ];
                const displayMonth = `${
                  monthNames[parseInt(monthNum) - 1]
                } ${year}`;

                return (
                  <button
                    key={month}
                    onClick={() => handleToggle("month", month)}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className={`
                      px-5 py-2.5 font-mono font-bold text-sm 
                      border-4 border-neo-black 
                      transition-all duration-150 cursor-pointer
                      animate-in fade-in slide-in-from-bottom-2
                      ${
                        isActive
                          ? "bg-neo-purple text-white shadow-none translate-x-1 translate-y-1"
                          : "bg-white shadow-neo hover:-translate-y-0.5 hover:shadow-neo-lg hover:bg-neo-lime"
                      }
                    `}
                  >
                    {displayMonth}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Categories - Secondary Filter */}
        <div
          className="pt-6 border-t-4 border-neo-black animate-in fade-in slide-in-from-top-4 duration-500"
          role="group"
          aria-label="Filter by category"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-8 h-1 bg-neo-black" aria-hidden="true" />
            <span className="font-display font-black text-sm uppercase tracking-wider">
              Filter by Category
            </span>
            <div className="w-8 h-1 bg-neo-black" aria-hidden="true" />
          </div>

          {isLoading ? (
            <div className="flex gap-4 justify-center flex-wrap">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="w-32 h-11 bg-gray-200 animate-pulse border-4 border-neo-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                />
              ))}
            </div>
          ) : (
            <div className="flex gap-4 justify-center flex-wrap">
              {categories.map((cat, index) => {
                const Icon = ICON_MAP[cat.id] || Tag;
                const isActive = activeCategory === cat.id;
                const style = CATEGORY_STYLES[cat.id] || DEFAULT_STYLE;

                return (
                  <div
                    key={cat.id}
                    className="animate-in fade-in zoom-in-95"
                    style={{
                      animationDelay: `${
                        (index + availableMonths.length) * 50
                      }ms`,
                      animationFillMode: "backwards",
                    }}
                  >
                    <ButtonNeo
                      variant={isActive ? "primary" : "secondary"}
                      onClick={() => handleToggle("category", cat.id)}
                      className={`flex gap-2 transition-all duration-200 group ${
                        isActive
                          ? style.active
                          : `bg-white ${style.hover} hover:rotate-2`
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isActive
                            ? "scale-110 rotate-12"
                            : "group-hover:rotate-12"
                        }`}
                      />
                      {cat.label}
                    </ButtonNeo>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CategoryFilter(props: CategoryFilterProps) {
  return (
    <Suspense
      fallback={
        <div className="py-6 text-center animate-pulse">Loading filters...</div>
      }
    >
      <CategoryFilterContent {...props} />
    </Suspense>
  );
}
