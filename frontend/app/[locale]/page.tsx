import { EventsSkeleton } from '@/components/events/events-skeleton'
import { HomeClient } from '@/components/home/home-client'
import { setRequestLocale } from 'next-intl/server'
import { Suspense } from 'react'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function Home({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <Suspense fallback={<EventsSkeleton />}>
      <HomeClient heroEvent={undefined} />
    </Suspense>
  )
}
