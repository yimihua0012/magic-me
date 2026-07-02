'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Camera, Globe2, Menu, User, X } from 'lucide-react'
import Button from '@/components/ui/button'
import { appConfig } from '@/lib/config'
import { loginPathForReturn } from '@/lib/auth-return'
import { LOCALE_LABELS, LOCALES, localePath, type Locale } from '@/lib/i18n'
import { localizedLayoutContent } from '@/lib/localized-layout-content'
import { withSource } from '@/lib/navigation-source'

interface NavbarProps {
  onOpenAuthModal?: () => void
  locale?: Locale
}

type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number
  cancelIdleCallback?: (handle: number) => void
}

export default function Navbar({ onOpenAuthModal, locale = 'en' }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const content = localizedLayoutContent[locale].nav

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
    let isMounted = true
    let subscription: { unsubscribe: () => void } | undefined
    const idleWindow = window as IdleWindow
    let idleHandle: number | undefined
    let timeoutHandle: number | undefined

    const initAuth = async () => {
      try {
        const { supabase } = await import('@/lib/supabase/client')
        const { getSessionSafely } = await import('@/lib/supabase/auth-session')
        const session = await getSessionSafely(supabase)

        if (!isMounted) {
          return
        }

        setIsAuthenticated(Boolean(session?.user))

        const authState = supabase.auth.onAuthStateChange((_event, nextSession) => {
          setIsAuthenticated(Boolean(nextSession?.user))
        })

        subscription = authState.data.subscription
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[Navbar] Auth session check failed:', error)
        }

        if (isMounted) {
          setIsAuthenticated(false)
        }
      }
    }

    if (idleWindow.requestIdleCallback) {
      idleHandle = idleWindow.requestIdleCallback(() => {
        void initAuth()
      }, { timeout: 1500 })
    } else {
      timeoutHandle = window.setTimeout(() => {
        void initAuth()
      }, 500)
    }

    return () => {
      isMounted = false
      if (idleHandle !== undefined) {
        idleWindow.cancelIdleCallback?.(idleHandle)
      }
      if (timeoutHandle !== undefined) {
        window.clearTimeout(timeoutHandle)
      }
      subscription?.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    const { supabase } = await import('@/lib/supabase/client')
    await supabase.auth.signOut()
    window.location.href = homeHref
  }

  const handleOpenAuth = () => {
    if (onOpenAuthModal) {
      onOpenAuthModal()
      return
    }

    router.push(loginPathForReturn(pathname || homeHref, homeHref))
  }

  const closeMenu = () => setIsOpen(false)
  const homeHref = localePath(locale)
  const featuresHref = `${homeHref === '/' ? '' : homeHref}/#features`
  const testimonialsHref = `${homeHref === '/' ? '' : homeHref}/#testimonials`
  const pricingHref = localePath(locale, '/pricing')
  const photoToolsHref = localePath(locale, '/free-id-photo-tool')
  const uploadHref = localePath(locale, '/upload')
  const dashboardHref = localePath(locale, '/dashboard')
  const sourcedUploadHref = withSource(uploadHref, `nav_generate_${locale}`)
  const currentRoute = getLocalizedSwitchPath(pathname)

  function languageHref(nextLocale: Locale) {
    return localePath(nextLocale, currentRoute)
  }

  const renderLanguageSwitcher = () => (
    <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white/80 px-2 py-1.5 text-sm font-medium text-slate-600 shadow-sm">
      <Globe2 className="h-4 w-4 text-slate-500" />
      <span className="sr-only">{content.language}</span>
      <select
        value={locale}
        onChange={(event) => {
          router.push(languageHref(event.target.value as Locale))
          closeMenu()
        }}
        className="bg-transparent text-sm font-medium outline-none"
        aria-label={content.language}
      >
        {LOCALES.map((option) => (
          <option key={option} value={option}>
            {LOCALE_LABELS[option]}
          </option>
        ))}
      </select>
    </label>
  )

  return (
    <>
      <nav className={`fixed left-0 right-0 top-0 z-40 safe-top transition-all duration-300 ${
        isScrolled
          ? 'border-b border-slate-200/50 bg-white/80 shadow-sm backdrop-blur-navbar'
          : 'bg-transparent'
      }`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between sm:h-16 lg:h-20">
            <Link href={homeHref} className="flex touch-target items-center gap-2" onClick={closeMenu}>
              <Image
                src="/logo.svg"
                alt={appConfig.name}
                width={32}
                height={32}
                className="rounded-lg sm:h-10 sm:w-10 sm:rounded-xl"
              />
              <span className="text-lg font-bold text-slate-900 sm:text-xl">{appConfig.name}</span>
            </Link>

            <div className="hidden items-center gap-8 lg:flex">
              <Link href={featuresHref} className="font-medium text-slate-600 transition-colors hover:text-slate-900" prefetch={false}>
                {content.features}
              </Link>
              <Link href={withSource(pricingHref, `nav_pricing_${locale}`)} className="font-medium text-slate-600 transition-colors hover:text-slate-900" prefetch>
                {content.pricing}
              </Link>
              <Link href={photoToolsHref} className="font-medium text-slate-600 transition-colors hover:text-slate-900" prefetch>
                {content.photoTools}
              </Link>
              <Link href={testimonialsHref} className="font-medium text-slate-600 transition-colors hover:text-slate-900" prefetch={false}>
                {content.testimonials}
              </Link>
            </div>

            <div className="hidden items-center gap-4 lg:flex">
              {renderLanguageSwitcher()}
              {isAuthenticated ? (
                <>
                  <Link href={dashboardHref} className="flex items-center gap-2 font-medium text-slate-600 transition-colors hover:text-slate-900" prefetch>
                    <User className="h-4 w-4" />
                    {content.dashboard}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="font-medium text-slate-600 transition-colors hover:text-slate-900"
                  >
                    {content.logout}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleOpenAuth}
                    className="font-medium text-slate-600 transition-colors hover:text-slate-900"
                  >
                    {content.signIn}
                  </button>
                  <Button variant="primary" size="sm" onClick={() => router.push(sourcedUploadHref)}>
                    <Camera className="mr-2 h-4 w-4" />
                    {content.generate}
                  </Button>
                </>
              )}
            </div>

            <button
              onClick={() => setIsOpen((current) => !current)}
              className="touch-target rounded-lg p-2 transition-colors hover:bg-slate-100 lg:hidden"
              aria-label={isOpen ? content.closeMenu : content.openMenu}
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
                href={featuresHref}
                className="block touch-target rounded-xl px-4 py-3 font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                onClick={closeMenu}
              >
                {content.features}
              </Link>
              <Link
                href={withSource(pricingHref, `nav_mobile_pricing_${locale}`)}
                className="block touch-target rounded-xl px-4 py-3 font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                onClick={closeMenu}
              >
                {content.pricing}
              </Link>
              <Link
                href={photoToolsHref}
                className="block touch-target rounded-xl px-4 py-3 font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                onClick={closeMenu}
              >
                {content.photoTools}
              </Link>
              <Link
                href={testimonialsHref}
                className="block touch-target rounded-xl px-4 py-3 font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                onClick={closeMenu}
              >
                {content.testimonials}
              </Link>
              <hr className="my-2 border-slate-100" />
              <div className="px-4 py-2">
                {renderLanguageSwitcher()}
              </div>
              <hr className="my-2 border-slate-100" />
              {isAuthenticated ? (
                <>
                  <Link
                    href={dashboardHref}
                    className="block touch-target rounded-xl px-4 py-3 font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    onClick={closeMenu}
                  >
                    <User className="mr-2 inline h-4 w-4" />
                    {content.dashboard}
                  </Link>
                  <button
                    onClick={() => {
                      closeMenu()
                      void handleLogout()
                    }}
                    className="block w-full touch-target rounded-xl px-4 py-3 text-left font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  >
                    {content.logout}
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
                    {content.signIn}
                  </button>
                  <div className="pt-2">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => {
                        closeMenu()
                        router.push(sourcedUploadHref)
                      }}
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      {content.generate}
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

function getLocalizedSwitchPath(pathname: string) {
  const segments = pathname.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean)
  const firstSegment = segments[0]
  const routeSegments = LOCALES.includes(firstSegment as Locale) ? segments.slice(1) : segments
  const route = routeSegments.join('/')

  if (
    route === 'pricing' ||
    route === 'privacy' ||
    route === 'terms' ||
    route === 'refund' ||
    route === 'contact' ||
    route === 'questions' ||
    route === 'sample' ||
    route === 'landing' ||
    route === 'photo-tools' ||
    route === 'free-id-photo-tool' ||
    route === 'upload'
  ) {
    return `/${route}`
  }

  return '/'
}
