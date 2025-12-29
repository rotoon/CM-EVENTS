import { EventsSkeleton } from '@/components/events/events-skeleton'
import { ExhibitionsContentClient } from '@/components/exhibitions/exhibitions-content-client'
import { setRequestLocale } from 'next-intl/server'
import { Metadata } from 'next'
import { Suspense } from 'react'

type Props = {
  params: Promise<{ locale: string }>
}

export const metadata: Metadata = {
  title: 'Art & Exhibitions',
  description:
    'Explore the thriving art scene in Chiang Mai. Find the latest exhibitions and creative workshops with HYPE CNX.',
}

export default async function ExhibitionsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <Suspense fallback={<EventsSkeleton />}>
      <ExhibitionsContentClient />
    </Suspense>
  )
}
