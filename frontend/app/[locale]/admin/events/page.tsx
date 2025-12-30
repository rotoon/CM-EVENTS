'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  AlertTriangle,
} from 'lucide-react'
import { useAdminEvents, useDeleteEvent } from '@/hooks/use-admin'

// Color palette
const colors = {
  primary: '#2563EB',
  cta: '#F97316',
  text: '#1E293B',
  textMuted: '#64748B',
  border: '#E2E8F0',
  danger: '#EF4444',
}

interface EventForList {
  id: number
  title: string
  location: string | null
  cover_image_url: string | null
  date_text: string | null
  is_ended: boolean | null
}

export default function AdminEventsPage() {
  const [search, setSearch] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [offset, setOffset] = useState(0)
  const limit = 20

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    event: EventForList | null
  }>({
    open: false,
    event: null,
  })

  const { data, isLoading } = useAdminEvents(
    offset,
    limit,
    searchQuery || undefined
  )
  const deleteMutation = useDeleteEvent()

  const events = (data?.events || []) as EventForList[]
  const pagination = data?.pagination || {
    total: 0,
    limit,
    offset,
    hasMore: false,
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setOffset(0)
    setSearchQuery(search)
  }

  const handleDelete = async () => {
    if (!deleteDialog.event) return

    deleteMutation.mutate(deleteDialog.event.id, {
      onSuccess: () => {
        setDeleteDialog({ open: false, event: null })
      },
    })
  }

  const currentPage = Math.floor(offset / limit) + 1
  const totalPages = Math.ceil(pagination.total / limit)

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1
            className='text-2xl font-bold'
            style={{ color: colors.text }}
          >
            จัดการ Events
          </h1>
          <p style={{ color: colors.textMuted }}>
            รายการ Events ทั้งหมด {pagination.total.toLocaleString()} รายการ
          </p>
        </div>
        <Link href='/admin/events/new'>
          <Button
            className='gap-2 h-11 px-5 rounded-xl font-medium cursor-pointer'
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

      {/* Search */}
      <div
        className='rounded-2xl p-4'
        style={{
          backgroundColor: '#FFFFFF',
          border: `1px solid ${colors.border}`,
        }}
      >
        <form
          onSubmit={handleSearch}
          className='flex gap-3'
        >
          <div className='relative flex-1'>
            <Search
              className='absolute left-4 top-1/2 -translate-y-1/2'
              size={18}
              style={{ color: colors.textMuted }}
            />
            <Input
              placeholder='ค้นหา Events...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='pl-11 h-11 rounded-xl border-2'
              style={{ borderColor: colors.border }}
            />
          </div>
          <Button
            type='submit'
            className='h-11 px-6 rounded-xl cursor-pointer'
            style={{ backgroundColor: colors.primary }}
          >
            ค้นหา
          </Button>
        </form>
      </div>

      {/* Table */}
      <div
        className='rounded-2xl overflow-hidden'
        style={{
          backgroundColor: '#FFFFFF',
          border: `1px solid ${colors.border}`,
        }}
      >
        {isLoading ? (
          <div className='flex items-center justify-center py-16'>
            <div
              className='animate-spin rounded-full h-10 w-10 border-4 border-t-transparent'
              style={{
                borderColor: `${colors.primary} transparent ${colors.primary} ${colors.primary}`,
              }}
            />
          </div>
        ) : events.length === 0 ? (
          <div className='text-center py-16'>
            <div
              className='w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center'
              style={{ backgroundColor: `${colors.primary}10` }}
            >
              <CalendarDays
                size={24}
                style={{ color: colors.primary }}
              />
            </div>
            <p style={{ color: colors.textMuted }}>ไม่พบ Events</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow style={{ backgroundColor: '#F8FAFC' }}>
                <TableHead
                  className='w-[100px] py-4 px-6 font-semibold text-sm'
                  style={{ color: colors.text }}
                >
                  รูป
                </TableHead>
                <TableHead
                  className='py-4 px-4 font-semibold text-sm w-[50px]'
                  style={{ color: colors.text }}
                >
                  ชื่อ Event
                </TableHead>
                <TableHead
                  className='hidden md:table-cell py-4 px-4 font-semibold text-sm min-w-[180px]'
                  style={{ color: colors.text }}
                >
                  สถานที่
                </TableHead>
                <TableHead
                  className='hidden lg:table-cell py-4 px-4 font-semibold text-sm min-w-[150px]'
                  style={{ color: colors.text }}
                >
                  วันที่
                </TableHead>
                <TableHead
                  className='w-[120px] py-4 px-4 font-semibold text-sm text-center'
                  style={{ color: colors.text }}
                >
                  จัดการ
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow
                  key={event.id}
                  className='hover:bg-blue-50/50 transition-colors cursor-pointer border-b'
                  style={{ borderColor: colors.border }}
                >
                  <TableCell className='py-4 px-6'>
                    <div
                      className='w-16 h-16 rounded-xl overflow-hidden shadow-sm'
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
                            size={24}
                            style={{ color: colors.primary }}
                          />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className='py-4 px-4'>
                    <div
                      className='font-semibold text-base line-clamp-2 mb-1 max-w-[400px] truncate'
                      style={{ color: colors.text }}
                    >
                      {event.title}
                    </div>
                    {event.is_ended && (
                      <span
                        className='inline-block text-xs px-2.5 py-1 rounded-full font-medium mt-1'
                        style={{
                          backgroundColor: '#FEE2E2',
                          color: colors.danger,
                        }}
                      >
                        จบแล้ว
                      </span>
                    )}
                  </TableCell>
                  <TableCell
                    className='hidden md:table-cell py-4 px-4 text-sm'
                    style={{ color: colors.textMuted }}
                  >
                    {event.location || '-'}
                  </TableCell>
                  <TableCell
                    className='hidden lg:table-cell py-4 px-4 text-sm'
                    style={{ color: colors.textMuted }}
                  >
                    {event.date_text || '-'}
                  </TableCell>
                  <TableCell className='py-4 px-4'>
                    <div className='flex gap-2 justify-center'>
                      <Link href={`/admin/events/${event.id}/edit`}>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-10 w-10 rounded-xl hover:bg-blue-100 cursor-pointer transition-all'
                        >
                          <Pencil
                            size={18}
                            style={{ color: colors.primary }}
                          />
                        </Button>
                      </Link>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-10 w-10 rounded-xl hover:bg-red-100 cursor-pointer transition-all'
                        onClick={() => setDeleteDialog({ open: true, event })}
                      >
                        <Trash2
                          size={18}
                          style={{ color: colors.danger }}
                        />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className='flex items-center justify-between p-4'
            style={{ borderTop: `1px solid ${colors.border}` }}
          >
            <p
              className='text-sm'
              style={{ color: colors.textMuted }}
            >
              หน้า {currentPage} จาก {totalPages}
            </p>
            <div className='flex gap-2'>
              <Button
                variant='outline'
                size='sm'
                className='rounded-lg cursor-pointer'
                disabled={offset === 0}
                onClick={() => setOffset(offset - limit)}
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                variant='outline'
                size='sm'
                className='rounded-lg cursor-pointer'
                disabled={!pagination.hasMore}
                onClick={() => setOffset(offset + limit)}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, event: null })}
      >
        <DialogContent className='rounded-2xl'>
          <DialogHeader>
            <div className='flex items-center gap-3'>
              <div
                className='w-12 h-12 rounded-full flex items-center justify-center'
                style={{ backgroundColor: '#FEE2E2' }}
              >
                <AlertTriangle
                  size={24}
                  style={{ color: colors.danger }}
                />
              </div>
              <div>
                <DialogTitle style={{ color: colors.text }}>
                  ยืนยันการลบ
                </DialogTitle>
                <DialogDescription style={{ color: colors.textMuted }}>
                  การกระทำนี้ไม่สามารถย้อนกลับได้
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <p
            className='py-4'
            style={{ color: colors.text }}
          >
            คุณต้องการลบ <strong>"{deleteDialog.event?.title}"</strong>{' '}
            ใช่หรือไม่?
          </p>
          <DialogFooter className='gap-2'>
            <Button
              variant='outline'
              className='rounded-lg cursor-pointer'
              onClick={() => setDeleteDialog({ open: false, event: null })}
            >
              ยกเลิก
            </Button>
            <Button
              className='rounded-lg cursor-pointer'
              style={{ backgroundColor: colors.danger }}
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'กำลังลบ...' : 'ลบ'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
