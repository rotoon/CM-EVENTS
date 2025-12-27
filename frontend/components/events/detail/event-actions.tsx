import { ButtonNeo } from "@/components/ui/button-neo";
import { Event } from "@/lib/types";
import { ExternalLink, Share2 } from "lucide-react";

interface EventActionsProps {
  event: Event;
}

export function EventActions({ event }: EventActionsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 mt-8 sticky bottom-4 z-20 md:static">
      <div className="p-4 bg-white/80 backdrop-blur-md border-t-4 border-neo-black md:bg-transparent md:border-none md:p-0 md:backdrop-blur-none">
        <div className="grid grid-cols-2 gap-4">
          <ButtonNeo
            variant="secondary"
            className="h-12 border-4 bg-white hover:bg-gray-50 w-full flex items-center justify-center gap-2 font-bold uppercase shadow-neo-sm"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: event.title,
                  text: `Check out ${event.title} in Chiang Mai!`,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
              }
            }}
          >
            <Share2 className="w-4 h-4" /> Share
          </ButtonNeo>

          <a
            href={event.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="h-12 border-4 border-neo-black bg-neo-lime hover:bg-neo-lime/80 w-full flex items-center justify-center gap-2 font-black uppercase shadow-neo-sm transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none decoration-0 text-neo-black"
          >
            <ExternalLink className="w-5 h-5" /> Visit Website
          </a>
        </div>
      </div>
    </div>
  );
}
