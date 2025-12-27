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
