'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, Cookie } from 'lucide-react'
import Button from '@/components/ui/button'

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setIsVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-4 sm:max-w-sm z-40 pointer-events-none animate-slide-up safe-bottom">
      <div className="pointer-events-auto w-full bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 hidden sm:flex">
            <Cookie className="w-6 h-6 text-primary-600" />
          </div>
          
          <div className="flex-1 w-full">
            <h3 className="text-base font-semibold text-slate-900 mb-1">
              We value your privacy
            </h3>
            <p className="text-slate-600 text-sm leading-5">
              We use cookies to improve your experience and understand site traffic.
            </p>
            
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" onClick={handleAccept}>
                Accept All
              </Button>
              <Button size="sm" variant="secondary" onClick={handleDecline}>
                Decline
              </Button>
              <Link 
                href="/privacy" 
                className="text-sm text-primary-600 hover:text-primary-700 font-medium px-3 py-2 inline-flex items-center"
              >
                Read our Privacy Policy
              </Link>
            </div>
          </div>

          <button
            onClick={handleDecline}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0 -mt-1 -mr-1"
            aria-label="Close cookie consent"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
      </div>
    </div>
  )
}
