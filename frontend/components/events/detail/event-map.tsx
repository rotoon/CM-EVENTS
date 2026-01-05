'use client'

import { Event } from '@/types'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useTranslations } from 'next-intl'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

// Fix Leaflet marker icon issue in Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

interface EventMapProps {
  event: Event
}

export default function EventMap({ event }: EventMapProps) {
  const t = useTranslations('eventDetail')

  // SSR-safe check: only render map on client
  if (typeof window === 'undefined' || !event.latitude || !event.longitude) {
    return null
  }

  const position: [number, number] = [event.latitude, event.longitude]

  return (
    <div className='relative w-full h-[300px] border-4 border-neo-black shadow-neo overflow-hidden group'>
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={false}
        className='w-full h-full z-0'
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <Marker
          position={position}
          icon={icon}
        >
          <Popup className='font-sans font-bold text-sm'>
            {event.location}
          </Popup>
        </Marker>
      </MapContainer>

      {/* Neo-Brutalist Map Sticker */}
      <a
        href={
          event.google_maps_url ||
          `https://www.google.com/maps/search/?api=1&query=${event.latitude},${event.longitude}`
        }
        target='_blank'
        rel='noopener noreferrer'
        className='absolute bottom-4 right-4 z-[9999] bg-neo-lime text-black border-2 border-neo-black px-4 py-2 font-black text-xs uppercase shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2'
      >
        {t('openInMaps')}
      </a>
    </div>
  )
}
