"use client";

import { LanguageSwitcher } from "@/components/shared/language-switcher";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link } from "@/i18n/navigation";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";

export function NavbarNeo() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("nav");

  return (
    <nav className="sticky top-0 z-50 px-4 py-4 md:py-6 backdrop-blur-sm">
      <div className="bg-white border-4 border-neo-black shadow-neo flex justify-between items-center p-3 md:p-4 max-w-7xl mx-auto relative z-50 transform transition-transform hover:-translate-y-1">
        {/* Logo Section */}
        <Link href="/" passHref className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 md:w-14 md:h-14 transform group-hover:rotate-12 transition-transform duration-300">
            <Image
              src="/logo.png"
              alt="HYPE CNX Logo"
              fill
              className="object-contain"
              sizes="56px"
            />
          </div>
          <h1 className="font-display font-black text-xl md:text-2xl tracking-tighter italic uppercase">
            HYPE CNX
          </h1>
        </Link>

        {/* Desktop Links - NavigationMenu */}
        <div className="hidden md:flex items-center gap-1">
          <NavigationMenu viewport={false}>
            <NavigationMenuList className="gap-2">
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/"
                  className={`${navigationMenuTriggerStyle()} bg-transparent hover:bg-neo-lime hover:text-black border-2 border-transparent hover:border-neo-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase font-black tracking-tight text-neo-black`}
                >
                  {t("home")}
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-neo-lime hover:text-black border-2 border-transparent hover:border-neo-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase font-black tracking-tight text-neo-black data-[state=open]:bg-neo-lime data-[state=open]:text-black data-[state=open]:border-neo-black data-[state=open]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  Events
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 w-[200px] bg-white border-4 border-neo-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <li>
                      <NavigationMenuLink
                        href="/gigs"
                        className="block select-none space-y-1 p-3 leading-none no-underline outline-none transition-colors hover:bg-neo-lime hover:text-black border-2 border-transparent hover:border-neo-black"
                      >
                        <div className="text-sm font-black uppercase leading-none">
                          {t("gigs")}
                        </div>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        href="/exhibitions"
                        className="block select-none space-y-1 p-3 leading-none no-underline outline-none transition-colors hover:bg-neo-lime hover:text-black border-2 border-transparent hover:border-neo-black"
                      >
                        <div className="text-sm font-black uppercase leading-none">
                          {t("exhibitions")}
                        </div>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-neo-lime hover:text-black border-2 border-transparent hover:border-neo-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase font-black tracking-tight text-neo-black data-[state=open]:bg-neo-lime data-[state=open]:text-black data-[state=open]:border-neo-black data-[state=open]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  Places
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[240px] gap-3 p-4 bg-white border-4 border-neo-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    {[
                      {
                        title: "All Places",
                        href: "/places",
                      },
                      {
                        title: "Cafe",
                        href: "/cafe",
                      },
                      {
                        title: "Food",
                        href: "/food",
                      },
                      {
                        title: "Restaurant",
                        href: "/restaurant",
                      },
                      {
                        title: "Travel",
                        href: "/travel",
                      },
                      {
                        title: "Bar/Nightlife",
                        href: "/nightlife",
                      },
                    ].map((item) => (
                      <li key={item.title}>
                        <NavigationMenuLink
                          href={item.href}
                          className={`block select-none space-y-1 p-3 leading-none no-underline outline-none transition-colors border-2 border-transparent hover:border-neo-black hover:bg-neo-lime hover:text-black`}
                        >
                          <div className="text-sm font-black uppercase leading-none">
                            {item.title}
                          </div>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* <NavigationMenuItem>
                <NavigationMenuLink
                  href="/plan"
                  className={`${navigationMenuTriggerStyle()} bg-transparent hover:bg-neo-lime hover:text-black border-2 border-transparent hover:border-neo-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase font-black tracking-tight text-neo-black`}
                >
                  {t("plan")}
                </NavigationMenuLink>
              </NavigationMenuItem> */}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Language Switcher */}
          <div className="ml-2">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageSwitcher />
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="w-10 h-10 border-2 border-neo-black flex items-center justify-center bg-neo-lime shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 z-50"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 top-0 left-0 w-full min-h-screen bg-neo-purple/95 flex flex-col items-center justify-start pt-24 pb-8 overflow-y-auto z-40 md:hidden animate-fadeIn">
          <div className="flex flex-col gap-4 w-full px-8 max-w-sm">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block bg-white border-4 border-neo-black p-4 text-center font-display font-black text-2xl uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-2 active:translate-y-2 hover:bg-neo-lime hover:text-black"
            >
              {t("home")}
            </Link>

            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/gigs"
                onClick={() => setIsOpen(false)}
                className="block bg-white border-4 border-neo-black p-4 text-center font-display font-black text-xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-2 active:translate-y-2 hover:bg-neo-lime hover:text-black"
              >
                {t("gigs")}
              </Link>
              <Link
                href="/exhibitions"
                onClick={() => setIsOpen(false)}
                className="block bg-white border-4 border-neo-black p-4 text-center font-display font-black text-xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-2 active:translate-y-2 hover:bg-neo-lime hover:text-black"
              >
                {t("exhibitions")}
              </Link>
            </div>

            <Link
              href="/places"
              onClick={() => setIsOpen(false)}
              className="block bg-white border-4 border-neo-black p-4 text-center font-display font-black text-2xl uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-2 active:translate-y-2 hover:bg-neo-lime hover:text-black"
            >
              {t("places")}
            </Link>
            <div className="flex flex-col gap-2 -mt-2">
              {[
                { title: "Cafe", href: "/cafe" },
                { title: "Food", href: "/food" },
                { title: "Restaurant", href: "/restaurant" },
                { title: "Travel", href: "/travel" },
                {
                  title: "Bar/Nightlife",
                  href: "/nightlife",
                },
              ].map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block bg-white border-2 border-neo-black p-2 text-center font-bold text-sm uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 hover:bg-neo-lime hover:text-black"
                >
                  {item.title}
                </Link>
              ))}
            </div>

            {/* <Link
              href="/plan"
              onClick={() => setIsOpen(false)}
              className="block bg-white border-4 border-neo-black p-4 text-center font-display font-black text-2xl uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-2 active:translate-y-2 hover:bg-neo-lime hover:text-black"
            >
              {t("plan")}
            </Link> */}
          </div>
        </div>
      )}
    </nav>
  );
}
