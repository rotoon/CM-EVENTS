"use client";

import { Link } from "@/i18n/navigation";
import { Instagram, Twitter } from "lucide-react";
import { useTranslations } from "next-intl";

export function FooterNeo() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-neo-black text-neo-white pt-16 pb-8 border-t-4 border-neo-black">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="font-display font-black text-5xl md:text-7xl mb-4 leading-none">
            HYPE
            <br />
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: "1px white" }}
            >
              CNX
            </span>
          </h2>
          <p className="font-mono text-sm max-w-sm">{t("tagline")}</p>
        </div>
        <div className="flex flex-col items-start md:items-end justify-center">
          <div className="flex gap-4">
            <Link
              href="#"
              aria-label="Follow us on Instagram"
              className="w-12 h-12 border-2 border-white flex items-center justify-center hover:bg-neo-lime hover:text-black hover:border-black transition-colors"
            >
              <Instagram />
            </Link>
            <Link
              href="#"
              aria-label="Follow us on Twitter"
              className="w-12 h-12 border-2 border-white flex items-center justify-center hover:bg-neo-pink hover:text-black hover:border-black transition-colors"
            >
              <Twitter />
            </Link>
          </div>
          <p className="mt-8 font-mono text-xs text-gray-400">
            © 2025 HYPE CNX.
          </p>
        </div>
      </div>
    </footer>
  );
}
