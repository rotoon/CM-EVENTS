"use client";

import { EventsContent } from "@/components/events/events-content";

export function GigsContentClient() {
  return (
    <div className="min-h-screen bg-neo-black text-white relative overflow-hidden">
      <div
        className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03]"
        style={{ filter: "url(#noiseFilter)" }}
      >
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-16 md:pt-24 pb-8 relative z-10">
        <div className="inline-block bg-neo-pink text-white px-4 py-2 font-display font-black text-sm border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] mb-6 animate-bounce-slow rotate-2">
          #LIVE_LOUD_CNX
        </div>
        <h1 className="font-display font-black text-6xl md:text-8xl lg:text-9xl leading-[0.8] mb-8 text-neo-lime uppercase italic">
          TURN UP THE <br />
          <span
            className="text-white animate-pulse"
            style={{ WebkitTextStroke: "2px #a3e635" }}
          >
            VOLUME.
          </span>
        </h1>
        <p className="font-bold text-xl md:text-2xl max-w-2xl bg-white text-black p-4 border-4 border-neo-lime shadow-[8px_8px_0px_0px_rgba(163,230,53,1)] hover:rotate-0 transition-transform duration-300 rotate-[-1deg]">
          The only feed you need for Gigs, Concerts, and pure Chiang Mai
          nightlife energy.
        </p>
      </div>

      <div className="relative z-10">
        <EventsContent
          category="music"
          title="GIGS & CONCERTS"
          overrideLabel="GIG FEED"
          isDark={true}
        />
      </div>
    </div>
  );
}
