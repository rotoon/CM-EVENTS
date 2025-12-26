import { cn } from "@/lib/utils";
import * as React from "react";

export interface ButtonNeoProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent";
  size?: "sm" | "default" | "lg";
}

const ButtonNeo = React.forwardRef<HTMLButtonElement, ButtonNeoProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base
          "font-display font-bold uppercase tracking-wide transition-all active:scale-[0.98]",
          "border-2 border-neo-black shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover",
          "active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",

          // Variants
          variant === "primary" &&
            "bg-neo-lime text-neo-black hover:bg-neo-lime/90",
          variant === "secondary" &&
            "bg-neo-white text-neo-black hover:bg-gray-50",
          variant === "accent" && "bg-neo-pink text-white hover:bg-neo-pink/90",

          // Sizes
          size === "default" && "h-11 px-8 py-2 text-sm",
          size === "sm" && "h-9 px-4 text-xs",
          size === "lg" && "h-14 px-10 text-lg",

          className
        )}
        {...props}
      />
    );
  }
);
ButtonNeo.displayName = "ButtonNeo";

export { ButtonNeo };
