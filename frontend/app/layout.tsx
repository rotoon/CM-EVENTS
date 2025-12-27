import { FooterNeo } from "@/components/footer-neo";
import { NavbarNeo } from "@/components/navbar-neo";
import { TopMarquee } from "@/components/top-marquee";
import QueryProvider from "@/lib/query-provider";
import type { Metadata } from "next";
import { JetBrains_Mono, Kanit, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const kanit = Kanit({
  variable: "--font-kanit",
  weight: ["300", "400", "500", "600"],
  subsets: ["latin", "thai"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hype CNX - Chiang Mai Lifestyle & Events",
  description:
    "The heartbeat of Chiang Mai. Discover events, lifestyle, and experiences in the city.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${kanit.variable} ${jetbrainsMono.variable} antialiased font-sans min-h-screen text-neo-black selection:bg-neo-pink selection:text-white bg-[#f0f0f0]`}
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <QueryProvider>
          <TopMarquee />
          <NavbarNeo />
          {children}
          <FooterNeo />
        </QueryProvider>
      </body>
    </html>
  );
}
