import { Marquee } from "@/components/layout/marquee";

const MARQUEE_ITEMS = [
  "★ CHIANG MAI EVENTS 2026",
  "★ ART IS EVERYWHERE",
  "★ COFFEE CULTURE",
  "★ STREET FOOD VIBES",
  "★ NIMMAN POP",
  "★ LOCAL ARTISANS",
  "★ LIVE MUSIC",
];

export function TopMarquee() {
  return (
    <div className="bg-neo-black text-neo-lime py-2 border-b-4 border-neo-black font-mono font-bold text-sm uppercase overflow-hidden whitespace-nowrap">
      <Marquee speed="slow">
        {MARQUEE_ITEMS.map((item, idx) => (
          <span key={idx} className="mx-4">
            {item}
          </span>
        ))}
      </Marquee>
    </div>
  );
}
