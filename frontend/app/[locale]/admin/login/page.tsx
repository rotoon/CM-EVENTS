'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Lock, ArrowRight } from 'lucide-react'
import { useAdminLogin } from '@/hooks/use-admin'

// Color palette
const colors = {
  primary: '#2563EB',
  primaryHover: '#1D4ED8',
  background: '#F8FAFC',
  text: '#1E293B',
  textMuted: '#64748B',
  border: '#E2E8F0',
}

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const loginMutation = useAdminLogin()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    loginMutation.mutate(password, {
      onSuccess: () => {
        router.push('/admin')
      },
    })
  }

  return (
    <div
      className='min-h-screen flex items-center justify-center p-4'
      style={{
        backgroundColor: colors.background,
        backgroundImage: `
          radial-gradient(circle at 20% 50%, ${colors.primary}08 0%, transparent 50%),
          radial-gradient(circle at 80% 50%, ${colors.primary}05 0%, transparent 50%)
        `,
      }}
    >
      <div className='w-full max-w-md'>
        {/* Logo */}
        <div className='text-center mb-8'>
          <div
            className='inline-flex items-center justify-center w-16 h-16 rounded-2xl text-white text-2xl font-bold mb-4'
            style={{
              backgroundColor: colors.primary,
              boxShadow: `0 8px 24px ${colors.primary}40`,
            }}
          >
            H
          </div>
          <h1
            className='text-2xl font-bold'
            style={{ color: colors.text }}
          >
            HYPE CNX
          </h1>
          <p style={{ color: colors.textMuted }}>Admin Panel</p>
        </div>

        {/* Login Card */}
        <div
          className='rounded-2xl p-8 shadow-xl'
          style={{
            backgroundColor: '#FFFFFF',
            border: `1px solid ${colors.border}`,
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          }}
        >
          <div className='mb-6'>
            <h2
              className='text-xl font-semibold'
              style={{ color: colors.text }}
            >
              เข้าสู่ระบบ
            </h2>
            <p
              className='text-sm mt-1'
              style={{ color: colors.textMuted }}
            >
              กรุณาใส่รหัสผ่านเพื่อเข้าสู่ระบบ
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className='space-y-5'
          >
            <div className='space-y-2'>
              <Label
                htmlFor='password'
                className='text-sm font-medium'
                style={{ color: colors.text }}
              >
                รหัสผ่าน
              </Label>
              <div className='relative'>
                <div className='absolute left-3 top-1/2 -translate-y-1/2'>
                  <Lock
                    size={18}
                    style={{ color: colors.textMuted }}
                  />
                </div>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='ใส่รหัสผ่าน'
                  className='pl-10 pr-10 h-12 rounded-xl border-2 focus:ring-2 focus:ring-offset-0 transition-all'
                  style={{
                    borderColor: colors.border,
                  }}
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 transition-colors'
                  style={{ color: colors.textMuted }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {loginMutation.error && (
              <div
                className='text-sm p-4 rounded-xl flex items-center gap-2'
                style={{
                  backgroundColor: '#FEF2F2',
                  color: '#DC2626',
                  border: '1px solid #FECACA',
                }}
              >
                <span>⚠️</span>
                <span>
                  {loginMutation.error.message || 'รหัสผ่านไม่ถูกต้อง'}
                </span>
              </div>
            )}

            <Button
              type='submit'
              className='w-full h-12 rounded-xl text-base font-medium transition-all duration-200 cursor-pointer'
              style={{
                backgroundColor: colors.primary,
                boxShadow: `0 4px 14px ${colors.primary}40`,
              }}
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <span className='flex items-center gap-2'>
                  <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                  กำลังเข้าสู่ระบบ...
                </span>
              ) : (
                <span className='flex items-center gap-2'>
                  เข้าสู่ระบบ
                  <ArrowRight size={18} />
                </span>
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p
          className='text-center mt-6 text-sm'
          style={{ color: colors.textMuted }}
        >
          © 2024 HYPE CNX. All rights reserved.
        </p>
      </div>
    </div>
  )
}
