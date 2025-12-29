import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  // รับ locale จาก request (จาก middleware)
  let locale = await requestLocale

  // ตรวจสอบว่า locale ถูกต้องหรือไม่ ถ้าไม่ใช้ default
  if (
    !locale ||
    !routing.locales.includes(locale as (typeof routing.locales)[number])
  ) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
