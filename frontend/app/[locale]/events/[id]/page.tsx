import { EventDetailClient } from '@/components/events/detail/event-detail-client'
import { EventSchema } from '@/components/events/detail/event-schema'
import { fetchEventById } from '@/lib/api'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ id: string; locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params
  const event = await fetchEventById(parseInt(id))
  const t = await getTranslations({ locale, namespace: 'meta' })

  if (!event) {
    return {
      title: t('eventNotFound'),
    }
  }

  const title = event.title
  const description =
    event.description?.slice(0, 160) ||
    t('eventDescriptionTemplate', { title: event.title })
  const image = event.cover_image_url || '/hype-sticker.png'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

export default async function EventDetailPage({ params }: Props) {
  const { id, locale } = await params
  setRequestLocale(locale)

  const eventId = parseInt(id)
  const event = await fetchEventById(eventId)

  if (!event) {
    notFound()
  }

  return (
    <>
      <EventSchema event={event} />
      <EventDetailClient
        initialEvent={event}
        eventId={eventId}
      />
    </>
  )
}
