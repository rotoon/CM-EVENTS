import { SearchContentClient } from '@/components/search/search-content-client'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Metadata } from 'next'
import { Suspense } from 'react'

interface Props {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { locale } = await params
  const { q } = await searchParams
  const t = await getTranslations({ locale, namespace: 'meta' })

  if (q) {
    return {
      title: t('searchResultTitle', { query: q }),
      description: t('searchResultDescription', { query: q }),
    }
  }

  return {
    title: t('searchTitle'),
    description: t('searchDescription'),
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
