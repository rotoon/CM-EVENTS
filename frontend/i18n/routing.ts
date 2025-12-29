import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // รายการภาษาที่รองรับ
  locales: ['th', 'en'],

  // ภาษาเริ่มต้น
  defaultLocale: 'th',

  // Locale prefix strategy - 'as-needed' จะไม่แสดง prefix สำหรับ default locale
  localePrefix: 'as-needed',
})

export type Locale = (typeof routing.locales)[number]
