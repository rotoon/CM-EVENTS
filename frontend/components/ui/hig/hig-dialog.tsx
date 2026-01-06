import { cn } from "@/lib/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";

function HIGDialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root {...props} />;
}

function HIGDialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger {...props} />;
}

function HIGDialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={cn(
          "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        )}
      />
      <DialogPrimitive.Content
        className={cn(
          "fixed top-[50%] left-[50%] z-50 w-full max-w-[270px] translate-x-[-50%] translate-y-[-50%]",
          "rounded-[14px] bg-white shadow-2xl outline-none",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          className
        )}
        style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

function HIGDialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("px-4 pt-5 pb-2 text-center", className)} {...props} />
  );
}

function HIGDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("text-[17px] font-semibold text-black", className)}
      {...props}
    />
  );
}

function HIGDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("text-[13px] text-[rgba(60,60,67,0.6)] mt-1", className)}
      {...props}
    />
  );
}

function HIGDialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex border-t border-[rgba(60,60,67,0.12)]", className)}
      {...props}
    />
  );
}

function HIGDialogAction({
  className,
  destructive = false,
  ...props
}: React.ComponentProps<"button"> & { destructive?: boolean }) {
  return (
    <button
      className={cn(
        "rounded-[14px] flex-1 py-3 text-[17px] font-semibold transition-colors cursor-pointer",
        "border-r border-[rgba(60,60,67,0.12)] last:border-r-0",
        "hover:bg-[#F2F2F7] active:bg-[#E5E5EA]",
        destructive ? "text-[#FF3B30]" : "text-[#007AFF]",
        className
      )}
      {...props}
    />
  );
}

function HIGDialogCancel({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <DialogPrimitive.Close asChild>
      <button
        className={cn(
          "rounded-[14px] flex-1 py-3 text-[17px] font-normal text-[#007AFF] transition-colors cursor-pointer",
          "border-r border-[rgba(60,60,67,0.12)]",
          "hover:bg-[#F2F2F7] active:bg-[#E5E5EA]",
          className
        )}
        {...props}
      />
    </DialogPrimitive.Close>
  );
}

export {
  HIGDialog,
  HIGDialogAction,
  HIGDialogCancel,
  HIGDialogContent,
  HIGDialogDescription,
  HIGDialogFooter,
  HIGDialogHeader,
  HIGDialogTitle,
  HIGDialogTrigger,
};
