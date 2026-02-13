"use client";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { CalendarDays, X } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

interface DateRangePickerProps {
  startDate?: Date;
  endDate?: Date;
  onChange: (start: Date | undefined, end: Date | undefined) => void;
  placeholder?: string;
}

/**
 * Format dates to Thai Buddhist Era date text
 * e.g. "13 กุมภาพันธ์ 2569" or "13 กุมภาพันธ์ 2569 - 15 กุมภาพันธ์ 2569"
 */
export function formatToThaiDateText(start?: Date, end?: Date): string {
  if (!start) return "";

  const formatThai = (d: Date) => {
    const day = d.getDate();
    const monthName = format(d, "LLLL", { locale: th });
    const buddhistYear = d.getFullYear() + 543;
    return `${day} ${monthName} ${buddhistYear}`;
  };

  const startText = formatThai(start);

  if (!end || start.getTime() === end.getTime()) {
    return startText;
  }

  return `${startText} - ${formatThai(end)}`;
}

/**
 * Parse Thai date text back to Date objects
 * Handles "13 กุมภาพันธ์ 2569 - 15 กุมภาพันธ์ 2569"
 */
const THAI_MONTHS: Record<string, number> = {
  มกราคม: 0,
  กุมภาพันธ์: 1,
  มีนาคม: 2,
  เมษายน: 3,
  พฤษภาคม: 4,
  มิถุนายน: 5,
  กรกฎาคม: 6,
  สิงหาคม: 7,
  กันยายน: 8,
  ตุลาคม: 9,
  พฤศจิกายน: 10,
  ธันวาคม: 11,
};

export function parseThaiDateText(dateText: string): {
  start?: Date;
  end?: Date;
} {
  if (!dateText) return {};

  const pattern =
    /(\d{1,2})\s+(มกราคม|กุมภาพันธ์|มีนาคม|เมษายน|พฤษภาคม|มิถุนายน|กรกฎาคม|สิงหาคม|กันยายน|ตุลาคม|พฤศจิกายน|ธันวาคม)\s+(\d{4})/g;

  const dates: Date[] = [];
  let match;

  while ((match = pattern.exec(dateText)) !== null) {
    const day = parseInt(match[1]);
    const monthIndex = THAI_MONTHS[match[2]];
    const buddhistYear = parseInt(match[3]);
    const gregorianYear = buddhistYear - 543;
    dates.push(new Date(gregorianYear, monthIndex, day));
  }

  if (dates.length === 0) return {};

  dates.sort((a, b) => a.getTime() - b.getTime());

  return {
    start: dates[0],
    end: dates[dates.length - 1],
  };
}

export function DateRangePicker({
  startDate,
  endDate,
  onChange,
  placeholder = "เลือกวันที่",
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);

  const selected: DateRange | undefined =
    startDate || endDate ? { from: startDate, to: endDate } : undefined;

  const displayText = startDate
    ? formatToThaiDateText(startDate, endDate)
    : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="relative">
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-3 w-full h-11 px-4 py-2 rounded-xl border text-sm text-left transition-all cursor-pointer hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            style={{
              backgroundColor: "#F9FAFB",
              borderColor: startDate ? "#D1D5DB" : "#E5E7EB",
              color: startDate ? "#1F2937" : "#9CA3AF",
              paddingRight: startDate ? "2.5rem" : "1rem",
            }}
          >
            <CalendarDays size={18} className="shrink-0 text-blue-500" />
            <span className="truncate flex-1">{displayText}</span>
          </button>
        </PopoverTrigger>
        {startDate && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(undefined, undefined);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
            style={{ color: "#9CA3AF" }}
          >
            <X size={16} />
          </button>
        )}
      </div>
      <PopoverContent
        className="w-auto p-0 border border-gray-200 rounded-2xl shadow-xl bg-white"
        align="start"
        style={{
          border: "1px solid #E5E7EB",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
        }}
      >
        <div className="p-1">
          <Calendar
            mode="range"
            selected={selected}
            onSelect={(range) => {
              onChange(range?.from, range?.to);
              // Close popover when both dates are selected
              if (range?.from && range?.to) {
                setTimeout(() => setOpen(false), 300);
              }
            }}
            numberOfMonths={2}
            className="rounded-xl"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
