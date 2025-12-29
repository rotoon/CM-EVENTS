'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { type Locale } from '@/i18n/routing'

const localeNames: Record<Locale, string> = {
  th: 'ไทย',
  en: 'EN',
}

const localeFlags: Record<Locale, React.ReactNode> = {
  th: (
    <img
      alt='ไทย'
      src='https://purecatamphetamine.github.io/country-flag-icons/3x2/TH.svg'
    />
  ),
  en: (
    <img
      alt='English'
      src='https://purecatamphetamine.github.io/country-flag-icons/3x2/GB.svg'
    />
  ),
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
      className='flex justify-center items-center gap-2 px-3 py-2 border-2 border-neo-black bg-white font-mono font-bold text-sm uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 hover:bg-neo-purple hover:text-white transition-all duration-150 cursor-pointer'
    >
      <span className='w-6 h-6'>{localeFlags[nextLocale]}</span>
      <span>{localeNames[nextLocale]}</span>
    </button>
  )
}
