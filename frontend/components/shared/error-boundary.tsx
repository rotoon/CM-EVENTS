'use client'

import { ArrowLeft, RefreshCw } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Component, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

// Wrapper component to use translations
function ErrorFallback({
  error,
  onRetry,
}: {
  error: Error | null
  onRetry: () => void
}) {
  const t = useTranslations('error')

  return (
    <div className='min-h-[60vh] flex items-center justify-center p-8'>
      <div className='max-w-lg w-full bg-white border-4 border-neo-black shadow-neo-lg p-8 text-center rotate-[-0.5deg]'>
        <div className='w-16 h-16 bg-neo-pink border-4 border-neo-black shadow-neo flex items-center justify-center mx-auto mb-6 rotate-3'>
          <span className='text-3xl'>💥</span>
        </div>
        <h2 className='font-display font-black text-4xl uppercase mb-4'>
          {t('title')}
        </h2>
        <p className='font-mono text-lg mb-2'>{t('message')}</p>
        <p className='font-mono text-sm text-gray-500 mb-8 break-words'>
          {error?.message || t('default')}
        </p>
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <button
            onClick={onRetry}
            className='bg-neo-lime border-4 border-neo-black px-6 py-3 font-bold shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2'
          >
            <RefreshCw className='w-5 h-5' />
            {t('tryAgain')}
          </button>
          <Link
            href='/'
            className='bg-white border-4 border-neo-black px-6 py-3 font-bold shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2'
          >
            <ArrowLeft className='w-5 h-5' />
            {t('goHome')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleRetry = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <ErrorFallback
          error={this.state.error}
          onRetry={this.handleRetry}
        />
      )
    }

    return this.props.children
  }
}
