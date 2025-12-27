"use client";

import { LayoutGrid, Map } from "lucide-react";

interface ViewToggleProps {
  viewMode: "grid" | "map";
  onChange: (mode: "grid" | "map") => void;
}

export function ViewToggle({ viewMode, onChange }: ViewToggleProps) {
  return (
    <div className="flex border-4 border-neo-black bg-white shadow-neo">
      <button
        onClick={() => onChange("grid")}
        className={`px-4 py-2 flex items-center gap-2 font-bold transition-colors ${
          viewMode === "grid"
            ? "bg-neo-black text-white"
            : "bg-white text-neo-black hover:bg-gray-100 placeholder:text-gray-400"
        }`}
      >
        <LayoutGrid className="w-5 h-5" />
        <span className="hidden md:inline">GRID</span>
      </button>
      <div className="w-1 bg-neo-black" />
      <button
        onClick={() => onChange("map")}
        className={`px-4 py-2 flex items-center gap-2 font-bold transition-colors ${
          viewMode === "map"
            ? "bg-neo-black text-white"
            : "bg-white text-neo-black hover:bg-gray-100"
        }`}
      >
        <Map className="w-5 h-5" />
        <span className="hidden md:inline">MAP</span>
      </button>
    </div>
  );
}
