import type { Metadata } from 'next'
import { privatePageMetadata } from '@/lib/private-page-metadata'

export const metadata: Metadata = {
  ...privatePageMetadata,
  title: 'Completing Sign In',
  description:
    'Complete your Magic-Headshot sign-in securely and return to your dashboard, upload flow, or pricing checkout without losing your place.',
}

export default function AuthCompleteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
