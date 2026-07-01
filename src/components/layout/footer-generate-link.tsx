'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginPathForReturn } from '@/lib/auth-return'
import { localePath, type Locale } from '@/lib/i18n'
import { withSource } from '@/lib/navigation-source'

interface FooterGenerateLinkProps {
  children: React.ReactNode
  locale?: Locale
  className?: string
}

export default function FooterGenerateLink({ children, locale = 'en', className }: FooterGenerateLinkProps) {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(false)
  const uploadHref = localePath(locale, '/upload')

  const handleClick = async () => {
    try {
      setIsChecking(true)
      const { supabase } = await import('@/lib/supabase/client')
      const { getSessionSafely } = await import('@/lib/supabase/auth-session')
      const session = await getSessionSafely(supabase)
      const targetHref = session?.access_token ? uploadHref : loginPathForReturn(uploadHref, localePath(locale))
      router.push(withSource(targetHref, `footer_generate_${locale}`))
    } catch {
      router.push(withSource(loginPathForReturn(uploadHref, localePath(locale)), `footer_generate_${locale}`))
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isChecking}
      className={className}
    >
      {children}
    </button>
  )
}
