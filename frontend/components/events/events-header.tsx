import { formatEventTitle } from "@/lib/date-utils";

interface EventsHeaderProps {
  category?: string;
  month?: string;
  totalEvents: number;
}

export function EventsHeader({
  category,
  month,
  totalEvents,
}: EventsHeaderProps) {
  const title = formatEventTitle(category, month);

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
      <div>
        <div className="inline-block bg-neo-pink text-white px-3 py-1 text-xs font-bold border-2 border-neo-black mb-2 rotate-[-1deg]">
          EVENTS
        </div>
        <h2 className="font-display font-black text-5xl md:text-6xl lg:text-7xl uppercase">
          {title}
        </h2>
      </div>
      {totalEvents > 0 && (
        <div className="text-sm font-bold bg-white px-4 py-2 border-4 border-neo-black shadow-neo">
          {totalEvents} events
        </div>
      )}
    </div>
  );
}
