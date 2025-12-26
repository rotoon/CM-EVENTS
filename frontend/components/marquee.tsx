import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
}

export function Marquee({
  children,
  className,
  direction = "left",
  speed = "normal",
}: MarqueeProps) {
  return (
    <div
      className={cn("overflow-hidden whitespace-nowrap flex gap-4", className)}
    >
      <div
        className={cn(
          "flex min-w-full shrink-0 items-center justify-around gap-4 animate-marquee",
          direction === "right" && "animate-marquee-reverse",
          speed === "fast" && "duration-[10s]",
          speed === "normal" && "duration-[20s]",
          speed === "slow" && "duration-[40s]"
        )}
      >
        {children}
        {children}
        {children}
        {children}
      </div>
    </div>
  );
}
