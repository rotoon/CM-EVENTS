import { ErrorBoundary } from "@/components/shared/error-boundary";
import { routing } from "@/i18n/routing";
import QueryProvider from "@/lib/query-provider";
import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { JetBrains_Mono, Kanit, Outfit } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";

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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Dynamic metadata based on locale
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  const isThaiLocale = locale === "th";
  const baseUrl = "https://hypecnx.com";

  return {
    title: {
      default: t("title"),
      template: "%s | Hype CNX",
    },
    description: t("description"),
    keywords: isThaiLocale
      ? [
          "เชียงใหม่",
          "อีเว้นท์",
          "ดนตรีสด",
          "นิทรรศการ",
          "ที่เที่ยวเชียงใหม่",
          "งานเทศกาล",
          "คาเฟ่เชียงใหม่",
          "Chiang Mai",
          "Events",
          "Hype CNX",
        ]
      : [
          "Chiang Mai",
          "Events",
          "Lifestyle",
          "Hype CNX",
          "Chiang Mai Events",
          "Thailand",
          "Gigs",
          "Exhibitions",
          "Northern Thailand",
        ],
    authors: [{ name: "Hype CNX Team" }],
    creator: "Hype CNX",
    publisher: "Hype CNX",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: locale === "th" ? "/" : `/${locale}`,
      languages: {
        th: "/",
        en: "/en",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: locale === "th" ? baseUrl : `${baseUrl}/${locale}`,
      siteName: "Hype CNX",
      images: [
        {
          url: "/logo-v2.png",
          width: 800,
          height: 600,
          alt: "Hype CNX Logo",
        },
      ],
      locale: isThaiLocale ? "th_TH" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/logo-v2.png"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // ตรวจสอบว่า locale ถูกต้อง
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // โหลด messages สำหรับ locale นี้
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${outfit.variable} ${kanit.variable} ${jetbrainsMono.variable} antialiased font-sans min-h-screen text-neo-black selection:bg-neo-pink selection:text-white bg-[#f0f0f0]`}
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <ErrorBoundary>{children}</ErrorBoundary>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
