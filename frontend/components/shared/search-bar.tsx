"use client";

import { ButtonNeo } from "@/components/ui/button-neo";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-grow border-4 border-neo-black p-2 bg-white shadow-neo flex items-center">
        <Search className="w-6 h-6 ml-2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="FIND YOUR VIBE..."
          className="w-full bg-transparent border-none focus:outline-none font-bold text-lg px-4 uppercase placeholder-gray-400"
        />
      </div>
      <ButtonNeo
        size="lg"
        onClick={handleSearch}
        className="text-xl shadow-neo hover:bg-neo-pink hover:text-black hover:shadow-none bg-neo-black text-white px-8"
      >
        GO!
      </ButtonNeo>
    </div>
  );
}
