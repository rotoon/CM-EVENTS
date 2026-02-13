"use client";

import { higColors } from "@/components/ui/hig-components";
import { Clock, X } from "lucide-react";

interface TimeRangePickerProps {
  startTime?: string; // "HH:mm"
  endTime?: string; // "HH:mm"
  onChange: (start: string, end: string) => void;
}

/**
 * Format start/end time into display text
 * e.g. "10:00 - 22:00" or "10:00 น. - 22:00 น."
 */
export function formatTimeText(start?: string, end?: string): string {
  if (!start && !end) return "";
  if (start && !end) return `${start} น.`;
  if (!start && end) return `${end} น.`;
  if (start === end) return `${start} น.`;
  return `${start} - ${end} น.`;
}

/**
 * Parse time text like "10:00 - 22:00 น." back to start/end
 */
export function parseTimeText(text: string): {
  start: string;
  end: string;
} {
  if (!text) return { start: "", end: "" };

  const timePattern = /(\d{1,2}:\d{2})/g;
  const matches = text.match(timePattern);

  if (!matches || matches.length === 0) return { start: "", end: "" };

  return {
    start: matches[0] || "",
    end: matches[1] || matches[0] || "",
  };
}

export function TimeRangePicker({
  startTime = "",
  endTime = "",
  onChange,
}: TimeRangePickerProps) {
  const hasValue = startTime || endTime;

  return (
    <div className="flex items-center gap-2">
      {/* Start Time */}
      <div className="relative flex-1">
        <Clock
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: higColors.blue }}
        />
        <input
          type="time"
          value={startTime}
          onChange={(e) => onChange(e.target.value, endTime)}
          className="w-full h-11 pl-9 pr-3 py-2 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:border-blue-400"
          style={{
            backgroundColor: "#F9FAFB",
            borderColor: "#E5E7EB",
            color: "#1F2937",
          }}
        />
      </div>

      <span
        className="text-sm font-medium shrink-0"
        style={{ color: higColors.labelSecondary }}
      >
        ถึง
      </span>

      {/* End Time */}
      <div className="relative flex-1">
        <Clock
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: higColors.blue }}
        />
        <input
          type="time"
          value={endTime}
          onChange={(e) => onChange(startTime, e.target.value)}
          className="w-full h-11 pl-9 pr-3 py-2 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:border-blue-400"
          style={{
            backgroundColor: "#F9FAFB",
            borderColor: "#E5E7EB",
            color: "#1F2937",
          }}
        />
      </div>

      {/* Clear Button */}
      {hasValue && (
        <button
          type="button"
          onClick={() => onChange("", "")}
          className="p-1.5 rounded-full hover:bg-gray-200 transition-colors cursor-pointer shrink-0"
          style={{ color: "#9CA3AF" }}
          title="ล้างเวลา"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
