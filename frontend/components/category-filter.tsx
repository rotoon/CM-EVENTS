"use client";

import { ButtonNeo } from "@/components/ui/button-neo";
import { Coffee, Mic, Palette, ShoppingBag } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const categories = [
  { id: "music", label: "Live Music", icon: Mic, color: "bg-neo-lime" },
  {
    id: "art",
    label: "Art Gallery",
    icon: Palette,
    hoverColor: "hover:bg-neo-pink",
  },
  {
    id: "cafe",
    label: "Cafe Hopping",
    icon: Coffee,
    hoverColor: "hover:bg-neo-purple hover:text-white",
  },
  {
    id: "market",
    label: "Night Market",
    icon: ShoppingBag,
    hoverColor: "hover:bg-neo-black hover:text-white",
  },
];

interface CategoryFilterProps {
  activeCategory?: string;
  activeMonth?: string;
  availableMonths?: string[];
}

export function CategoryFilter({
  activeCategory,
  activeMonth = "2025-12",
  availableMonths = [],
}: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleToggle = (key: "category" | "month", value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (searchParams.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : "/");
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
              {[...availableMonths].reverse().map((month) => {
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
                    className={`
                      px-5 py-2.5 font-mono font-bold text-sm 
                      border-4 border-neo-black 
                      transition-all duration-150 cursor-pointer
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
          className="pt-6 border-t-4 border-neo-black"
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
          <div className="flex gap-4 justify-center flex-wrap">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;

              return (
                <ButtonNeo
                  key={cat.id}
                  variant={isActive ? "primary" : "secondary"}
                  onClick={() => handleToggle("category", cat.id)}
                  className={`flex gap-2 ${
                    isActive
                      ? cat.color || "bg-neo-lime"
                      : `bg-white ${cat.hoverColor || "hover:bg-neo-lime"}`
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </ButtonNeo>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
