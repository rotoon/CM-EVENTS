import { fetchPlaceById } from '@/lib/api-places'
import { cn } from '@/lib/utils'
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Heart,
  Instagram,
  MapPin,
  MessageCircle,
} from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// Place Type → Neo-Brutalist color scheme
const TYPE_STYLES: Record<string, { bg: string; text: string }> = {
  Cafe: { bg: 'bg-neo-purple', text: 'text-white' },
  Food: { bg: 'bg-neo-pink', text: 'text-white' },
  Restaurant: { bg: 'bg-neo-lime', text: 'text-black' },
  Travel: { bg: 'bg-neo-cyan', text: 'text-black' },
  'Bar/Nightlife': {
    bg: 'bg-neo-black',
    text: 'text-white',
  },
}

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params
  const place = await fetchPlaceById(parseInt(id))

  if (!place) {
    return { title: 'ไม่พบร้าน | Hype CNX' }
  }

  return {
    title: `${place.name} | ${place.place_type} | Hype CNX`,
    description:
      place.description?.slice(0, 160) ||
      `${place.name} - ${place.place_type} ในเชียงใหม่`,
    openGraph: {
      title: `${place.name} | Hype CNX`,
      description:
        place.description?.slice(0, 160) ||
        `${place.name} - ${place.place_type} ในเชียงใหม่`,
      type: 'article',
    },
  }
}

export default async function PlaceDetailPage({ params }: PageProps) {
  const { id } = await params
  const place = await fetchPlaceById(parseInt(id))

  if (!place) {
    notFound()
  }

  const typeStyle = TYPE_STYLES[place.place_type] || {
    bg: 'bg-white',
    text: 'text-black',
  }

  // Format date
  const postDate = place.post_date
    ? new Date(place.post_date).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <main className='min-h-screen bg-neo-black text-white relative overflow-hidden'>
      {/* Noise Texture Overlay */}
      <div
        className='fixed inset-0 z-0 pointer-events-none opacity-20'
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Back Navigation */}
      <div className='sticky top-0 z-50 bg-neo-black/80 backdrop-blur-md border-b-4 border-neo-black'>
        <div className='max-w-7xl mx-auto px-4 py-4'>
          <Link
            href='/places'
            className='inline-flex items-center gap-2 text-sm font-bold uppercase text-white hover:text-neo-lime transition-colors'
          >
            <ArrowLeft className='w-5 h-5' />
            BACK TO PLACES
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className='relative z-10 pt-8 pb-12'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='grid lg:grid-cols-2 gap-12 items-start'>
            {/* Left: Info */}
            <div className='space-y-6'>
              {/* Type Badge */}
              <span
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-1.5 text-base font-black uppercase tracking-wide',
                  'border-2 border-neo-lime shadow-[4px_4px_0px_0px_#ccff00]',
                  typeStyle.bg,
                  typeStyle.text
                )}
              >
                {place.place_type}
              </span>

              {/* Place Name */}
              <h1 className='text-5xl md:text-6xl lg:text-7xl font-display font-black text-white uppercase italic tracking-tighter leading-none [text-shadow:_4px_4px_0_rgb(0_0_0)]'>
                {place.name}
              </h1>

              {/* Stats */}
              <div className='flex flex-wrap gap-4'>
                {place.likes !== null && place.likes > 0 && (
                  <div className='inline-flex items-center gap-2 px-4 py-3 bg-white border-2 border-neo-black shadow-[4px_4px_0px_0px_#ccff00] text-black'>
                    <Heart className='w-5 h-5 fill-neo-pink text-black' />
                    <span className='font-mono font-bold'>
                      {place.likes >= 1000
                        ? `${(place.likes / 1000).toFixed(1)}k`
                        : place.likes}{' '}
                      LIKES
                    </span>
                  </div>
                )}
                {place.comments !== null && place.comments > 0 && (
                  <div className='inline-flex items-center gap-2 px-4 py-3 bg-white border-2 border-neo-black shadow-[4px_4px_0px_0px_#00ffff] text-black'>
                    <MessageCircle className='w-5 h-5 fill-neo-cyan text-black' />
                    <span className='font-mono font-bold'>
                      {place.comments} COMMENTS
                    </span>
                  </div>
                )}
                {postDate && (
                  <div className='inline-flex items-center gap-2 px-4 py-3 bg-white border-2 border-neo-black shadow-[4px_4px_0px_0px_#d946ef] text-black'>
                    <Calendar className='w-5 h-5 text-black' />
                    <span className='font-mono font-bold'>{postDate}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Actions / Quick Links */}
            <div className='flex flex-col gap-4 lg:items-end'>
              <div className='bg-white border-4 border-neo-black shadow-[8px_8px_0px_0px_#ccff00] p-6 max-w-sm w-full rotate-2 hover:rotate-0 transition-transform duration-300'>
                <h3 className='font-display font-black text-2xl text-black uppercase mb-4 italic'>
                  QUICK LINKS
                </h3>
                <div className='space-y-3'>
                  {/* Instagram */}
                  {place.instagram_url && (
                    <a
                      href={place.instagram_url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center gap-3 w-full px-5 py-4 bg-neo-pink border-2 border-neo-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all text-white font-bold uppercase'
                    >
                      <Instagram className='w-5 h-5' />
                      VIEW ON INSTAGRAM
                      <ExternalLink className='w-4 h-4 ml-auto' />
                    </a>
                  )}

                  {/* Google Maps */}
                  {place.google_maps_url ? (
                    <a
                      href={place.google_maps_url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center gap-3 w-full px-5 py-4 bg-neo-lime border-2 border-neo-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all text-black font-bold uppercase'
                    >
                      <MapPin className='w-5 h-5' />
                      OPEN MAPS
                      <ExternalLink className='w-4 h-4 ml-auto' />
                    </a>
                  ) : (
                    <a
                      href={`https://www.google.com/maps/search/${encodeURIComponent(
                        place.name + ' เชียงใหม่'
                      )}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center gap-3 w-full px-5 py-4 bg-neo-cyan border-2 border-neo-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all text-black font-bold uppercase'
                    >
                      <MapPin className='w-5 h-5' />
                      SEARCH MAPS
                      <ExternalLink className='w-4 h-4 ml-auto' />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className='relative z-10 pb-20'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='bg-white border-4 border-neo-black shadow-[12px_12px_0px_0px_#ffffff] p-6 md:p-10 max-w-4xl mx-auto'>
            {/* Description */}
            {place.description && (
              <div className='mb-10'>
                <h2 className='font-display font-black text-3xl text-black uppercase mb-6 flex items-center gap-3'>
                  <span className='w-4 h-4 bg-neo-lime border-2 border-neo-black'></span>
                  DETAILS
                </h2>
                <div className='font-mono text-lg text-gray-800 leading-relaxed whitespace-pre-wrap border-l-4 border-neo-lime pl-6'>
                  {place.description}
                </div>
              </div>
            )}

            {/* Categories */}
            {place.category_names && place.category_names.length > 0 && (
              <div>
                <h2 className='font-display font-black text-3xl text-black uppercase mb-6 flex items-center gap-3'>
                  <span className='w-4 h-4 bg-neo-pink border-2 border-neo-black'></span>
                  TAGS
                </h2>
                <div className='flex flex-wrap gap-3'>
                  {place.category_names.map((cat) => (
                    <Link
                      key={cat}
                      href={`/places?category=${cat}`}
                      className='px-4 py-2 text-sm font-bold uppercase tracking-wider bg-neo-black text-white border-2 border-transparent hover:bg-neo-lime hover:text-black hover:border-neo-black hover:-translate-y-1 transition-all'
                    >
                      #{cat}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Credit */}
            <div className='mt-12 pt-6 border-t-4 border-gray-100 flex items-center justify-between flex-wrap gap-4'>
              <p className='font-mono text-sm text-gray-500'>
                DATA CURATED BY{' '}
                <a
                  href='https://www.instagram.com/newbie.cnx/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='font-bold text-black hover:text-neo-pink hover:underline'
                >
                  @NEWBIE.CNX
                </a>
              </p>
              <div className='flex gap-2'>
                <div className='w-3 h-3 bg-neo-lime border border-neo-black'></div>
                <div className='w-3 h-3 bg-neo-pink border border-neo-black'></div>
                <div className='w-3 h-3 bg-neo-cyan border border-neo-black'></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
