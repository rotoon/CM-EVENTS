'use client'

import { EventsContent } from '@/components/events/events-content'
import { useTranslations } from 'next-intl'

export function ExhibitionsContentClient() {
  const t = useTranslations('exhibitions')

  return (
    <div className='min-h-screen bg-white relative'>
      <div
        className='absolute inset-0 z-0 opacity-[0.05] pointer-events-none'
        style={{
          backgroundImage:
            'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className='max-w-7xl mx-auto px-4 pt-16 md:pt-24 pb-12 border-b-8 border-neo-black relative z-10'>
        <div className='flex flex-col lg:flex-row justify-between items-start gap-8'>
          <div className='flex-1'>
            <div className='inline-block bg-neo-purple text-white px-4 py-2 font-display font-black text-sm border-2 border-neo-black shadow-neo mb-6 -rotate-1'>
              {t('hashtag')}
            </div>
            <h1 className='font-black text-6xl md:text-8xl lg:text-9xl leading-tight mb-8 uppercase'>
              {t('titleLine1')} <br />
              <span
                className='text-white bg-neo-black px-4 inline-block'
                style={{ WebkitTextStroke: '2px black' }}
              >
                {t('titleLine2')}
              </span>
            </h1>
            <p className='font-bold text-xl md:text-2xl max-w-2xl border-l-8 border-neo-pink pl-6 italic'>
              {t('description')} <br />
              {t('descriptionLine2')}
            </p>
          </div>

          <div className='w-full lg:w-72 bg-white border-4 border-neo-black p-6 shadow-neo rotate-1 self-center lg:self-end'>
            <div className='text-xs font-black uppercase mb-4 border-b-2 border-neo-black pb-2'>
              {t('galleryInfo')}
            </div>
            <div className='space-y-3'>
              <div className='flex justify-between items-center text-sm font-bold'>
                <span className='opacity-60 uppercase'>{t('admission')}</span>
                <span className='text-neo-pink'>{t('admissionValue')}</span>
              </div>
              <div className='flex justify-between items-center text-sm font-bold'>
                <span className='opacity-60 uppercase'>{t('hours')}</span>
                <span>{t('hoursValue')}</span>
              </div>
              <div className='flex justify-between items-center text-sm font-bold'>
                <span className='opacity-60 uppercase'>{t('curatedBy')}</span>
                <span className='italic'>{t('curatedByValue')}</span>
              </div>
            </div>
            <div className='mt-6 flex justify-center'>
              <div className='w-12 h-12 border-2 border-neo-black bg-neo-lime rotate-12 flex items-center justify-center'>
                <span className='font-black text-[10px]'>A+</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='relative z-10'>
        <EventsContent
          category='art'
          title={t('sectionTitle')}
          overrideLabel={t('label')}
        />
      </div>
    </div>
  )
}
