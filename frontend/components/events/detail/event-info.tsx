import { Event } from "@/lib/types";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

const EventMap = dynamic(() => import("@/components/events/detail/event-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] bg-gray-100 border-4 border-neo-black animate-pulse flex items-center justify-center font-mono font-bold text-gray-400">
      LOADING MAP...
    </div>
  ),
});

interface EventInfoProps {
  event: Event;
}

export function EventInfo({ event }: EventInfoProps) {
  const description =
    event.description_markdown ||
    event.description ||
    "No description available. Please check the official source for more details.";

  return (
    <div className="bg-white border-4 border-neo-black p-6 md:p-8 shadow-neo relative mt-8">
      {/* Decorative localized sticker */}
      <div className="absolute -top-4 -right-4 w-16 h-16 bg-neo-purple rounded-full border-2 border-neo-black flex items-center justify-center text-white font-black text-[10px] leading-tight text-center rotate-12 shadow-sm z-10">
        LOCAL
        <br />
        VIBE
      </div>

      <h3 className="font-display font-black text-xl uppercase mb-4 inline-block bg-neo-black text-white px-2 py-1 transform -rotate-1">
        • ABOUT THIS EVENT
      </h3>

      <div className="prose prose-neo max-w-none text-base md:text-lg font-medium leading-relaxed font-sans text-gray-800">
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
          {description}
        </ReactMarkdown>
      </div>

      {event.latitude && event.longitude && (
        <div className="mt-8 pt-6 border-t-4 border-neo-black">
          <h3 className="font-display font-black text-xl uppercase mb-4 inline-block bg-white border-2 border-neo-black text-black px-2 py-1 shadow-neo transform rotate-1">
            • LOCATION
          </h3>
          <EventMap event={event} />
        </div>
      )}
    </div>
  );
}
