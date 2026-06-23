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
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
      <div className="w-[60%] max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Cookie className="w-6 h-6 text-primary-600" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              We value your privacy
            </h3>
            <p className="text-slate-600 text-sm mb-4">
              We use cookies to enhance your browsing experience, serve personalized content, 
              and analyze our traffic. By clicking "Accept", you consent to our use of cookies.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <Button size="sm" onClick={handleAccept}>
                Accept All
              </Button>
              <Button size="sm" variant="secondary" onClick={handleDecline}>
                Decline
              </Button>
              <Link 
                href="/privacy" 
                className="text-sm text-primary-600 hover:text-primary-700 font-medium px-3 py-2"
              >
                Learn More
              </Link>
            </div>
          </div>

          <button
            onClick={handleDecline}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
      </div>
    </div>
  )
}
