import { EventsSkeleton } from '@/components/events/events-skeleton'
import { GigsContentClient } from '@/components/gigs/gigs-content-client'
import { setRequestLocale } from 'next-intl/server'
import { Metadata } from 'next'
import { Suspense } from 'react'

type Props = {
  params: Promise<{ locale: string }>
}

export const metadata: Metadata = {
  title: 'Gigs & Live Music',
  description:
    'Discover live music, gigs, and concerts in Chiang Mai tonight. Turn up the volume with HYPE CNX.',
}

export default async function GigsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <Suspense fallback={<EventsSkeleton />}>
      <GigsContentClient />
    </Suspense>
  )
}
