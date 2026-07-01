'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { DEFAULT_LOCALE, isRoutedLocale } from '@/lib/i18n'

export default function HtmlLangSync() {
  const pathname = usePathname()

  useEffect(() => {
    const firstSegment = pathname.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean)[0]
    document.documentElement.lang = isRoutedLocale(firstSegment) ? firstSegment : DEFAULT_LOCALE
  }, [pathname])

  return null
}
