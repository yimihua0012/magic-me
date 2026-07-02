import type { Metadata } from 'next'
import PublicPhotoToolsPageView from '@/components/photo-tools/public-photo-tools-page-view'
import { languageAlternatesForPath } from '@/lib/i18n'

const title = 'Free ID Photo Generator, Crop & Print Tool | Magic-Headshot'
const description = 'Free online ID photo tool for resumes, job applications, exams, employee badges, student cards, and printable photo sheets.'
const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/+$/, '')
const keywords = [
  'free ID photo print sheet',
  'free resume photo crop',
  'free exam photo tool',
  'free employee badge photo',
  'free student card photo',
]

export const metadata: Metadata = {
  title,
  description,
  keywords,
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/free-id-photo-tool',
    languages: languageAlternatesForPath('/free-id-photo-tool'),
  },
  openGraph: {
    title,
    description,
    type: 'website',
    url: '/free-id-photo-tool',
    siteName: 'Magic-Headshot',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'Free ID photo crop and print tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/api/og'],
  },
}

export default function FreeIdPhotoToolPage() {
  const pageUrl = `${siteUrl}/free-id-photo-tool`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${pageUrl}#webapplication`,
    name: 'Free ID Photo Generator, Crop & Print Tool',
    description,
    url: pageUrl,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    browserRequirements: 'Requires a modern web browser with JavaScript enabled.',
    isAccessibleForFree: true,
    keywords: keywords.join(', '),
    featureList: [
      'Free ID photo crop tool',
      'Printable ID photo sheet layout',
      'Resume photo crop',
      'Exam photo tool',
      'Employee badge and student card photo tool',
    ],
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    provider: {
      '@id': `${siteUrl}/#organization`,
    },
    isPartOf: {
      '@id': `${siteUrl}/#website`,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PublicPhotoToolsPageView />
    </>
  )
}
