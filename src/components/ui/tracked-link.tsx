import Link from 'next/link'
import type { LinkProps } from 'next/link'
import type { AnchorHTMLAttributes, ReactNode } from 'react'

interface TrackedLinkProps extends LinkProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> {
  children: ReactNode
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
      data-track-button="true"
      data-track-button-type={buttonType}
      data-track-source={source}
      data-track-metadata={metadata ? JSON.stringify(metadata) : undefined}
    >
      {children}
    </Link>
  )
}
