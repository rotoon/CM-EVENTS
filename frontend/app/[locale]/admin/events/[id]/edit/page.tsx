'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useAdminEvent, useUpdateEvent } from '@/hooks/use-admin'
import { EventFormData } from '@/lib/admin-api'

export default function EditEventPage() {
  const router = useRouter()
  const params = useParams()
  const eventId = parseInt(params.id as string)

  const { data: event, isLoading, error } = useAdminEvent(eventId)
  const updateMutation = useUpdateEvent(eventId)

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    location: '',
    date_text: '',
    time_text: '',
    cover_image_url: '',
    latitude: '',
    longitude: '',
    google_maps_url: '',
    facebook_url: '',
    is_ended: false,
  })

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        location: event.location || '',
        date_text: event.date_text || '',
        time_text: event.time_text || '',
        cover_image_url: event.cover_image_url || '',
        latitude: event.latitude?.toString() || '',
        longitude: event.longitude?.toString() || '',
        google_maps_url: event.google_maps_url || '',
        facebook_url: event.facebook_url || '',
        is_ended: Boolean(event.is_ended),
      })
    }
  }, [event])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    updateMutation.mutate(formData, {
      onSuccess: () => {
        router.push('/admin/events')
      },
    })
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900' />
      </div>
    )
  }

  if (error) {
    return (
      <div className='text-center py-12'>
        <p className='text-red-600'>{error.message}</p>
        <Link href='/admin/events'>
          <Button className='mt-4'>กลับ</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Link href='/admin/events'>
          <Button
            variant='ghost'
            size='icon'
          >
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className='text-2xl font-bold'>แก้ไข Event</h1>
          <p className='text-gray-500'>ID: {eventId}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Main Info */}
          <div className='lg:col-span-2 space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>ข้อมูลหลัก</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='title'>ชื่อ Event *</Label>
                  <Input
                    id='title'
                    name='title'
                    value={formData.title}
                    onChange={handleChange}
                    placeholder='ชื่อ Event'
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='description'>รายละเอียด</Label>
                  <Textarea
                    id='description'
                    name='description'
                    value={formData.description}
                    onChange={handleChange}
                    placeholder='รายละเอียด Event'
                    rows={5}
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='date_text'>วันที่</Label>
                    <Input
                      id='date_text'
                      name='date_text'
                      value={formData.date_text}
                      onChange={handleChange}
                      placeholder='เช่น 1-31 มกราคม 2568'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='time_text'>เวลา</Label>
                    <Input
                      id='time_text'
                      name='time_text'
                      value={formData.time_text}
                      onChange={handleChange}
                      placeholder='เช่น 10:00 - 22:00'
                    />
                  </div>
                </div>

                <div className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    id='is_ended'
                    name='is_ended'
                    checked={formData.is_ended}
                    onChange={handleChange}
                    className='rounded'
                  />
                  <Label htmlFor='is_ended'>Event จบแล้ว</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>สถานที่</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='location'>ชื่อสถานที่</Label>
                  <Input
                    id='location'
                    name='location'
                    value={formData.location}
                    onChange={handleChange}
                    placeholder='เช่น One Nimman, Chiang Mai'
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='latitude'>Latitude</Label>
                    <Input
                      id='latitude'
                      name='latitude'
                      type='number'
                      step='any'
                      value={formData.latitude}
                      onChange={handleChange}
                      placeholder='18.7883'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='longitude'>Longitude</Label>
                    <Input
                      id='longitude'
                      name='longitude'
                      type='number'
                      step='any'
                      value={formData.longitude}
                      onChange={handleChange}
                      placeholder='98.9853'
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='google_maps_url'>Google Maps URL</Label>
                  <Input
                    id='google_maps_url'
                    name='google_maps_url'
                    value={formData.google_maps_url}
                    onChange={handleChange}
                    placeholder='https://maps.google.com/...'
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>รูปภาพ</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='cover_image_url'>URL รูปปก</Label>
                  <Input
                    id='cover_image_url'
                    name='cover_image_url'
                    value={formData.cover_image_url}
                    onChange={handleChange}
                    placeholder='https://...'
                  />
                </div>
                {formData.cover_image_url && (
                  <div className='aspect-video bg-gray-100 rounded-lg overflow-hidden'>
                    <img
                      src={formData.cover_image_url}
                      alt='Preview'
                      className='w-full h-full object-cover'
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ลิงก์</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='facebook_url'>Facebook URL</Label>
                  <Input
                    id='facebook_url'
                    name='facebook_url'
                    value={formData.facebook_url}
                    onChange={handleChange}
                    placeholder='https://facebook.com/...'
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className='p-4 space-y-3'>
                {updateMutation.error && (
                  <div className='text-sm text-red-600 bg-red-50 p-3 rounded-lg'>
                    {updateMutation.error.message}
                  </div>
                )}
                <Button
                  type='submit'
                  className='w-full gap-2'
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2
                        size={18}
                        className='animate-spin'
                      />
                      กำลังบันทึก...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      บันทึกการแก้ไข
                    </>
                  )}
                </Button>
                <Link
                  href='/admin/events'
                  className='block'
                >
                  <Button
                    type='button'
                    variant='outline'
                    className='w-full'
                  >
                    ยกเลิก
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
