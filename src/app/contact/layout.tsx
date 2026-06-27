import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Magic-Headshot AI Headshot Generator Support for Professional Photos',
  description: 'Contact Magic-Headshot support for AI headshot billing, refunds, technical help, account questions, or generation issues.',
  keywords: [
    'Magic-Headshot',
    'AI headshot',
    'professional photos',
    'LinkedIn photo',
    'AI portrait',
    'headshot generator',
    'AI headshot support',
    'AI headshot billing help',
    'AI headshot refund support',
    'professional headshot generator support',
  ],
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
