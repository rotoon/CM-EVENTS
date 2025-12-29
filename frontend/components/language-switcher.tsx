'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { routing, type Locale } from '@/i18n/routing'
import { Globe } from 'lucide-react'

const localeNames: Record<Locale, string> = {
  th: 'ไทย',
  en: 'EN',
}

const localeFlags: Record<Locale, string> = {
  th: '🇹🇭',
  en: '🇬🇧',
}

export function LanguageSwitcher() {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()

  const handleLocaleChange = () => {
    // สลับภาษา
    const nextLocale = locale === 'th' ? 'en' : 'th'
    router.replace(pathname, { locale: nextLocale })
  }

  const nextLocale = locale === 'th' ? 'en' : 'th'

  return (
    <button
      onClick={handleLocaleChange}
      aria-label={`Switch to ${localeNames[nextLocale]}`}
      className='
        flex items-center gap-2 px-3 py-2
        border-2 border-neo-black bg-white
        font-mono font-bold text-sm uppercase
        shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
        hover:shadow-none hover:translate-x-1 hover:translate-y-1
        hover:bg-neo-purple hover:text-white
        transition-all duration-150 cursor-pointer
      '
    >
      <Globe className='w-4 h-4' />
      <span>{localeFlags[nextLocale]}</span>
      <span>{localeNames[nextLocale]}</span>
    </button>
  )
}
