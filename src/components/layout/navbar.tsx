'use client'

import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { Camera, Menu, User, X } from 'lucide-react'
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
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (ticking) return

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
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
    }

    void initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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

  const closeMenu = () => setIsOpen(false)

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

      <nav className={`fixed left-0 right-0 top-0 z-40 safe-top transition-all duration-300 ${
        isScrolled
          ? 'border-b border-slate-200/50 bg-white/80 shadow-sm backdrop-blur-navbar'
          : 'bg-transparent'
      }`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between sm:h-16 lg:h-20">
            <Link href="/" className="flex touch-target items-center gap-2" onClick={closeMenu}>
              <Image
                src="/logo.svg"
                alt={appConfig.name}
                width={32}
                height={32}
                className="rounded-lg sm:h-10 sm:w-10 sm:rounded-xl"
                priority
              />
              <span className="text-lg font-bold text-slate-900 sm:text-xl">{appConfig.name}</span>
            </Link>

            <div className="hidden items-center gap-8 lg:flex">
              <Link href="/#features" className="font-medium text-slate-600 transition-colors hover:text-slate-900" prefetch={false}>
                Features
              </Link>
              <Link href="/pricing" className="font-medium text-slate-600 transition-colors hover:text-slate-900" prefetch>
                Pricing
              </Link>
              <Link href="/#testimonials" className="font-medium text-slate-600 transition-colors hover:text-slate-900" prefetch={false}>
                Testimonials
              </Link>
            </div>

            <div className="hidden items-center gap-4 lg:flex">
              {user ? (
                <>
                  <Link href="/dashboard" className="flex items-center gap-2 font-medium text-slate-600 transition-colors hover:text-slate-900" prefetch>
                    <User className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="font-medium text-slate-600 transition-colors hover:text-slate-900"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleOpenAuth}
                    className="font-medium text-slate-600 transition-colors hover:text-slate-900"
                  >
                    Sign In
                  </button>
                  <Button variant="primary" size="sm" onClick={() => router.push('/upload')}>
                    <Camera className="mr-2 h-4 w-4" />
                    Generate Headshots
                  </Button>
                </>
              )}
            </div>

            <button
              onClick={() => setIsOpen((current) => !current)}
              className="touch-target rounded-lg p-2 transition-colors hover:bg-slate-100 lg:hidden"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <X className="h-6 w-6 text-slate-900" />
              ) : (
                <Menu className="h-6 w-6 text-slate-900" />
              )}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="max-h-[80vh] overflow-y-auto border-t border-slate-100 bg-white shadow-lg animate-slide-up lg:hidden">
            <div className="space-y-1 px-4 py-4">
              <Link
                href="/#features"
                className="block touch-target rounded-xl px-4 py-3 font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                onClick={closeMenu}
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="block touch-target rounded-xl px-4 py-3 font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                onClick={closeMenu}
              >
                Pricing
              </Link>
              <Link
                href="/#testimonials"
                className="block touch-target rounded-xl px-4 py-3 font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                onClick={closeMenu}
              >
                Testimonials
              </Link>
              <hr className="my-2 border-slate-100" />
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block touch-target rounded-xl px-4 py-3 font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    onClick={closeMenu}
                  >
                    <User className="mr-2 inline h-4 w-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      closeMenu()
                      void handleLogout()
                    }}
                    className="block w-full touch-target rounded-xl px-4 py-3 text-left font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      closeMenu()
                      handleOpenAuth()
                    }}
                    className="block w-full touch-target rounded-xl px-4 py-3 text-left font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  >
                    Sign In
                  </button>
                  <div className="pt-2">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => {
                        closeMenu()
                        router.push('/upload')
                      }}
                    >
                      <Camera className="mr-2 h-4 w-4" />
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
