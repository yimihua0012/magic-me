import type { Metadata } from 'next'
import ContactPageClient from '@/components/contact/contact-page-client'
import { languageAlternatesForPath } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'Contact Magic-Headshot AI Headshot Support',
  description:
    'Contact Magic-Headshot support about AI headshots, LinkedIn photos, billing, refunds, account access, uploads, and photo generation.',
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
