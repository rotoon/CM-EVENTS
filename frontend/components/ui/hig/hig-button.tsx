import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const higButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[#007AFF] text-white hover:bg-[#0056b3] active:bg-[#004494]",
        destructive:
          "bg-[#FF3B30] text-white hover:bg-[#d63028] active:bg-[#b82820]",
        outline:
          "bg-transparent border border-[rgba(60,60,67,0.12)] text-black hover:bg-[#F2F2F7]",
        secondary: "bg-[#F2F2F7] text-black hover:bg-[#E5E5EA]",
        ghost: "bg-transparent hover:bg-[#F2F2F7] text-black",
        link: "text-[#007AFF] underline-offset-4 hover:underline bg-transparent",
      },
      size: {
        default: "h-11 px-5 rounded-full text-[17px]",
        sm: "h-9 px-4 rounded-full text-[15px]",
        lg: "h-12 px-6 rounded-full text-[17px]",
        icon: "h-11 w-11 rounded-full",
        "icon-sm": "h-9 w-9 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function HIGButton({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof higButtonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(higButtonVariants({ variant, size, className }))}
      style={{
        boxShadow: "none",
        border: variant === "outline" ? undefined : "none",
      }}
      {...props}
    />
  );
}

export { HIGButton, higButtonVariants };
