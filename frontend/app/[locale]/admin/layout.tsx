'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  CalendarDays,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AdminLayoutProps {
  children: React.ReactNode
}

// Color palette from UI/UX Pro Max
const colors = {
  primary: '#2563EB',
  primaryHover: '#1D4ED8',
  secondary: '#3B82F6',
  cta: '#F97316',
  background: '#F8FAFC',
  sidebar: '#FFFFFF',
  text: '#1E293B',
  textMuted: '#64748B',
  border: '#E2E8F0',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token && !pathname.includes('/admin/login')) {
      router.push('/admin/login')
    } else if (token) {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [pathname, router])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    router.push('/admin/login')
  }

  // Show login page without layout
  if (pathname.includes('/admin/login')) {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div
        className='min-h-screen flex items-center justify-center'
        style={{ backgroundColor: colors.background }}
      >
        <div
          className='animate-spin rounded-full h-10 w-10 border-4 border-t-transparent'
          style={{
            borderColor: `${colors.primary} transparent ${colors.primary} ${colors.primary}`,
          }}
        />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const navItems = [
    { href: '/admin', label: 'แดชบอร์ด', icon: LayoutDashboard },
    { href: '/admin/events', label: 'จัดการ Events', icon: CalendarDays },
  ]

  return (
    <div
      className='min-h-screen'
      style={{ backgroundColor: colors.background }}
    >
      {/* Mobile Header */}
      <div
        className='lg:hidden sticky top-0 z-50 px-4 py-3 flex items-center justify-between shadow-sm'
        style={{
          backgroundColor: colors.sidebar,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div className='flex items-center gap-3'>
          <div
            className='w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white'
            style={{ backgroundColor: colors.primary }}
          >
            H
          </div>
          <span
            className='font-semibold'
            style={{ color: colors.text }}
          >
            HYPE CNX
          </span>
        </div>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className='hover:bg-gray-100'
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      <div className='flex'>
        {/* Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
            lg:relative lg:translate-x-0 shadow-xl lg:shadow-none
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
          style={{
            backgroundColor: colors.sidebar,
            borderRight: `1px solid ${colors.border}`,
          }}
        >
          {/* Logo */}
          <div
            className='p-6 hidden lg:block'
            style={{ borderBottom: `1px solid ${colors.border}` }}
          >
            <div className='flex items-center gap-3'>
              <div
                className='w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg'
                style={{
                  backgroundColor: colors.primary,
                  boxShadow: `0 4px 14px ${colors.primary}40`,
                }}
              >
                H
              </div>
              <div>
                <h1
                  className='font-bold text-lg'
                  style={{ color: colors.text }}
                >
                  HYPE CNX
                </h1>
                <p
                  className='text-xs'
                  style={{ color: colors.textMuted }}
                >
                  Admin Panel
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className='p-4 space-y-1'>
            <p
              className='text-xs font-medium uppercase tracking-wider px-3 py-2'
              style={{ color: colors.textMuted }}
            >
              เมนูหลัก
            </p>
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/admin' && pathname.startsWith(item.href))

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                    ${isActive ? 'font-medium' : 'hover:bg-gray-50'}
                  `}
                  style={{
                    backgroundColor: isActive
                      ? `${colors.primary}10`
                      : 'transparent',
                    color: isActive ? colors.primary : colors.textMuted,
                  }}
                >
                  <item.icon
                    size={20}
                    style={{
                      color: isActive ? colors.primary : colors.textMuted,
                    }}
                  />
                  <span className='flex-1'>{item.label}</span>
                  {isActive && (
                    <ChevronRight
                      size={16}
                      style={{ color: colors.primary }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div
            className='absolute bottom-0 left-0 right-0 p-4'
            style={{ borderTop: `1px solid ${colors.border}` }}
          >
            <button
              onClick={handleLogout}
              className='w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-red-50 group cursor-pointer'
              style={{ color: colors.textMuted }}
            >
              <LogOut
                size={20}
                className='group-hover:text-red-500 transition-colors'
              />
              <span className='group-hover:text-red-500 transition-colors'>
                ออกจากระบบ
              </span>
            </button>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className='fixed inset-0 bg-black/30 z-40 lg:hidden backdrop-blur-sm'
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className='flex-1 p-4 lg:p-8 min-h-screen'>
          <div className='max-w-7xl mx-auto'>{children}</div>
        </main>
      </div>
    </div>
  )
}
