import type { Metadata } from 'next'
import ContactPageClient from '@/components/contact/contact-page-client'
import { languageAlternatesForPath } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'Contact Magic-Headshot Support for AI Headshots',
  description:
    'Contact Magic-Headshot support for AI headshot quality, uploads, credits, billing, refunds, account access, or photo generation help.',
  keywords: [
    'Magic-Headshot support',
    'AI headshot support',
    'photo generation help',
  ],
  alternates: {
    canonical: '/contact',
    languages: languageAlternatesForPath('/contact'),
  },
}

export default function ContactPage() {
  return <ContactPageClient />
}
