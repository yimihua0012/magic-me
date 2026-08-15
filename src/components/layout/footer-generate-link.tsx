'use client'

import { useRouter } from 'next/navigation'
import { localePath, type Locale } from '@/lib/i18n'
import { withSource } from '@/lib/navigation-source'

interface FooterGenerateLinkProps {
  children: React.ReactNode
  locale?: Locale
  className?: string
}

export default function FooterGenerateLink({ children, locale = 'en', className }: FooterGenerateLinkProps) {
  const router = useRouter()
  const uploadHref = localePath(locale, '/upload')

  const handleClick = () => {
    router.push(withSource(uploadHref, `footer_generate_${locale}`))
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
    >
      {children}
    </button>
  )
}
