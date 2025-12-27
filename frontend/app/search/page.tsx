"use client";

import { EventsGrid } from "@/components/events-grid";
import { useSearchEvents } from "@/hooks/use-events";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SearchLoading() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-16">
      <div className="h-12 w-64 bg-gray-200 animate-pulse mb-12"></div>
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

function SearchResults({ query }: { query: string }) {
  const { data: events = [], isLoading, error } = useSearchEvents(query);

  if (isLoading) return <SearchLoading />;
  if (error)
    return (
      <div className="text-center py-16 text-red-500">
        Internal Server Error
      </div>
    );

  if (query.length < 2) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-xl font-bold">Please enter at least 2 characters</p>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-16">
      <EventsGrid events={events} />
    </main>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <a
          href="/"
          className="inline-block bg-white border-4 border-neo-black px-4 py-2 font-bold shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all mb-8"
        >
          ← BACK TO FEED
        </a>
      </div>

      <SearchResults query={query} />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchContent />
    </Suspense>
  );
}
