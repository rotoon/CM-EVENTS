import { cn } from "@/lib/utils";
import * as React from "react";
import { higColors } from "./shared";

function HIGInput({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-xl px-4 text-[17px] transition-colors",
        "placeholder:text-[rgba(60,60,67,0.3)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      style={{
        backgroundColor: higColors.bgSecondary,
        color: higColors.labelPrimary,
        border: "none",
        boxShadow: "none",
      }}
      {...props}
    />
  );
}

function HIGTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-xl px-4 py-3 text-[17px] transition-colors resize-none",
        "placeholder:text-[rgba(60,60,67,0.3)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      style={{
        backgroundColor: higColors.bgSecondary,
        color: higColors.labelPrimary,
        border: "none",
        boxShadow: "none",
      }}
      {...props}
    />
  );
}

function HIGLabel({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      className={cn("text-[15px] font-medium leading-none", className)}
      style={{ color: higColors.labelPrimary }}
      {...props}
    />
  );
}

export { HIGInput, HIGLabel, HIGTextarea };
