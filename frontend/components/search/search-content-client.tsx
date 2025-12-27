"use client";

import { EventsGrid } from "@/components/events-grid";
import { useEventsPaginated, useSearchEvents } from "@/hooks/use-events";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

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
  const { data: recentData, isLoading: loadingRecent } = useEventsPaginated(
    1,
    24
  );

  const recentEvents = (recentData as any)?.data || [];

  if (isLoading || loadingRecent) return <SearchLoading />;

  if (error)
    return (
      <div className="text-center py-16 text-red-500 font-bold bg-neo-pink/10 border-4 border-neo-black">
        ⚠️ ERROR FETCHING THE RESULTS.
      </div>
    );

  if (!query || query.length < 2) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-12">
          <div className="inline-block bg-neo-lime px-4 py-1 font-bold border-2 border-neo-black shadow-neo mb-6 rotate-1 animate-pulse-fast">
            NEW DROPS IN CNX
          </div>
          <h2 className="font-display font-black text-6xl md:text-8xl lg:text-9xl uppercase mb-4 leading-none tracking-tighter italic">
            JUST <br />
            <span className="text-neo-pink bg-neo-black px-4 inline-block -rotate-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              ADDED.
            </span>
          </h2>
          <p className="font-bold text-xl md:text-2xl max-w-xl border-l-8 border-neo-purple pl-6 py-2">
            The freshest events recently scouted and verified by the HYPE team.
          </p>
        </div>

        <EventsGrid events={recentEvents} />
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-12">
        <div className="inline-block bg-neo-pink text-white px-4 py-1 font-bold border-2 border-neo-black shadow-neo mb-4 -rotate-1">
          SEARCH RESULTS
        </div>
        <h2 className="font-display font-black text-5xl md:text-6xl uppercase">
          FINDING: "{query}"
        </h2>
      </div>
      <EventsGrid events={events} />
    </main>
  );
}

export function SearchContentClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  return (
    <div className="min-h-screen bg-neo-white">
      <div className="bg-neo-black text-white py-3 border-b-4 border-neo-black overflow-hidden sticky top-20 z-30">
        <div className="flex animate-marquee whitespace-nowrap font-black uppercase tracking-widest text-sm">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="mx-8 flex items-center gap-4">
              <span className="text-neo-pink">●</span> LATEST DROPS
              <span className="text-neo-lime">●</span> SCOUTED TODAY
              <span className="text-neo-purple">●</span> FRESH VIBES
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-8">
        {query && (
          <Link
            href="/search"
            className="inline-block bg-white border-4 border-neo-black px-6 py-2 font-black uppercase text-sm shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all mb-4"
          >
            ← CLEAR SEARCH
          </Link>
        )}
      </div>

      <SearchResults query={query} />
    </div>
  );
}
