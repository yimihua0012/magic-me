'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, Camera, User } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Button from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { appConfig } from '@/lib/config'

const AuthModal = dynamic(() => import('@/components/auth/auth-modal'), {
  loading: () => null,
  ssr: false,
})

interface NavbarProps {
  onOpenAuthModal?: () => void
}

export default function Navbar({ onOpenAuthModal }: NavbarProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (ticking) {
        return
      }

      ticking = true
      window.requestAnimationFrame(() => {
        setIsScrolled((current) => {
          const next = window.scrollY > 10
          return current === next ? current : next
        })
        ticking = false
      })
    }
    
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // 初始化时同步获取一次会话状态，避免延迟
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
    }
    initAuth()

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const handleOpenAuth = () => {
    if (onOpenAuthModal) {
      onOpenAuthModal()
      return
    }

    setShowAuthModal(true)
  }

  return (
    <>
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false)
            router.push('/upload')
          }}
        />
      )}

      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 safe-top ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-navbar shadow-sm border-b border-slate-200/50'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
            <Link href="/" className="flex items-center gap-2 touch-target">
              <Image src="/logo.svg" alt={appConfig.name} width={32} height={32} className="rounded-lg sm:rounded-xl sm:w-10 sm:h-10" priority />
              <span className="text-lg sm:text-xl font-bold text-slate-900">{appConfig.name}</span>
            </Link>

          <div className="hidden lg:flex items-center gap-8">
            <Link href="/#features" className="text-slate-600 hover:text-slate-900 font-medium transition-colors" prefetch={false}>
              Features
            </Link>
            <Link href="/pricing" className="text-slate-600 hover:text-slate-900 font-medium transition-colors" prefetch={true}>
              Pricing
            </Link>
            <Link href="/#testimonials" className="text-slate-600 hover:text-slate-900 font-medium transition-colors" prefetch={false}>
              Testimonials
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <>
                <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 font-medium transition-colors flex items-center gap-2" prefetch={true}>
                  <User className="w-4 h-4" />
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={handleOpenAuth}
                  className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
                >
                  Sign In
                </button>
                <Button variant="primary" size="sm" onClick={() => router.push('/upload')}>
                  <Camera className="w-4 h-4 mr-2" />
                  Generate Headshots
                </Button>
              </>
            )}
          </div>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors touch-target"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
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
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-lg max-h-[80vh] overflow-y-auto animate-slide-up">
          <div className="px-4 py-4 space-y-1">
            <Link 
              href="/#features" 
              className="block text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium rounded-xl px-4 py-3 touch-target"
              onClick={() => setIsOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="/pricing" 
              className="block text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium rounded-xl px-4 py-3 touch-target"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              href="/#testimonials" 
              className="block text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium rounded-xl px-4 py-3 touch-target"
              onClick={() => setIsOpen(false)}
            >
              Testimonials
            </Link>
            <hr className="border-slate-100 my-2" />
            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="block text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium rounded-xl px-4 py-3 touch-target"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="w-4 h-4 inline mr-2" />
                  Dashboard
                </Link>
                <button 
                  onClick={() => {
                    setIsOpen(false)
                    handleLogout()
                  }}
                  className="block text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium rounded-xl px-4 py-3 w-full text-left touch-target"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => {
                    setIsOpen(false)
                    handleOpenAuth()
                  }}
                  className="block text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium rounded-xl px-4 py-3 w-full text-left touch-target"
                >
                  Sign In
                </button>
                <div className="block pt-2">
                  <Button className="w-full" size="lg" onClick={() => {
                    setIsOpen(false)
                    router.push('/upload')
                  }}>
                    <Camera className="w-4 h-4 mr-2" />
                    Generate Headshots
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      </nav>
    </>
  )
}
