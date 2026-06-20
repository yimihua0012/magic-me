'use client'

import Link from 'next/link'
import { Menu, X, Camera, User } from 'lucide-react'
import { useState } from 'react'
import Button from '@/components/ui/button'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setIsScrolled(window.scrollY > 10)
    })
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/25">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">HeadshotAI</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <Link href="/#features" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
              Pricing
            </Link>
            <Link href="/#testimonials" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
              Testimonials
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <Link href="/login" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
              Sign In
            </Link>
            <Link href="/upload">
              <Button variant="primary" size="sm">
                <Camera className="w-4 h-4 mr-2" />
                Generate Headshots
              </Button>
            </Link>
          </div>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-slate-900" />
            ) : (
              <Menu className="w-6 h-6 text-slate-900" />
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 animate-slide-up">
          <div className="px-4 py-6 space-y-4">
            <Link 
              href="/#features" 
              className="block text-slate-600 hover:text-slate-900 font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="/pricing" 
              className="block text-slate-600 hover:text-slate-900 font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              href="/#testimonials" 
              className="block text-slate-600 hover:text-slate-900 font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              Testimonials
            </Link>
            <hr className="border-slate-100" />
            <Link 
              href="/login" 
              className="block text-slate-600 hover:text-slate-900 font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </Link>
            <Link href="/upload" onClick={() => setIsOpen(false)}>
              <Button className="w-full" size="lg">
                <Camera className="w-4 h-4 mr-2" />
                Generate Headshots
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
