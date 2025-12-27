"use client";

import { EventsGrid } from "@/components/events-grid";
import { EventsHeader } from "@/components/events/events-header";
import { EventsSentinel } from "@/components/events/events-sentinel";
import { EventsSkeleton } from "@/components/events/events-skeleton";
import { EventsMap } from "@/components/events/map-wrapper";
import { ViewToggle } from "@/components/view-toggle";
import { useEventsInfinite } from "@/hooks/use-events";
import { useCallback, useState } from "react";

const EVENTS_PER_PAGE = 24;

interface EventsContentProps {
  category?: string;
  month?: string;
  title?: string; // Optional title override for specialized pages
  overrideLabel?: string; // Optional badge label override
  isDark?: boolean;
  showFilter?: boolean;
}

export function EventsContent({
  category,
  month,
  title,
  overrideLabel,
  isDark,
}: EventsContentProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
  } = useEventsInfinite(EVENTS_PER_PAGE, month, category);

  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

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
    <main id="events-list" className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      {/* Header */}
      <EventsHeader
        category={category}
        month={month}
        totalEvents={totalEvents}
        overrideTitle={title}
        overrideLabel={overrideLabel}
        isDark={isDark}
      >
        <ViewToggle viewMode={viewMode} onChange={setViewMode} />
      </EventsHeader>

      {/* Content */}
      <div className="min-h-[600px]">
        {viewMode === "grid" ? (
          <>
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
          </>
        ) : (
          <EventsMap events={allEvents} />
        )}
      </div>
    </main>
  );
}
