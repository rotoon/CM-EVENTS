import { cn } from "@/lib/utils";
import { ArrowUpRight, Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface EventCardProps {
  id: number;
  title: string;
  location: string;
  date: string;
  isEnded: boolean | number | null;
  image: string;
  tag: string;
  color?: string; // Tailwind class for tag bg, e.g. "bg-neo-lime"
}

// Parse Thai date to readable format
function formatReadableDate(dateText: string): string {
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

export function EventCardNeo({
  id,
  title,
  location,
  date,
  isEnded,
  image,
  tag,
  color = "bg-neo-lime",
}: EventCardProps) {
  const readableDate = formatReadableDate(date);

  return (
    <Link
      href={`/events/${id}`}
      className="group relative flex flex-col h-full bg-white border-4 border-neo-black shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Image Section */}
      <div className="relative h-[20rem] w-full border-b-4 border-neo-black overflow-hidden bg-gray-100 shrink-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 scale-100 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
        {/* Tag */}
        <div
          className={cn(
            "absolute top-0 right-0 border-l-4 border-b-4 border-neo-black px-4 py-2 font-mono font-bold shadow-neo text-neo-black text-xs uppercase z-10",
            color
          )}
        >
          {tag}
        </div>

        {/* Date Badge - Clean readable format */}
        <div className="absolute bottom-3 left-3 z-10">
          <div className="bg-white border-3 border-neo-black shadow-neo px-3 py-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-neo-pink shrink-0" />
            <span className="font-mono font-bold text-xs text-neo-black tracking-tight">
              {readableDate}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="font-display font-black text-xl uppercase leading-tight mb-2 group-hover:underline text-neo-black decoration-neo-purple decoration-4 underline-offset-4 transition-all min-h-[5rem]">
          {title}
        </h3>
        <p className="font-mono text-sm font-bold text-gray-500 mb-4 flex items-center gap-2 line-clamp-1">
          <MapPin className="w-4 h-4 shrink-0 text-neo-pink" />{" "}
          <span className="truncate text-neo-black">{location}</span>
        </p>

        <div className="mt-auto flex justify-between items-center border-t-2 border-gray-100 pt-4">
          {isEnded ? (
            <span className="font-bold bg-neo-pink text-white px-3 py-1 border-2 border-neo-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-xs uppercase tracking-tight">
              ENDED
            </span>
          ) : (
            <span className="font-bold bg-neo-lime text-neo-black px-3 py-1 border-2 border-neo-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-xs uppercase tracking-tight flex items-center gap-1">
              <span className="animate-pulse w-2 h-2 bg-neo-black rounded-full block"></span>
              JOIN NOW
            </span>
          )}
          <div className="w-10 h-10 border-2 border-neo-black flex items-center justify-center bg-white text-neo-black group-hover:bg-neo-black group-hover:text-white transition-all transform group-hover:rotate-12">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>
      </div>
    </Link>
  );
}
