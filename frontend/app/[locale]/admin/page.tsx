'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  CalendarDays,
  CheckCircle,
  Clock,
  Plus,
  ArrowRight,
  TrendingUp,
  ExternalLink,
} from 'lucide-react'
import { useAdminDashboard } from '@/hooks/use-admin'

// Color palette
const colors = {
  primary: '#2563EB',
  secondary: '#3B82F6',
  cta: '#F97316',
  background: '#F8FAFC',
  text: '#1E293B',
  textMuted: '#64748B',
  border: '#E2E8F0',
  success: '#10B981',
  warning: '#F59E0B',
}

export default function AdminDashboardPage() {
  const { data, isLoading, error, refetch } = useAdminDashboard()

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div
          className='animate-spin rounded-full h-10 w-10 border-4 border-t-transparent'
          style={{
            borderColor: `${colors.primary} transparent ${colors.primary} ${colors.primary}`,
          }}
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className='text-center py-12'>
        <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center'>
          <span className='text-2xl'>⚠️</span>
        </div>
        <p className='text-red-600 mb-4'>{error.message}</p>
        <Button
          onClick={() => refetch()}
          style={{ backgroundColor: colors.primary }}
        >
          ลองใหม่
        </Button>
      </div>
    )
  }

  const stats = data?.stats
  const recentEvents = data?.recentEvents || []

  const statCards = [
    {
      title: 'Events ทั้งหมด',
      value: stats?.total || 0,
      icon: CalendarDays,
      color: colors.primary,
      bgColor: `${colors.primary}10`,
    },
    {
      title: 'พร้อมแสดง',
      value: stats?.fullyScraped || 0,
      icon: CheckCircle,
      color: colors.success,
      bgColor: `${colors.success}10`,
    },
    {
      title: 'รอดำเนินการ',
      value: stats?.pending || 0,
      icon: Clock,
      color: colors.warning,
      bgColor: `${colors.warning}10`,
    },
  ]

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1
            className='text-2xl font-bold'
            style={{ color: colors.text }}
          >
            แดชบอร์ด
          </h1>
          <p style={{ color: colors.textMuted }}>ภาพรวมระบบ HYPE CNX</p>
        </div>
        <Link href='/admin/events/new'>
          <Button
            className='gap-2 h-11 px-5 rounded-xl font-medium transition-all cursor-pointer'
            style={{
              backgroundColor: colors.cta,
              boxShadow: `0 4px 14px ${colors.cta}40`,
            }}
          >
            <Plus size={18} />
            เพิ่ม Event ใหม่
          </Button>
        </Link>
      </div>

      {/* Bento Grid Stats */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        {statCards.map((stat, index) => (
          <div
            key={stat.title}
            className='rounded-2xl p-6 transition-all duration-200 hover:shadow-lg cursor-pointer group'
            style={{
              backgroundColor: '#FFFFFF',
              border: `1px solid ${colors.border}`,
            }}
          >
            <div className='flex items-start justify-between'>
              <div>
                <p
                  className='text-sm font-medium'
                  style={{ color: colors.textMuted }}
                >
                  {stat.title}
                </p>
                <p
                  className='text-3xl font-bold mt-2'
                  style={{ color: colors.text }}
                >
                  {stat.value.toLocaleString()}
                </p>
              </div>
              <div
                className='p-3 rounded-xl transition-transform group-hover:scale-110'
                style={{ backgroundColor: stat.bgColor }}
              >
                <stat.icon
                  size={24}
                  style={{ color: stat.color }}
                />
              </div>
            </div>
            <div
              className='mt-4 flex items-center gap-1 text-sm'
              style={{ color: colors.success }}
            >
              <TrendingUp size={14} />
              <span>อัพเดทล่าสุด</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Events Card */}
      <div
        className='rounded-2xl overflow-hidden'
        style={{
          backgroundColor: '#FFFFFF',
          border: `1px solid ${colors.border}`,
        }}
      >
        <div
          className='flex items-center justify-between p-6'
          style={{ borderBottom: `1px solid ${colors.border}` }}
        >
          <div>
            <h2
              className='text-lg font-semibold'
              style={{ color: colors.text }}
            >
              Events ล่าสุด
            </h2>
            <p
              className='text-sm'
              style={{ color: colors.textMuted }}
            >
              รายการ Events ที่อัพเดทล่าสุด
            </p>
          </div>
          <Link href='/admin/events'>
            <Button
              variant='ghost'
              className='gap-2 rounded-lg hover:bg-gray-50 cursor-pointer'
              style={{ color: colors.primary }}
            >
              ดูทั้งหมด
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>

        <div className='p-6'>
          {recentEvents.length === 0 ? (
            <div className='text-center py-12'>
              <div
                className='w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center'
                style={{ backgroundColor: `${colors.primary}10` }}
              >
                <CalendarDays
                  size={24}
                  style={{ color: colors.primary }}
                />
              </div>
              <p style={{ color: colors.textMuted }}>ยังไม่มี Events</p>
              <Link href='/admin/events/new'>
                <Button
                  className='mt-4 cursor-pointer'
                  style={{ backgroundColor: colors.primary }}
                >
                  เพิ่ม Event แรก
                </Button>
              </Link>
            </div>
          ) : (
            <div className='space-y-3'>
              {recentEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/admin/events/${event.id}/edit`}
                  className='flex items-center gap-4 p-4 rounded-xl transition-all duration-200 hover:bg-gray-50 group cursor-pointer'
                  style={{ border: `1px solid ${colors.border}` }}
                >
                  <div
                    className='w-14 h-14 rounded-xl overflow-hidden flex-shrink-0'
                    style={{ backgroundColor: `${colors.primary}10` }}
                  >
                    {event.cover_image_url ? (
                      <img
                        src={event.cover_image_url}
                        alt={event.title}
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center'>
                        <CalendarDays
                          size={20}
                          style={{ color: colors.primary }}
                        />
                      </div>
                    )}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <h3
                      className='font-medium truncate group-hover:text-blue-600 transition-colors'
                      style={{ color: colors.text }}
                    >
                      {event.title}
                    </h3>
                    <p
                      className='text-sm truncate'
                      style={{ color: colors.textMuted }}
                    >
                      {event.location || 'ไม่ระบุสถานที่'}
                    </p>
                    {event.date_text && (
                      <p
                        className='text-xs mt-1'
                        style={{ color: colors.textMuted }}
                      >
                        {event.date_text}
                      </p>
                    )}
                  </div>
                  <ExternalLink
                    size={18}
                    className='opacity-0 group-hover:opacity-100 transition-opacity'
                    style={{ color: colors.textMuted }}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
