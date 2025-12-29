import { ErrorBoundary } from '@/components/error-boundary'
import { FooterNeo } from '@/components/footer-neo'
import { NavbarNeo } from '@/components/navbar-neo'
import { TopMarquee } from '@/components/top-marquee'
import QueryProvider from '@/lib/query-provider'
import { routing } from '@/i18n/routing'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { JetBrains_Mono, Kanit, Outfit } from 'next/font/google'
import '../globals.css'

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
})

const kanit = Kanit({
  variable: '--font-kanit',
  weight: ['300', '400', '500', '600'],
  subsets: ['latin', 'thai'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  title: {
    default: 'Hype CNX - Chiang Mai Lifestyle & Events',
    template: '%s | Hype CNX',
  },
  description:
    "The heartbeat of Chiang Mai. Discover events, lifestyle, and unique experiences in Thailand's northern capital. รวมอีเว้นท์ งานดนตรี และนิทรรศการศิลปะล่าสุดในเชียงใหม่ คอมมูนิตี้สำหรับคนรักความสนุกและศิลปะ",
  keywords: [
    'Chiang Mai',
    'Events',
    'Lifestyle',
    'Hype CNX',
    'Chiang Mai Events',
    'Thailand',
    'Gigs',
    'Exhibitions',
    'เชียงใหม่',
    'อีเว้นท์',
    'ดนตรีสด',
    'นิทรรศการ',
    'ที่เที่ยวเชียงใหม่',
  ],
  authors: [{ name: 'Hype CNX Team' }],
  creator: 'Hype CNX',
  publisher: 'Hype CNX',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https:///hypecnx.com/'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Hype CNX - Chiang Mai Lifestyle & Events',
    description:
      'The heartbeat of Chiang Mai. Discover events, lifestyle, and experiences in the city.',
    url: 'https:///hypecnx.com/',
    siteName: 'Hype CNX',
    images: [
      {
        url: '/logo-v2.png',
        width: 800,
        height: 600,
        alt: 'Hype CNX Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hype CNX - Chiang Mai Lifestyle & Events',
    description:
      'The heartbeat of Chiang Mai. Discover events, lifestyle, and experiences in the city.',
    images: ['/logo-v2.png'],
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  // ตรวจสอบว่า locale ถูกต้อง
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  // Enable static rendering
  setRequestLocale(locale)

  // โหลด messages สำหรับ locale นี้
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className={`${outfit.variable} ${kanit.variable} ${jetbrainsMono.variable} antialiased font-sans min-h-screen text-neo-black selection:bg-neo-pink selection:text-white bg-[#f0f0f0]`}
        style={{
          backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      >
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <TopMarquee />
            <NavbarNeo />
            <ErrorBoundary>{children}</ErrorBoundary>
            <FooterNeo />
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
