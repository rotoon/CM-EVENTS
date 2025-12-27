"use client";

import { CategoryFilter } from "@/components/category-filter";
import { EventsGrid } from "@/components/events-grid";
import { EventsHeader } from "@/components/events/events-header";
import { EventsSentinel } from "@/components/events/events-sentinel";
import { EventsSkeleton } from "@/components/events/events-skeleton";
import { FooterNeo } from "@/components/footer-neo";
import { HeroSection } from "@/components/hero-section";
import { NavbarNeo } from "@/components/navbar-neo";
import { TopMarquee } from "@/components/top-marquee";
import { useEventsInfinite } from "@/hooks/use-events";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect } from "react";

const EVENTS_PER_PAGE = 12;
// Events Content
// ============================================================================

function EventsContent({
  category,
  month,
}: {
  category?: string;
  month?: string;
}) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
  } = useEventsInfinite(EVENTS_PER_PAGE, month, category);

  const allEvents = data?.pages.flatMap((page) => page.data) ?? [];

  // Infinite scroll callback
  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Calculate total from the first page (backend sends total on every page)
  const totalEvents = data?.pages[0]?.pagination.total ?? 0;

  // Show loading skeleton when initial loading and no data
  if (isLoading) {
    return <EventsSkeleton />;
  }

  return (
    <main id="events-list" className="max-w-7xl mx-auto px-4 py-16">
      {/* Header */}
      <EventsHeader
        category={category}
        month={month}
        totalEvents={totalEvents}
      />

      {/* Events Grid */}
      <EventsGrid events={allEvents} />

      {/* Infinite Scroll Sentinel */}
      <EventsSentinel
        hasNextPage={hasNextPage}
        isFetching={isFetching || isFetchingNextPage}
        onLoadMore={loadMore}
      />

      {/* End of results */}
      {!hasNextPage && allEvents.length > 0 && (
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
  return (
    <CategoryFilter activeCategory={activeCategory} activeMonth={activeMonth} />
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
    <Suspense fallback={<EventsSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}
