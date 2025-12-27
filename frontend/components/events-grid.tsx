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
        <div className="text-center flex flex-col items-center justify-center py-16">
          <p className="font-display font-black text-3xl text-gray-800">
            No Events Found
          </p>
          <p className="bg-neo-black text-white font-mono mt-2 mb-6 px-4 py-2 rounded ">
            Try searching or selecting another category
          </p>
          <a
            href="/"
            className="inline-block bg-neo-lime border-4 border-neo-black px-6 py-3 font-bold shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            aria-label="See all Events"
          >
            See all Events
          </a>
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
