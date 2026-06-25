'use client'

import { useState, useEffect } from 'react'
import { ChevronUp } from 'lucide-react'

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 400)
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true })
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 w-12 h-12 bg-primary-600 text-white rounded-full shadow-lg shadow-primary-600/25 flex items-center justify-center transition-all duration-300 hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-600/30 hover:-translate-y-1 touch-target ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      style={{ marginBottom: 'env(safe-area-inset-bottom)', marginRight: 'env(safe-area-inset-right)' }}
      aria-label="Back to top"
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  )
}
