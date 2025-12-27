import { Zap } from "lucide-react";
import Link from "next/link";

export function NavbarNeo() {
  return (
    <nav className="sticky top-0 z-50 px-4 py-4 backdrop-blur-sm">
      <div className="bg-neo-white border-4 border-neo-black shadow-neo flex justify-between items-center p-4 max-w-7xl mx-auto transform transition-transform hover:-translate-y-1">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-neo-pink border-2 border-neo-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-display font-black text-2xl tracking-tighter italic">
            CM.EVENTS
          </h1>
        </div>

        <div className="hidden md:flex gap-6 font-bold uppercase tracking-wide text-sm">
          <Link
            href="#"
            className="hover:bg-neo-lime hover:px-2 transition-all border-b-4 border-transparent hover:border-neo-black"
          >
            Home
          </Link>
          <Link
            href="#"
            className="hover:bg-neo-pink hover:px-2 transition-all border-b-4 border-transparent hover:border-neo-black"
          >
            Gigs
          </Link>
          <Link
            href="#"
            className="hover:bg-neo-purple hover:text-white hover:px-2 transition-all border-b-4 border-transparent hover:border-neo-black"
          >
            Exhibitions
          </Link>
          <Link
            href="#"
            className="hover:bg-neo-black hover:text-white hover:px-2 transition-all border-b-4 border-transparent hover:border-neo-black"
          >
            Vibe Check
          </Link>
        </div>
      </div>
    </nav>
  );
}
