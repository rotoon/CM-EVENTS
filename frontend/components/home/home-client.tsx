'use client'

import { CategoryFilter } from '@/components/category-filter'
import { EventsContent } from '@/components/events/events-content'
import { HeroSection } from '@/components/hero-section'
import { useRouter, useSearchParams } from 'next/navigation'

import { Event } from '@/lib/types'

interface HomeClientProps {
  heroEvent?: Event
}

export function HomeClient({ heroEvent }: HomeClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const category = searchParams.get('category') || undefined
  const month = searchParams.get('month') || undefined

  const currentMonth = new Date().toISOString().slice(0, 7)

  const effectiveMonth = month ?? currentMonth

  return (
    <>
      <HeroSection event={heroEvent} />
      <CategoryFilter
        activeCategory={category}
        activeMonth={effectiveMonth}
      />
      <EventsContent
        category={category}
        month={effectiveMonth}
      />
    </>
  )
}
