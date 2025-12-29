import { SearchContentClient } from '@/components/search/search-content-client'
import { setRequestLocale } from 'next-intl/server'
import { Metadata } from 'next'
import { Suspense } from 'react'

interface Props {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { q } = await searchParams

  if (q) {
    return {
      title: `Search: ${q}`,
      description: `Find events related to "${q}" in Chiang Mai on HYPE CNX.`,
    }
  }

  return {
    title: 'Search Events',
    description:
      'Search for the latest events, gigs, and exhibitions in Chiang Mai.',
  }
}

export default async function SearchPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContentClient />
    </Suspense>
  )
}
