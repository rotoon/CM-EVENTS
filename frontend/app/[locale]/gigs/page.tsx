import { EventsSkeleton } from '@/components/events/events-skeleton'
import { GigsContentClient } from '@/components/gigs/gigs-content-client'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Metadata } from 'next'
import { Suspense } from 'react'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })

  return {
    title: t('gigsTitle'),
    description: t('gigsDescription'),
    openGraph: {
      title: t('gigsTitle'),
      description: t('gigsDescription'),
    },
  }
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
