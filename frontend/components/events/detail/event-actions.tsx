"use client";

import { ButtonNeo } from "@/components/ui/button-neo";
import { Event } from "@/types";

interface EventActionsProps {
  event: Event;
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function EventActions({ event }: EventActionsProps) {
  const shareUrl = `https://hypecnx.com/events/${event.id}`;

  const handleFacebookShare = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(event.title)}`;
    window.open(fbUrl, "_blank", "width=600,height=400");
  };

  return (
    <div className="grid grid-cols-1 gap-4 mt-8 sticky bottom-4 z-20 md:static">
      <div className="p-4 bg-white/80 backdrop-blur-md border-t-4 border-neo-black md:bg-transparent md:border-none md:p-0 md:backdrop-blur-none">
        <div className="grid grid-cols-1 gap-4">
          <ButtonNeo
            variant="accent"
            className="h-12 border-4 w-full flex items-center justify-center gap-2 font-bold uppercase shadow-neo-sm"
            onClick={handleFacebookShare}
          >
            <FacebookIcon className="w-5 h-5" /> Facebook
          </ButtonNeo>
        </div>
      </div>
    </div>
  );
}
