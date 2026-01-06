"use client";

import { higColors } from "@/components/ui/hig/shared";
import { Menu, X } from "lucide-react";

interface AdminMobileHeaderProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function AdminMobileHeader({
  isOpen,
  onToggle,
}: AdminMobileHeaderProps) {
  return (
    <div
      className="lg:hidden sticky top-0 z-50 px-4 py-3 flex items-center justify-between"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: `0.5px solid ${higColors.separator}`,
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-white"
          style={{ backgroundColor: higColors.blue }}
        >
          H
        </div>
        <span
          className="font-semibold"
          style={{ color: higColors.labelPrimary, fontSize: "17px" }}
        >
          HYPE CNX
        </span>
      </div>
      <button
        onClick={onToggle}
        className="h-11 w-11 rounded-full flex items-center justify-center transition-colors hover:bg-[#F2F2F7]"
        style={{ minHeight: "44px", minWidth: "44px" }}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
    </div>
  );
}
