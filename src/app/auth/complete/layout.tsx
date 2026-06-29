import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Completing Sign In',
  description:
    'Complete your Magic-Headshot sign-in securely and return to your dashboard, upload flow, or pricing checkout without losing your place.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AuthCompleteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
