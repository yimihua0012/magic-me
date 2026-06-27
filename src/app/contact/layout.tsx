import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact support for billing, technical help, or general questions.',
  alternates: {
    canonical: '/contact',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
