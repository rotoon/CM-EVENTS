import Image from "next/image";
import { SearchBar } from "./search-bar";

export function HeroSection() {
  return (
    <header className="max-w-7xl mx-auto px-4 mt-8 mb-20 grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-7 flex flex-col justify-center">
        <div className="inline-block bg-neo-pink border-2 border-neo-black px-4 py-1 font-mono font-bold text-white shadow-neo mb-6 w-max rotate-2">
          #VIBE_CHECK_PASSED
        </div>
        <h2 className="font-display font-black text-6xl md:text-8xl leading-[0.9] mb-6">
          THE CITY <br />
          <span
            className="text-white"
            style={{ WebkitTextStroke: "2px black" }}
          >
            NEVER
          </span>{" "}
          <br />
          SLEEPS.
        </h2>
        <p className="font-bold text-xl md:text-2xl mb-8 leading-tight max-w-lg bg-white inline-block">
          Discover the raw energy of Chiang Mai. <br />
          <span className="bg-neo-lime px-1">Art, Music, and Chaos</span> in one
          place.
        </p>

        <SearchBar />
      </div>

      <div className="lg:col-span-5 relative group cursor-pointer">
        <div className="bg-neo-purple w-full h-[500px] absolute top-4 left-4 border-4 border-neo-black"></div>
        <div className="w-full h-[500px] border-4 border-neo-black bg-white relative z-10 overflow-hidden flex items-center justify-center">
          <Image
            src="https://plus.unsplash.com/premium_photo-1661929242720-140374d97c94?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Chiang Mai Events"
            fill
            className="object-cover filter transition-all duration-300"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-neo-lime/80 backdrop-blur-sm mix-blend-multiply">
            <span className="font-display font-black text-6xl italic -rotate-12 bg-white px-4 border-4 border-neo-black shadow-neo">
              HOT!
            </span>
          </div>
        </div>
        {/* Sticker */}
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-neo-lime rounded-full border-4 border-neo-black flex items-center justify-center z-20 shadow-neo rotate-12 animate-bounce">
          <span className="font-black text-center text-xs leading-none">
            NEW
            <br />
            DROP
            <br />
            2025
          </span>
        </div>
      </div>
    </header>
  );
}
