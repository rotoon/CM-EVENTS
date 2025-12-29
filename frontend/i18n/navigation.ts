import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

// สร้าง navigation helpers ที่รองรับ locale
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
