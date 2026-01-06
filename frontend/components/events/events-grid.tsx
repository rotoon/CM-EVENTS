'use client'

import { NEO_COLORS, TAG_KEYS } from '@/lib/constants'
import { Event } from '@/types'
import { CalendarDays, RefreshCw, SearchX } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { EventCardNeo } from './event-card-neo'

interface EventsGridProps {
  events: Event[]
  isDark?: boolean
}

export function EventsGrid({ events, isDark }: EventsGridProps) {
  const t = useTranslations('events')
  const tCommon = useTranslations('common')
  const tTags = useTranslations('tags')

  // Transform DB events to display format
  const displayEvents = events.map((e, i) => ({
    id: e.id,
    title: e.title,
    location: e.location || 'Chiang Mai',
    date: e.date_text || 'TBD',
    isEnded: e.is_ended,
    image:
      e.cover_image_url ||
      'https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=2670&auto=format&fit=crop',
    tag: tTags(TAG_KEYS[i % TAG_KEYS.length]),
    color: NEO_COLORS[i % NEO_COLORS.length],
    sourceUrl: e.source_url,
  }))

  return (
    <>
      {displayEvents.length === 0 ? (
        <div className='text-center flex flex-col items-center justify-center py-20 px-4 bg-white border-4 border-neo-black shadow-neo-lg rotate-[-0.5deg]'>
          <div className='w-20 h-20 bg-neo-pink border-4 border-neo-black shadow-neo flex items-center justify-center mb-6 rotate-3'>
            <SearchX className='w-10 h-10 text-white' />
          </div>
          <h3 className='font-display font-black text-4xl uppercase mb-4'>
            {t('noEventsTitle')}
          </h3>
          <p className='font-mono text-lg max-w-md mx-auto mb-8'>
            {t('noEventsDescription')}
          </p>
          <div className='flex flex-col sm:flex-row gap-4'>
            <button
              onClick={() => (window.location.href = '/')}
              className='bg-neo-lime border-4 border-neo-black px-8 py-3 font-bold shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2'
            >
              <CalendarDays className='w-5 h-5' />
              {t('viewCurrentMonth')}
            </button>
            <button
              onClick={() => window.location.reload()}
              className='bg-white border-4 border-neo-black px-8 py-3 font-bold shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2'
            >
              <RefreshCw className='w-5 h-5' />
              {tCommon('refresh')}
            </button>
          </div>
        </div>
      ) : (
        <div
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
          role='list'
          aria-label='Events List'
        >
          {displayEvents.map((event, index) => (
            <div
              key={event.id}
              role='listitem'
              className='animate-fadeIn'
              style={{ animationDelay: `${(index % 12) * 50}ms` }}
            >
              <EventCardNeo {...event} />
            </div>
          ))}
        </div>
      )}
    </>
  )
}
