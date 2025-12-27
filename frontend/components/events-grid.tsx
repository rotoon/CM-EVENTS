"use client";

import { Event } from "@/hooks/use-events";
import { EventCardNeo } from "./event-card-neo";

// Neo-Pop Colors Cycle
const NEO_COLORS = [
  "bg-neo-pink",
  "bg-neo-lime",
  "bg-neo-purple text-white",
  "bg-neo-black text-white",
  "bg-white border-2 border-black",
];

const TAGS = ["ART", "MUSIC", "FOOD", "VIBE", "PARTY"];

import { CalendarDays, RefreshCw, SearchX } from "lucide-react";

interface EventsGridProps {
  events: Event[];
}

export function EventsGrid({ events }: EventsGridProps) {
  // Transform DB events to display format
  const displayEvents = events.map((e, i) => ({
    id: e.id,
    title: e.title,
    location: e.location || "Chiang Mai",
    date: e.date_text || "TBD",
    price: "FREE",
    image:
      e.cover_image_url ||
      "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=2670&auto=format&fit=crop",
    tag: TAGS[i % TAGS.length],
    color: NEO_COLORS[i % NEO_COLORS.length],
    sourceUrl: e.source_url,
  }));

  return (
    <>
      {displayEvents.length === 0 ? (
        <div className="text-center flex flex-col items-center justify-center py-20 px-4 bg-white border-4 border-neo-black shadow-neo-lg rotate-[-0.5deg]">
          <div className="w-20 h-20 bg-neo-pink border-4 border-neo-black shadow-neo flex items-center justify-center mb-6 rotate-3">
            <SearchX className="w-10 h-10 text-white" />
          </div>
          <h3 className="font-display font-black text-4xl uppercase mb-4">
            No Events Found!
          </h3>
          <p className="font-mono text-lg max-w-md mx-auto mb-8">
            We couldn't find any events matching your selection in this month.
            Try exploring other months or categories!
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-neo-lime border-4 border-neo-black px-8 py-3 font-bold shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2"
            >
              <CalendarDays className="w-5 h-5" />
              View Current Month
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-white border-4 border-neo-black px-8 py-3 font-bold shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh
            </button>
          </div>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          role="list"
          aria-label="Events List"
        >
          {displayEvents.map((event, index) => (
            <div
              key={event.id}
              role="listitem"
              className="animate-fadeIn"
              style={{ animationDelay: `${(index % 12) * 50}ms` }}
            >
              <EventCardNeo {...event} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
