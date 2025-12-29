'use client'

import { formatEventTitle } from '@/lib/date-utils'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface EventsHeaderProps {
  category?: string
  month?: string
  totalEvents: number
  children?: React.ReactNode
  overrideTitle?: string
  overrideLabel?: string
  isDark?: boolean
}

export function EventsHeader({
  category,
  month,
  totalEvents,
  children,
  overrideTitle,
  overrideLabel,
  isDark = false,
}: EventsHeaderProps) {
  const t = useTranslations('events')
  const title = overrideTitle || formatEventTitle(category, month)
  const label = overrideLabel || t('label')

  return (
    <div
      className={cn(
        'flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4',
        isDark ? 'text-white' : 'text-neo-black'
      )}
    >
      <div>
        <div className='inline-block bg-neo-pink text-white px-3 py-1 text-xs font-bold border-2 border-neo-black mb-2 rotate-[-1deg] uppercase'>
          {label}
        </div>
        <h2
          className={cn(
            'font-display font-black text-5xl md:text-6xl lg:text-7xl uppercase',
            isDark ? 'text-white' : 'text-neo-black'
          )}
        >
          {title}
        </h2>
      </div>
      <div className='flex items-center gap-4'>
        {children}
        <div
          className={cn(
            'text-sm font-bold bg-white text-neo-black px-4 py-2 border-4 border-neo-black shadow-neo hidden md:block',
            isDark
              ? 'bg-neo-white text-neo-black border-neo-white'
              : 'bg-white text-neo-black'
          )}
        >
          {t('totalCount', { count: totalEvents })}
        </div>
      </div>
    </div>
  )
}
