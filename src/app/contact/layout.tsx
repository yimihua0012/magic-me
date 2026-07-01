import type { Metadata } from 'next'
import { languageAlternatesForPath } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'Contact Magic-Headshot AI Headshot Generator Support for Professional Photos',
  description:
    'Contact Magic-Headshot support for AI headshot billing, refunds, technical help, account questions, generation issues, and professional photo guidance.',
  keywords: [
    'Magic-Headshot support',
    'AI headshot support',
    'AI headshot billing',
  ],
  alternates: {
    canonical: '/contact',
    languages: languageAlternatesForPath('/contact'),
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
