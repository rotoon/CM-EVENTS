import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Match ทุก path ยกเว้น:
  // - api routes
  // - _next (Next.js internals)
  // - static files (images, etc.)
  matcher: ['/', '/(th|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
}
