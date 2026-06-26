'use client'

import Link from 'next/link'
import type { LinkProps } from 'next/link'
import type { ReactNode } from 'react'
import { trackButtonClick } from '@/lib/analytics'

interface TrackedLinkProps extends LinkProps {
  children: ReactNode
  className?: string
  buttonType: string
  source: string
  metadata?: Record<string, unknown>
}

export default function TrackedLink({
  children,
  className,
  buttonType,
  source,
  metadata,
  ...props
}: TrackedLinkProps) {
  return (
    <Link
      {...props}
      className={className}
      onClick={() => {
        void trackButtonClick({
          buttonType,
          source,
          metadata,
        })
      }}
    >
      {children}
    </Link>
  )
}

