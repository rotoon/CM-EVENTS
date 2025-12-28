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

  const month = THAI_MONTHS[match[2]];
  const gregorianYear = buddhistYear - 543;

  return new Date(gregorianYear, month, day).getTime();
}

export function getEndDateTimestamp(dateText: string | null): number {
  if (!dateText) return 0;
  // Split by hyphen or en-dash
  const parts = dateText.split(/\s*[-–]\s*/);
  const endDateStr = parts[parts.length - 1];
  return parseThaiDate(endDateStr) || 0;
}

/**
 * Extract all unique YYYY-MM values from a Thai date text.
 * Handles ranges like "25 ธันวาคม 2568 - 5 มกราคม 2569"
 * Returns an array of YYYY-MM strings.
 */
export function extractYearMonthsFromThaiDate(dateText: string): string[] {
  if (!dateText) return [];

  const pattern =
    /(\d{1,2})\s+(มกราคม|กุมภาพันธ์|มีนาคม|เมษายน|พฤษภาคม|มิถุนายน|กรกฎาคม|สิงหาคม|กันยายน|ตุลาคม|พฤศจิกายน|ธันวาคม)\s+(\d{4})/g;

  const results = new Set<string>();
  let match;

  while ((match = pattern.exec(dateText)) !== null) {
    const monthName = match[2];
    const buddhistYear = parseInt(match[3]);
    const monthIndex = THAI_MONTHS[monthName];
    const gregorianYear = buddhistYear - 543;

    // Format as YYYY-MM (e.g., 2025-12)
    const yearMonth = `${gregorianYear}-${String(monthIndex + 1).padStart(
      2,
      "0"
    )}`;
    results.add(yearMonth);
  }

  return Array.from(results);
}

/**
 * Extract start and end dates from Thai date text.
 * Handles ranges like "25 ธันวาคม 2568 - 5 มกราคม 2569"
 * Returns { startDate, endDate } as Date objects or null if parse fails.
 */
export function extractStartEndDates(dateText: string): {
  startDate: Date | null;
  endDate: Date | null;
} {
  if (!dateText) return { startDate: null, endDate: null };

  const pattern =
    /(\d{1,2})\s+(มกราคม|กุมภาพันธ์|มีนาคม|เมษายน|พฤษภาคม|มิถุนายน|กรกฎาคม|สิงหาคม|กันยายน|ตุลาคม|พฤศจิกายน|ธันวาคม)\s+(\d{4})/g;

  const dates: Date[] = [];
  let match;

  while ((match = pattern.exec(dateText)) !== null) {
    const day = parseInt(match[1]);
    const monthName = match[2];
    const buddhistYear = parseInt(match[3]);
    const monthIndex = THAI_MONTHS[monthName];
    const gregorianYear = buddhistYear - 543;

    dates.push(new Date(gregorianYear, monthIndex, day));
  }

  if (dates.length === 0) {
    return { startDate: null, endDate: null };
  }

  // Sort dates and get first and last
  dates.sort((a, b) => a.getTime() - b.getTime());

  return {
    startDate: dates[0],
    endDate: dates[dates.length - 1],
  };
}

/**
 * Generate all YYYY-MM values between start and end date (inclusive).
 */
export function generateMonthRange(startDate: Date, endDate: Date): string[] {
  const months: string[] = [];
  const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

  while (current <= end) {
    const yearMonth = `${current.getFullYear()}-${String(
      current.getMonth() + 1
    ).padStart(2, "0")}`;
    months.push(yearMonth);
    current.setMonth(current.getMonth() + 1);
  }

  return months;
}
