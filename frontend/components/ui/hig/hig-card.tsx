import { cn } from "@/lib/utils";
import * as React from "react";
import { higColors } from "./shared";

function HIGCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("rounded-xl bg-white text-black", className)}
      style={{ boxShadow: "none", border: "none" }}
      {...props}
    />
  );
}

function HIGCardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-4 pb-0", className)}
      {...props}
    />
  );
}

function HIGCardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn("font-semibold leading-none tracking-tight", className)}
      style={{ fontSize: "17px", color: higColors.labelPrimary }}
      {...props}
    />
  );
}

function HIGCardDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-sm", className)}
      style={{ color: higColors.labelSecondary }}
      {...props}
    />
  );
}

function HIGCardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("p-4", className)} {...props} />;
}

function HIGCardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center p-4 pt-0", className)} {...props} />
  );
}

export {
  HIGCard,
  HIGCardContent,
  HIGCardDescription,
  HIGCardFooter,
  HIGCardHeader,
  HIGCardTitle,
};
