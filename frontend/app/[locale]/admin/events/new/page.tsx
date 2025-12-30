'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useCreateEvent } from '@/hooks/use-admin'
import { EventFormData } from '@/lib/admin-api'

export default function NewEventPage() {
  const router = useRouter()
  const createMutation = useCreateEvent()

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
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    createMutation.mutate(formData, {
      onSuccess: () => {
        router.push('/admin/events')
      },
    })
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
          <h1 className='text-2xl font-bold'>เพิ่ม Event ใหม่</h1>
          <p className='text-gray-500'>กรอกข้อมูล Event ที่ต้องการเพิ่ม</p>
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
                {createMutation.error && (
                  <div className='text-sm text-red-600 bg-red-50 p-3 rounded-lg'>
                    {createMutation.error.message}
                  </div>
                )}
                <Button
                  type='submit'
                  className='w-full gap-2'
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? (
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
                      บันทึก Event
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
