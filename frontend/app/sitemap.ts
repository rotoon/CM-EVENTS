import { fetchEvents } from '@/lib/api'
import { routing } from '@/i18n/routing'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://hypecnx.com'
  const locales = routing.locales
  const defaultLocale = routing.defaultLocale

  // Fetch all events to include in sitemap
  const events = await fetchEvents()

  // Helper function to generate URL with locale
  const getUrl = (path: string, locale: string) => {
    if (locale === defaultLocale) {
      return `${baseUrl}${path}`
    }
    return `${baseUrl}/${locale}${path}`
  }

  // Generate entries for each locale
  const staticPages = ['', '/gigs', '/exhibitions', '/search']

  const staticEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    staticPages.map((page) => ({
      url: getUrl(page || '/', locale),
      lastModified: new Date(),
      changeFrequency: page === '' ? 'daily' : ('weekly' as const),
      priority: page === '' ? 1.0 : page === '/search' ? 0.5 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, getUrl(page || '/', l)])
        ),
      },
    }))
  )

  // Generate event entries for each locale
  const eventEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    events.map((event) => ({
      url: getUrl(`/events/${event.id}`, locale),
      lastModified: event.last_updated_at || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, getUrl(`/events/${event.id}`, l)])
        ),
      },
    }))
  )

  return [...staticEntries, ...eventEntries]
}
