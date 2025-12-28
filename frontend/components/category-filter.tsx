"use client";

import { ButtonNeo } from "@/components/ui/button-neo";
import { useCategories, useMonths } from "@/hooks/use-events";
import {
  CATEGORY_STYLES,
  DEFAULT_CATEGORY_STYLE,
  ICON_MAP,
  MONTH_NAMES,
} from "@/lib/constants";
import { Tag } from "lucide-react";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface CategoryFilterProps {
  activeCategory?: string;
  activeMonth?: string;
}

export function CategoryFilterSkeleton() {
  return (
    <div className="border-y-4 border-neo-black bg-white py-6 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="w-8 h-1 bg-neo-black" aria-hidden="true" />
          <span className="font-display font-black text-sm uppercase tracking-wider">
            Select Month
          </span>
          <div className="w-8 h-1 bg-neo-black" aria-hidden="true" />
        </div>
        <div className="flex justify-center gap-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-32 h-10 bg-gray-200 animate-pulse border-4 border-neo-black shadow-neo"
            />
          ))}
        </div>
        <div className="border-t-4 border-neo-black pt-6">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-8 h-1 bg-neo-black" aria-hidden="true" />
            <span className="font-display font-black text-sm uppercase tracking-wider">
              Filter by Category
            </span>
            <div className="w-8 h-1 bg-neo-black" aria-hidden="true" />
          </div>
          <div className="flex justify-center gap-4 flex-wrap">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-32 h-11 bg-gray-200 animate-pulse border-4 border-neo-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryFilterContent({
  activeMonth: activeMonthProp,
}: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: categories = [], isLoading: isCategoriesLoading } =
    useCategories();
  const { data: availableMonths = [], isLoading: isMonthsLoading } =
    useMonths();

  const isLoading = isCategoriesLoading || isMonthsLoading;

  // Derive active state directly from URL, fallback to prop for initial load
  const activeCategory = searchParams.get("category");
  const activeMonth = searchParams.get("month") || activeMonthProp;

  if (isLoading) {
    return <CategoryFilterSkeleton />;
  }

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

                const displayMonth = `${
                  MONTH_NAMES[parseInt(monthNum) - 1]
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
                      animate-fadeIn
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
          className="pt-6 border-t-4 border-neo-black animate-fadeIn"
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

          {categories.length > 0 && (
            <div className="flex gap-4 justify-center flex-wrap">
              {categories.map((cat, index) => {
                const Icon = ICON_MAP[cat.id] || Tag;
                const isActive = activeCategory === cat.id;
                const style = CATEGORY_STYLES[cat.id] || DEFAULT_CATEGORY_STYLE;

                return (
                  <div
                    key={cat.id}
                    className="animate-fadeIn"
                    style={{
                      animationDelay: `${
                        (index + availableMonths.length) * 50
                      }ms`,
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
    <Suspense fallback={<CategoryFilterSkeleton />}>
      <CategoryFilterContent {...props} />
    </Suspense>
  );
}
