'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const CookieConsent = dynamic(() => import('@/components/layout/cookie-consent'), { ssr: false })
const BackToTop = dynamic(() => import('@/components/layout/back-to-top'), { ssr: false })
const Analytics = dynamic(() => import('@vercel/analytics/next').then((mod) => mod.Analytics), { ssr: false })
const SpeedInsights = dynamic(() => import('@vercel/speed-insights/next').then((mod) => mod.SpeedInsights), { ssr: false })

type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number
  cancelIdleCallback?: (handle: number) => void
  dataLayer?: unknown[]
  gtag?: (...args: unknown[]) => void
}

function loadGoogleAnalytics() {
  const analyticsWindow = window as IdleWindow

  if (document.querySelector('script[data-gtag-script="true"]')) {
    return
  }

  analyticsWindow.dataLayer = analyticsWindow.dataLayer || []
  analyticsWindow.gtag = (...args: unknown[]) => {
    analyticsWindow.dataLayer?.push(args)
  }
  analyticsWindow.gtag('js', new Date())
  analyticsWindow.gtag('config', 'G-1JFS76C362')

  const script = document.createElement('script')
  script.async = true
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-1JFS76C362'
  script.dataset.gtagScript = 'true'
  document.head.appendChild(script)
}

export default function DeferredPageEffects() {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const analyticsWindow = window as IdleWindow
    const enableEffects = () => {
      setShouldLoad(true)
      loadGoogleAnalytics()
    }

    if (analyticsWindow.requestIdleCallback) {
      const handle = analyticsWindow.requestIdleCallback(enableEffects, { timeout: 3000 })
      return () => analyticsWindow.cancelIdleCallback?.(handle)
    }

    const timeout = window.setTimeout(enableEffects, 1500)
    return () => window.clearTimeout(timeout)
  }, [])

  if (!shouldLoad) {
    return null
  }

  return (
    <>
      <Analytics />
      <SpeedInsights />
      <CookieConsent />
      <BackToTop />
    </>
  )
}
