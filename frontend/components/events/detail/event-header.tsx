import { Event } from "@/lib/types";
import { Calendar, MapPin } from "lucide-react";

interface EventHeaderProps {
  event: Event;
}

export function EventHeader({ event }: EventHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        {/* Status Badge */}
        {event.is_ended ? (
          <div className="bg-neo-pink text-white border-2 border-neo-black px-4 py-1 font-black text-sm uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[-1deg]">
            Event Ended
          </div>
        ) : (
          <div className="bg-neo-lime text-black border-2 border-neo-black px-4 py-1 font-black text-sm uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[-1deg] animate-pulse">
            Upcoming Event
          </div>
        )}
        <div className="font-mono text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 border border-neo-black">
          ID: #{event.id}
        </div>
      </div>

      <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-5xl leading-none md:leading-tight uppercase tracking-tighter break-words text-neo-black">
        {event.title}
      </h1>

      <div className="flex flex-col gap-3 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-neo-black text-white shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="border-b-2 border-neo-black grow pb-1 text-lg font-bold">
            {event.date_text || "Date To Be Announced"}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-white border-2 border-neo-black shrink-0 shadow-sm">
            <MapPin className="w-5 h-5 text-neo-black" />
          </div>
          <div className="border-b-2 border-neo-black grow pb-1 text-base md:text-lg font-bold truncate">
            {event.location || "Chiang Mai, Thailand"}
          </div>
        </div>
      </div>
    </div>
  );
}
