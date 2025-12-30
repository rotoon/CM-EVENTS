import { EventsSkeleton } from '@/components/events/events-skeleton'
import { ExhibitionsContentClient } from '@/components/exhibitions/exhibitions-content-client'
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
    title: t('exhibitionsTitle'),
    description: t('exhibitionsDescription'),
    openGraph: {
      title: t('exhibitionsTitle'),
      description: t('exhibitionsDescription'),
    },
  }
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
