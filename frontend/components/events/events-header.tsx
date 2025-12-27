import { formatEventTitle } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

interface EventsHeaderProps {
  category?: string;
  month?: string;
  totalEvents: number;
  children?: React.ReactNode;
  overrideTitle?: string;
  overrideLabel?: string;
  isDark?: boolean;
}

export function EventsHeader({
  category,
  month,
  totalEvents,
  children,
  overrideTitle,
  overrideLabel = "EVENTS",
  isDark = false,
}: EventsHeaderProps) {
  const title = overrideTitle || formatEventTitle(category, month);

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4",
        isDark ? "text-white" : "text-neo-black"
      )}
    >
      <div>
        <div className="inline-block bg-neo-pink text-white px-3 py-1 text-xs font-bold border-2 border-neo-black mb-2 rotate-[-1deg] uppercase">
          {overrideLabel}
        </div>
        <h2
          className={cn(
            "font-display font-black text-5xl md:text-6xl lg:text-7xl uppercase",
            isDark ? "text-white" : "text-neo-black"
          )}
        >
          {title}
        </h2>
      </div>
      <div className="flex items-center gap-4">
        {children}
        <div className="text-sm font-bold bg-white text-neo-black px-4 py-2 border-4 border-neo-black shadow-neo hidden md:block">
          {totalEvents} events
        </div>
      </div>
    </div>
  );
}
