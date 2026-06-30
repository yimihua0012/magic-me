'use client'

import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { useEffect, useCallback } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

export default function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleEscape])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div 
        className={cn(
          'relative bg-white w-full max-w-md animate-slide-up',
          'rounded-t-2xl sm:rounded-2xl shadow-2xl',
          'max-h-[90vh] overflow-y-auto',
          'sm:mx-4',
          className
        )}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="sm:hidden w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-1" />
        {title && (
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900">{title}</h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors touch-target"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        )}
        <div className="p-5 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
