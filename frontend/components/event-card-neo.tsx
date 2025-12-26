import { cn } from "@/lib/utils";
import { ArrowUpRight, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface EventCardProps {
  id: number;
  title: string;
  location: string;
  date: string;
  price: string;
  image: string;
  tag: string;
  color?: string; // Tailwind class for tag bg, e.g. "bg-neo-lime"
}

export function EventCardNeo({
  id,
  title,
  location,
  date,
  price,
  image,
  tag,
  color = "bg-neo-lime",
}: EventCardProps) {
  return (
    <Link
      href={`/events/${id}`}
      className="group relative flex flex-col h-full bg-white border-2 border-neo-black shadow-neo hover:shadow-neo-lg hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Image Section */}
      <div className="relative h-[20rem] w-full border-b-2 border-neo-black overflow-hidden bg-gray-100 shrink-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-all duration-500 scale-100 group-hover:scale-110"
        />
        {/* Tag */}
        <div
          className={cn(
            "absolute top-0 right-0 border-l-2 border-b-2 border-neo-black px-4 py-2 font-mono font-bold shadow-neo text-neo-black text-xs uppercase",
            color
          )}
        >
          {tag}
        </div>
        {/* Date */}
        <div className="absolute bottom-0 left-0 bg-neo-black text-white px-4 py-1 font-mono font-bold text-xs uppercase">
          {date}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="font-display font-black text-xl uppercase leading-tight mb-2 group-hover:text-neo-purple transition-colors line-clamp-2 min-h-[3.5rem]">
          {title}
        </h3>
        <p className="font-mono text-sm font-bold text-gray-500 mb-4 flex items-center gap-2 line-clamp-1">
          <MapPin className="w-4 h-4 shrink-0" />{" "}
          <span className="truncate">{location}</span>
        </p>

        <div className="mt-auto flex justify-between items-center border-t-2 border-gray-100 pt-4">
          <span className="font-bold bg-neo-lime px-2 py-0.5 border border-neo-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs">
            {price}
          </span>
          <div className="w-8 h-8 rounded-full border-2 border-neo-black flex items-center justify-center group-hover:bg-neo-black group-hover:text-white transition-colors">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
