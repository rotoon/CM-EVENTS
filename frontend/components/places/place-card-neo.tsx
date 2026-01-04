'use client'

import type { Place } from '@/lib/api-places'
import { cn } from '@/lib/utils'
import { ExternalLink, Heart, MessageCircle } from 'lucide-react'
import Link from 'next/link'

// Place Type → Neo-Brutalist color scheme
const TYPE_STYLES: Record<string, { bg: string; text: string; emoji: string }> =
  {
    Cafe: { bg: 'bg-neo-purple', text: 'text-white', emoji: '☕' },
    Food: { bg: 'bg-neo-pink', text: 'text-white', emoji: '🍜' },
    Restaurant: { bg: 'bg-neo-lime', text: 'text-black', emoji: '🍽️' },
    Travel: { bg: 'bg-neo-cyan', text: 'text-black', emoji: '🌿' },
    'Bar/Nightlife': {
      bg: 'bg-neo-black',
      text: 'text-white',
      emoji: '🍸',
    },
  }

interface PlaceCardProps {
  place: Place
  variant?: 'default' | 'featured'
}

// Sticker Mapping (from Plan Page)
const PLACE_TYPE_STICKERS: Record<string, string> = {
  Cafe: 'cafe',
  Food: 'food',
  Restaurant: 'food',
  Travel: 'nature',
  'Bar/Nightlife': 'nightlife',
  Shopping: 'shopping',
  Art: 'art',
}

export function PlaceCard({ place, variant = 'default' }: PlaceCardProps) {
  const typeStyle = TYPE_STYLES[place.place_type] || {
    bg: 'bg-white',
    text: 'text-black',
    emoji: '📍',
  }

  // Determine Image Source
  // Priority: 1. Cover Image -> 2. Category Sticker -> 3. Fallback Placeholder
  const stickerKey = PLACE_TYPE_STICKERS[place.place_type] || 'culture'
  const stickerImage = `/stickers/${stickerKey}.png`

  // Logic: Use Sticker if no cover image, OR if user wants category images effectively
  // User asked: "show category image INSTEAD" (taken as: if no cover, show category. Or maybe replace placeholder)
  const displayImage = place.cover_image_url || stickerImage

  // Truncate description
  const truncatedDescription = place.description
    ? place.description
        .replace(/\. ❥.*/, '')
        .slice(0, 100)
        .trim() + '...'
    : null

  const isFeatured = variant === 'featured'

  return (
    <Link
      href={`/places/${place.id}`}
      className={cn(
        'group relative block overflow-hidden cursor-pointer h-full',
        'bg-white border-4 border-neo-black',
        'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]',
        'transition-all duration-200 ease-out',
        isFeatured && 'md:col-span-2 md:row-span-2'
      )}
    >
      {/* Image Section */}
      <div
        className={cn(
          'relative w-full aspect-[4/3] border-b-4 border-neo-black overflow-hidden',
          !place.cover_image_url
            ? 'bg-neo-black/5 p-8 flex items-center justify-center'
            : 'bg-gray-100'
        )}
      >
        <img
          src={displayImage}
          alt={place.name}
          className={cn(
            'transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1',
            place.cover_image_url
              ? 'w-full h-full object-cover'
              : 'w-full h-full object-contain filter drop-shadow-xl'
          )}
        />

        {/* Type Badge (Floating) */}
        <div className='absolute top-3 left-3 z-10'>
          <span
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1 text-sm font-bold uppercase',
              'border-2 border-neo-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
              typeStyle.bg,
              typeStyle.text
            )}
          >
            <span>{typeStyle.emoji}</span>
            {place.place_type}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className={cn('p-5 flex flex-col', isFeatured && 'p-8')}>
        {/* Place Name */}
        <h3
          className={cn(
            'font-display font-black leading-[0.9] mb-3 uppercase',
            'text-neo-black group-hover:text-neo-pink transition-colors',
            isFeatured ? 'text-4xl md:text-5xl' : 'text-2xl'
          )}
        >
          {place.name}
        </h3>

        {/* Description (featured only or truncated) */}
        {truncatedDescription && (
          <p
            className={cn(
              'font-mono text-gray-600 text-sm leading-relaxed mb-6 border-l-4 border-neo-lime pl-3',
              isFeatured ? 'line-clamp-4 text-base' : 'line-clamp-3'
            )}
          >
            {truncatedDescription}
          </p>
        )}

        {/* Categories as brutalist tags */}
        {place.category_names && place.category_names.length > 0 && (
          <div className='flex flex-wrap gap-2 mt-auto'>
            {place.category_names.slice(0, isFeatured ? 6 : 3).map((cat) => (
              <span
                key={cat}
                className='text-[10px] font-bold text-black uppercase tracking-wider bg-gray-100 border border-neo-black px-2 py-0.5 hover:bg-neo-lime hover:border-black transition-colors'
              >
                #{cat}
              </span>
            ))}
            {place.category_names.length > (isFeatured ? 6 : 3) && (
              <span className='text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-0.5'>
                +{place.category_names.length - (isFeatured ? 6 : 3)}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
