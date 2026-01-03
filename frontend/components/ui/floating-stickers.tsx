"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface StickerProps {
  emoji: string;
  className?: string;
  delay?: number;
}

function Sticker({ emoji, className, delay = 0 }: StickerProps) {
  return (
    <div
      className={cn(
        "absolute pointer-events-none select-none animate-bounce-slow text-4xl md:text-6xl filter drop-shadow-neo rotate-12",
        className
      )}
      style={{ animationDelay: `${delay}s` }}
    >
      {emoji}
    </div>
  );
}

export function FloatingStickers() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <Sticker
        emoji="🍹"
        className="top-10 left-[10%] opacity-20 md:opacity-40"
        delay={0}
      />
      <Sticker
        emoji="🐘"
        className="bottom-20 left-[5%] opacity-15 md:opacity-30 -rotate-12"
        delay={1.5}
      />
      <Sticker
        emoji="🏍️"
        className="top-20 right-[15%] opacity-20 md:opacity-40 rotate-45"
        delay={0.5}
      />
      <Sticker
        emoji="🍜"
        className="bottom-10 right-[10%] opacity-15 md:opacity-30 -rotate-6"
        delay={2}
      />
      <Sticker
        emoji="📸"
        className="top-1/2 left-[20%] opacity-10 md:opacity-25 rotate-12"
        delay={1}
      />
      <Sticker
        emoji="✨"
        className="top-1/3 right-[25%] opacity-10 md:opacity-25 -rotate-45"
        delay={2.5}
      />
    </div>
  );
}
