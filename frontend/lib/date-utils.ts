import { Event } from "./types";

// ============================================================================
// Helper: Parse Thai date for sorting
// ============================================================================
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

export function parseThaiDate(dateStr: string): number | null {
  const pattern =
    /(\d{1,2})\s+(มกราคม|กุมภาพันธ์|มีนาคม|เมษายน|พฤษภาคม|มิถุนายน|กรกฎาคม|สิงหาคม|กันยายน|ตุลาคม|พฤศจิกายน|ธันวาคม)\s+(\d{4})/;
  const match = dateStr.match(pattern);

  if (!match) return null;

  const day = parseInt(match[1]);
  const monthName = match[2];
  const buddhistYear = parseInt(match[3]);

  const month = THAI_MONTHS[monthName];
  const gregorianYear = buddhistYear - 543;

  return new Date(gregorianYear, month, day).getTime();
}

export function getEndDateTimestamp(dateText: string | null): number {
  if (!dateText) return 0;
  const parts = dateText.split(/\s*[-–]\s*/);
  const endDateStr = parts[parts.length - 1];
  return parseThaiDate(endDateStr) || 0;
}

export function sortByEndDate(events: Event[]): Event[] {
  return [...events].sort((a, b) => {
    const endA = getEndDateTimestamp(a.date_text);
    const endB = getEndDateTimestamp(b.date_text);
    return endB - endA;
  });
}

export function formatEventTitle(category?: string, month?: string): string {
  let title = "What's On";
  if (category || month) {
    const parts = [];
    if (month) {
      const [year, monthNum] = month.split("-");
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      parts.push(`${monthNames[parseInt(monthNum) - 1]} ${year}`);
    }
    if (category) parts.push(category.toUpperCase());
    title = parts.join(" • ");
  }
  return title;
}

/**
 * Safely parse Thai date text to ISO string.
 * Returns empty string if parsing fails.
 * Handles date ranges like "19 ธันวาคม 2568 - 2 มกราคม 2569" by taking the first date.
 */
export function parseThaiDateToISO(dateText: string | null): string {
  if (!dateText) return "";

  // For date ranges, take the first (start) date
  const parts = dateText.split(/\s*[-–]\s*/);
  const startDateStr = parts[0];

  const timestamp = parseThaiDate(startDateStr);
  if (!timestamp) return "";

  try {
    return new Date(timestamp).toISOString();
  } catch {
    return "";
  }
}
/**
 * Safely parse Thai date text to Date objects.
 * Handles ranges by capturing all dates.
 */
export function parseThaiDates(dateText: string | null): Date[] {
  if (!dateText || dateText === "TBD") return [];

  const pattern =
    /(\d{1,2})\s+(มกราคม|กุมภาพันธ์|มีนาคม|เมษายน|พฤษภาคม|มิถุนายน|กรกฎาคม|สิงหาคม|กันยายน|ตุลาคม|พฤศจิกายน|ธันวาคม)\s+(\d{4})/g;

  const dates: Date[] = [];
  const matches = [...dateText.matchAll(pattern)];

  for (const match of matches) {
    const day = parseInt(match[1]);
    const month = THAI_MONTHS[match[2]];
    const gregorianYear = parseInt(match[3]) - 543;
    dates.push(new Date(gregorianYear, month, day, 23, 59, 59));
  }

  return dates;
}

/**
 * Check if the event has ended based on its date text.
 * Logic: Today is greater than the last date in the range.
 */
export function isEventEnded(
  dateText: string | null,
  manualIsEnded?: number | boolean | null
): boolean {
  if (manualIsEnded === true || manualIsEnded === 1) return true;
  if (!dateText) return false;

  const dates = parseThaiDates(dateText);
  if (dates.length === 0) return false;

  const lastDate = dates[dates.length - 1];
  const today = new Date();

  return today > lastDate;
}

// Parse Thai date to readable format
export function formatReadableDate(dateText: string): string {
  const THAI_MONTHS: Record<string, string> = {
    มกราคม: "JAN",
    กุมภาพันธ์: "FEB",
    มีนาคม: "MAR",
    เมษายน: "APR",
    พฤษภาคม: "MAY",
    มิถุนายน: "JUN",
    กรกฎาคม: "JUL",
    สิงหาคม: "AUG",
    กันยายน: "SEP",
    ตุลาคม: "OCT",
    พฤศจิกายน: "NOV",
    ธันวาคม: "DEC",
  };

  // Pattern: "19 ธันวาคม 2568" - capture day, month, and year
  const pattern =
    /(\d{1,2})\s+(มกราคม|กุมภาพันธ์|มีนาคม|เมษายน|พฤษภาคม|มิถุนายน|กรกฎาคม|สิงหาคม|กันยายน|ตุลาคม|พฤศจิกายน|ธันวาคม)\s+(\d{4})/g;

  // Replace Thai months with English abbreviations and convert Buddhist year to Gregorian
  let result = dateText;

  // Find all matches and replace
  const matches = dateText.matchAll(pattern);
  for (const match of matches) {
    const day = match[1];
    const thaiMonth = match[2];
    const buddhistYear = parseInt(match[3]);
    const engMonth = THAI_MONTHS[thaiMonth] || thaiMonth;
    const gregorianYear = buddhistYear - 543; // Convert to Gregorian
    // Format: "19 DEC 2025"
    result = result.replace(match[0], `${day} ${engMonth} ${gregorianYear}`);
  }

  // Clean up the separator: replace " - " or " – " with " → "
  result = result.replace(/\s*[-–]\s*/g, " → ");

  return result || "TBD";
}
