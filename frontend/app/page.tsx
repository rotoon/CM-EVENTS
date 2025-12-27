"use client";

import { CategoryFilter } from "@/components/category-filter";
import { EventsGrid } from "@/components/events-grid";
import { FooterNeo } from "@/components/footer-neo";
import { HeroSection } from "@/components/hero-section";
import { NavbarNeo } from "@/components/navbar-neo";
import { TopMarquee } from "@/components/top-marquee";
import { useEventsPaginated, useMonths, type Event } from "@/hooks/use-events";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";

// ============================================================================
// Loading Fallback
// ============================================================================

function EventsLoading() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
        <div className="space-y-4">
          <div className="h-6 w-24 bg-gray-200 animate-pulse border-2 border-neo-black shadow-neo" />
          <div className="h-16 w-64 bg-gray-200 animate-pulse border-4 border-neo-black" />
        </div>
        <div className="h-10 w-32 bg-gray-200 animate-pulse border-4 border-neo-black shadow-neo" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col h-[500px] bg-white border-4 border-neo-black shadow-neo overflow-hidden"
          >
            {/* Image placeholder */}
            <div className="h-80 w-full bg-gray-200 animate-pulse border-b-4 border-neo-black" />
            {/* Content placeholder */}
            <div className="p-5 space-y-4">
              <div className="h-8 w-full bg-gray-200 animate-pulse" />
              <div className="h-4 w-2/3 bg-gray-200 animate-pulse" />
              <div className="mt-auto pt-4 flex justify-between border-t-2 border-gray-100">
                <div className="h-6 w-16 bg-gray-200 animate-pulse" />
                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
              </div>
            </div>
          </div>
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
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Use backend pagination and filtering
  const { data, isLoading, isFetching } = useEventsPaginated(
    page,
    EVENTS_PER_PAGE,
    month,
    category
  );

  // Track current filter state to ensure we only update for the right params
  const lastParamsRef = useRef<string>("");

  // Handle data synchronization and resets
  useEffect(() => {
    const currentParams = `${month}-${category}`;

    // If params changed, reset everything
    if (lastParamsRef.current !== currentParams) {
      setPage(1);
      setAllEvents([]);
      lastParamsRef.current = currentParams;
      return;
    }

    // Sync data when it arrives and we are on the correct page
    if (data?.data && !isFetching) {
      if (page === 1) {
        setAllEvents(data.data);
      } else {
        setAllEvents((prev) => {
          const existingIds = new Set(prev.map((e) => e.id));
          const newEvents = data.data.filter((e) => !existingIds.has(e.id));
          return [...prev, ...newEvents];
        });
      }
    }
  }, [data, page, month, category, isFetching]);

  // Infinite scroll with Intersection Observer
  const loadMore = useCallback(() => {
    if (data?.pagination?.hasNext && !isFetching) {
      setPage((p) => p + 1);
    }
  }, [data?.pagination?.hasNext, isFetching]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore]);

  const pagination = data?.pagination;

  // Show loading skeleton when initial loading OR when filtering (fetching page 1 with no events yet)
  if ((isLoading || (isFetching && page === 1)) && allEvents.length === 0) {
    return <EventsLoading />;
  }

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

  return (
    <main id="events-list" className="max-w-7xl mx-auto px-4 py-16">
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
            {pagination?.total} events
          </div>
        )}
      </div>

      {/* Events Grid */}
      <EventsGrid events={allEvents} />

      {/* Infinite Scroll Sentinel */}
      {pagination?.hasNext && (
        <div ref={loadMoreRef} className="flex justify-center mt-12 py-8">
          {isFetching && (
            <div className="flex items-center gap-3 bg-neo-lime border-4 border-neo-black px-6 py-3 shadow-neo">
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
              <span className="font-bold">Loading...</span>
            </div>
          )}
        </div>
      )}

      {/* End of results */}
      {pagination && !pagination.hasNext && allEvents.length > 0 && (
        <div className="text-center mt-12">
          <div className="inline-block bg-neo-purple text-white px-6 py-3 font-bold border-4 border-neo-black shadow-neo rotate-1">
            🎉 All Events displayed!
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || undefined;
  const month = searchParams.get("month") || undefined;

  const currentMonth = new Date().toISOString().slice(0, 7);

  // Auto-set current month in URL if not present
  useEffect(() => {
    if (!month) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("month", currentMonth);
      router.replace(`/?${params.toString()}`, { scroll: false });
    }
  }, [month, currentMonth, router, searchParams]);

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
