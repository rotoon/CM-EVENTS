'use client'

import { EventActions } from '@/components/events/detail/event-actions'
import { EventGallery } from '@/components/events/detail/event-gallery'
import { EventHeader } from '@/components/events/detail/event-header'
import { EventInfo } from '@/components/events/detail/event-info'
import { useEventById } from '@/hooks/use-events'
import { EventWithImages } from '@/lib/types'
import { ArrowLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

function EventLoading() {
  return (
    <main className='max-w-7xl mx-auto px-4 py-12 min-h-screen'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16'>
        <div className='lg:col-span-1 space-y-4'>
          <div className='aspect-[4/3] bg-gray-200 animate-pulse border-4 border-neo-black shadow-neo'></div>
          <div className='grid grid-cols-2 gap-4'>
            <div className='aspect-square bg-gray-200 animate-pulse border-4 border-neo-black'></div>
            <div className='aspect-square bg-gray-200 animate-pulse border-4 border-neo-black'></div>
          </div>
        </div>
        <div className='lg:col-span-1 space-y-8'>
          <div className='h-20 bg-gray-200 animate-pulse border-4 border-neo-black'></div>
          <div className='h-10 w-2/3 bg-gray-200 animate-pulse'></div>
          <div className='h-64 bg-gray-200 animate-pulse border-4 border-neo-black'></div>
        </div>
      </div>
    </main>
  )
}

function EventNotFound() {
  const t = useTranslations('eventDetail')

  return (
    <main className='max-w-7xl mx-auto px-4 py-20 text-center min-h-[60vh] flex flex-col items-center justify-center border-x-4 border-neo-black bg-white'>
      <h1 className='font-display font-black text-8xl mb-4 text-neo-black'>
        {t('notFoundTitle')}
      </h1>
      <p className='font-mono text-xl font-bold mb-8 uppercase bg-neo-pink px-4 py-1 border-2 border-neo-black rotate-2 inline-block text-white'>
        {t('notFound')}
      </p>
      <Link
        href='/'
        className='inline-flex items-center gap-2 bg-neo-lime border-4 border-neo-black px-8 py-4 font-black text-lg shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase'
      >
        <ArrowLeft className='w-6 h-6' /> {t('backToEvents')}
      </Link>
    </main>
  )
}

export function EventDetailClient({
  initialEvent,
  eventId,
}: {
  initialEvent: EventWithImages | null
  eventId: number
}) {
  const t = useTranslations('eventDetail')
  const { data: event, isLoading, error } = useEventById(eventId)

  // Use initialEvent if react-query is still loading or hasn't started
  const displayEvent = event || initialEvent

  if (isLoading && !displayEvent) {
    return <EventLoading />
  }

  if (error || !displayEvent) {
    return <EventNotFound />
  }

  const eventData = displayEvent as EventWithImages

  return (
    <div className='min-h-screen bg-[#f0f0f0] flex flex-col'>
      <div className='bg-neo-black border-y-4 border-neo-black py-4 z-30'>
        <div className='max-w-7xl mx-auto px-4 flex items-center justify-between'>
          <Link
            href='/'
            className='group inline-flex items-center gap-2 bg-white text-neo-black px-5 py-2 font-black text-sm uppercase border-2 border-neo-lime shadow-[4px_4px_0px_0px_#C4F135] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-neo-lime transition-all'
          >
            <ArrowLeft className='w-5 h-5 group-hover:-translate-x-1 transition-transform' />
            {t('backToAll')}
          </Link>
          <div className='font-mono text-xs font-bold text-neo-lime hidden md:flex items-center gap-2 tracking-widest'>
            <span className='w-3 h-3 bg-neo-pink rounded-full border border-white animate-pulse' />
            {t('headerText', { year: new Date().getFullYear() })}
          </div>
        </div>
      </div>

      <main className='max-w-7xl mx-auto px-4 py-8 lg:py-12 w-full flex-grow'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start'>
          <div className='lg:col-span-5 border-4 border-neo-black bg-white p-2 shadow-neo lg:sticky lg:top-24 self-start'>
            <EventGallery event={eventData} />
          </div>

          <div className='lg:col-span-7 space-y-4'>
            <EventHeader event={eventData} />
            <EventInfo event={eventData} />
            <EventActions event={eventData} />
          </div>
        </div>
      </main>
    </div>
  )
}
