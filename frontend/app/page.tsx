"use client";

import { CategoryFilter } from "@/components/category-filter";
import { EventsGrid } from "@/components/events-grid";
import { FooterNeo } from "@/components/footer-neo";
import { HeroSection } from "@/components/hero-section";
import { NavbarNeo } from "@/components/navbar-neo";
import { TopMarquee } from "@/components/top-marquee";
import { useEventsPaginated, useMonths, type Event } from "@/hooks/use-events";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

// ============================================================================
// Loading Fallback
// ============================================================================

function EventsLoading() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex justify-between items-end mb-12">
        <div className="h-12 w-48 bg-gray-200 animate-pulse"></div>
        <div className="h-8 w-32 bg-gray-200 animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-[400px] bg-gray-200 animate-pulse border-4 border-neo-black"
          ></div>
        ))}
      </div>
    </main>
  );
}

// ============================================================================
// Events Content with Pagination
// ============================================================================

const EVENTS_PER_PAGE = 12;

function EventsContent({
  category,
  month,
}: {
  category?: string;
  month?: string;
}) {
  const [page, setPage] = useState(1);
  const [allEvents, setAllEvents] = useState<Event[]>([]);

  const { data, isLoading, isFetching } = useEventsPaginated(
    page,
    EVENTS_PER_PAGE,
    month
  );

  // Update allEvents when data changes
  useEffect(() => {
    if (data?.data) {
      if (page === 1) {
        setAllEvents(data.data);
      } else {
        setAllEvents((prev) => {
          // Avoid duplicates
          const existingIds = new Set(prev.map((e) => e.id));
          const newEvents = data.data.filter((e) => !existingIds.has(e.id));
          return [...prev, ...newEvents];
        });
      }
    }
  }, [data, page]);

  // Reset when month changes
  useEffect(() => {
    setPage(1);
    setAllEvents([]);
  }, [month]);

  // Filter by category client-side if provided
  const filteredEvents = category
    ? allEvents.filter(
        (e) =>
          e.title?.toLowerCase().includes(category.toLowerCase()) ||
          e.description?.toLowerCase().includes(category.toLowerCase()) ||
          e.location?.toLowerCase().includes(category.toLowerCase())
      )
    : allEvents;

  const pagination = data?.pagination;

  if (isLoading && page === 1) return <EventsLoading />;

  let title = "What's On";
  if (category || month) {
    const parts = [];
    if (month) {
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
      parts.push(`${monthNames[parseInt(monthNum) - 1]} ${year}`);
    }
    if (category) parts.push(category.toUpperCase());
    title = parts.join(" • ");
  }

  const handleLoadMore = () => {
    if (pagination?.hasNext && !isFetching) {
      setPage((p) => p + 1);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
        <div>
          <div className="inline-block bg-neo-pink text-white px-3 py-1 text-xs font-bold border-2 border-neo-black mb-2 rotate-[-1deg]">
            EVENTS
          </div>
          <h2 className="font-display font-black text-5xl md:text-6xl lg:text-7xl uppercase">
            {title}
          </h2>
        </div>
        {pagination && (
          <div className="text-sm font-bold bg-white px-4 py-2 border-4 border-neo-black shadow-neo">
            {filteredEvents.length} / {pagination.total} events
          </div>
        )}
      </div>

      {/* Events Grid */}
      <EventsGrid events={filteredEvents} showLoadMore={false} />

      {/* Load More Button */}
      {pagination?.hasNext && (
        <div className="flex justify-center mt-12">
          <button
            onClick={handleLoadMore}
            disabled={isFetching}
            className={`
              bg-neo-lime border-4 border-neo-black px-8 py-4 font-black text-xl
              shadow-neo transition-all uppercase
              ${
                isFetching
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
              }
            `}
          >
            {isFetching ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Loading...
              </span>
            ) : (
              `Load More (${page} / ${pagination.totalPages})`
            )}
          </button>
        </div>
      )}

      {/* End of results */}
      {pagination && !pagination.hasNext && filteredEvents.length > 0 && (
        <div className="text-center mt-12">
          <div className="inline-block bg-neo-purple text-white px-6 py-3 font-bold border-4 border-neo-black shadow-neo rotate-1">
            🎉 คุณดู Events ครบทั้งหมดแล้ว!
          </div>
        </div>
      )}
    </main>
  );
}

// ============================================================================
// Filter Section
// ============================================================================

function FilterSection({
  activeCategory,
  activeMonth,
}: {
  activeCategory?: string;
  activeMonth?: string;
}) {
  const { data: availableMonths = [], isLoading } = useMonths();

  if (isLoading) {
    return (
      <div className="border-y-4 border-neo-black bg-white py-12 animate-pulse"></div>
    );
  }

  return (
    <CategoryFilter
      activeCategory={activeCategory}
      activeMonth={activeMonth}
      availableMonths={availableMonths}
    />
  );
}

// ============================================================================
// Home Content
// ============================================================================

function HomeContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || undefined;
  const month = searchParams.get("month") || undefined;

  const currentMonth = new Date().toISOString().slice(0, 7);
  const effectiveMonth = month ?? currentMonth;

  return (
    <>
      <TopMarquee />
      <NavbarNeo />
      <HeroSection />
      <FilterSection activeCategory={category} activeMonth={effectiveMonth} />
      <EventsContent category={category} month={effectiveMonth} />
      <FooterNeo />
    </>
  );
}

// ============================================================================
// Main Page
// ============================================================================

export default function Home() {
  return (
    <Suspense fallback={<EventsLoading />}>
      <HomeContent />
    </Suspense>
  );
}
