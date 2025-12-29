'use client'

import { LanguageSwitcher } from '@/components/language-switcher'
import { Link, usePathname } from '@/i18n/navigation'
import { Menu, Search, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useState } from 'react'

export function NavbarNeo() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const t = useTranslations('nav')

  const navLinks = [
    { name: t('home'), href: '/', color: 'hover:bg-neo-lime' },
    {
      name: t('gigs'),
      href: '/gigs',
      color: 'hover:bg-neo-pink hover:text-white',
    },
    {
      name: t('exhibitions'),
      href: '/exhibitions',
      color: 'hover:bg-neo-purple hover:text-white',
    },
    {
      name: t('feed'),
      href: '/search',
      color: 'hover:bg-neo-black hover:text-white',
    },
  ]

  return (
    <nav className='sticky top-0 z-50 px-4 py-4 md:py-6 backdrop-blur-sm'>
      <div className='bg-white border-4 border-neo-black shadow-neo flex justify-between items-center p-3 md:p-4 max-w-7xl mx-auto relative z-50 transform transition-transform hover:-translate-y-1'>
        {/* Logo Section */}
        <Link
          href='/'
          className='flex items-center gap-3 group'
        >
          <div className='relative w-12 h-12 md:w-14 md:h-14 transform group-hover:rotate-12 transition-transform duration-300'>
            <Image
              src='/logo.png'
              alt='HYPE CNX Logo'
              fill
              className='object-contain'
              sizes='56px'
            />
          </div>
          <h1 className='font-display font-black text-xl md:text-2xl tracking-tighter italic uppercase'>
            HYPE CNX
          </h1>
        </Link>

        {/* Desktop Links */}
        <div className='hidden md:flex items-center gap-1 group/nav'>
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`
                  px-4 py-2 font-black uppercase tracking-tight text-sm transition-all border-2 border-transparent
                  ${
                    link.color
                  } hover:border-neo-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                  ${
                    isActive
                      ? 'bg-neo-lime border-neo-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                      : ''
                  }
                `}
              >
                {link.name}
              </Link>
            )
          })}

          {/* Language Switcher */}
          <div className='ml-2'>
            <LanguageSwitcher />
          </div>
        </div>

        {/* Mobile Actions */}
        <div className='flex md:hidden items-center gap-2'>
          <LanguageSwitcher />
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            className='w-10 h-10 border-2 border-neo-black flex items-center justify-center bg-neo-lime shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1'
          >
            {isOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className='fixed inset-0 top-0 left-0 w-full h-screen bg-neo-purple/95 flex flex-col items-center justify-center z-40 md:hidden animate-fadeIn'>
          <div className='flex flex-col gap-4 w-full px-8'>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className='bg-white border-4 border-neo-black p-6 text-center font-display font-black text-3xl uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-2 active:translate-y-2'
              >
                {link.name}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className='mt-12 bg-neo-pink text-white border-4 border-neo-black p-4 rounded-full shadow-neo'
          >
            <X className='w-8 h-8' />
          </button>
        </div>
      )}
    </nav>
  )
}
