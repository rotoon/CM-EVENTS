"use client";

import { Menu, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function NavbarNeo() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/", color: "hover:bg-neo-lime" },
    {
      name: "Gigs",
      href: "/gigs",
      color: "hover:bg-neo-pink hover:text-white",
    },
    {
      name: "Exhibitions",
      href: "/exhibitions",
      color: "hover:bg-neo-purple hover:text-white",
    },
    {
      name: "Feed",
      href: "/search",
      color: "hover:bg-neo-black hover:text-white",
    },
  ];

  return (
    <nav className="sticky top-0 z-50 px-4 py-4 md:py-6 backdrop-blur-sm">
      <div className="bg-white border-4 border-neo-black shadow-neo flex justify-between items-center p-3 md:p-4 max-w-7xl mx-auto relative z-50 transform transition-transform hover:-translate-y-1">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 md:w-14 md:h-14 transform group-hover:rotate-12 transition-transform duration-300">
            <Image
              src="/logo.png"
              alt="HYPE CNX Logo"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="font-display font-black text-xl md:text-2xl tracking-tighter italic uppercase">
            HYPE CNX
          </h1>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1 group/nav">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`
                  px-4 py-2 font-black uppercase tracking-tight text-sm transition-all border-2 border-transparent
                  ${
                    link.color
                  } hover:border-neo-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                  ${
                    isActive
                      ? "bg-neo-lime border-neo-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      : ""
                  }
                `}
              >
                {link.name}
              </Link>
            );
          })}

          <Link
            href="/search"
            className="ml-4 w-11 h-11 border-2 border-neo-black flex items-center justify-center bg-white hover:bg-neo-pink transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
          >
            <Search className="w-5 h-5" />
          </Link>
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/search"
            className="w-10 h-10 border-2 border-neo-black flex items-center justify-center bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          >
            <Search className="w-5 h-5" />
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 h-10 border-2 border-neo-black flex items-center justify-center bg-neo-lime shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 top-0 left-0 w-full h-screen bg-neo-purple/95 flex flex-col items-center justify-center z-40 md:hidden animate-fadeIn">
          <div className="flex flex-col gap-4 w-full px-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="bg-white border-4 border-neo-black p-6 text-center font-display font-black text-3xl uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-2 active:translate-y-2"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="mt-12 bg-neo-pink text-white border-4 border-neo-black p-4 rounded-full shadow-neo"
          >
            <X className="w-8 h-8" />
          </button>
        </div>
      )}
    </nav>
  );
}
