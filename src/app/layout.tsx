import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ButtonClickTracker from '@/components/ui/button-click-tracker'
import DeferredPageEffects from '@/components/layout/deferred-page-effects'
import { appConfig } from '@/lib/config'
import { PLANS } from '@backend/config/plans'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-inter',
  fallback: ['system-ui', 'sans-serif'],
})

const siteUrl = appConfig.url.replace(/\/$/, '')
const seoKeywords = [
  'realistic AI headshot generator',
  'AI headshots for LinkedIn',
  'AI resume photo generator',
  'professional profile photo maker',
  'business portrait AI generator',
  'high likeness AI portraits',
  'professional headshots without photographer',
  'LinkedIn profile photo maker',
  'virtual headshot generator',
  'team photos online',
  'fast headshot generation',
]

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#4F46E5',
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: appConfig.title,
    template: `%s | ${appConfig.name}`,
  },
  description: `${appConfig.description}. Fast AI headshots for LinkedIn, resumes, and profile photos with a dedicated portrait model and high likeness.`,
  keywords: [
    ...appConfig.keywords.split(','),
    ...seoKeywords,
  ],
  authors: [{ name: appConfig.name }],
  creator: appConfig.name,
  publisher: appConfig.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: appConfig.title,
    description: `${appConfig.description}. Fast AI headshots for LinkedIn, resumes, and profile photos with high likeness.`,
    type: 'website',
    locale: 'en_US',
    siteName: appConfig.name,
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}/api/og`,
        width: 1200,
        height: 630,
        alt: `${appConfig.name} - Best AI Headshot Generator for LinkedIn Profile`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: appConfig.title,
    description: `${appConfig.description}. Starting at $${PLANS.basic.price}.`,
    images: [`${siteUrl}/api/og`],
  },
  icons: {
    icon: '/api/icon?size=32',
    apple: '/api/icon?size=180',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: appConfig.name,
    description: `${appConfig.description}. Fast AI headshots for LinkedIn, resumes, and profile photos with high likeness.`,
    url: siteUrl,
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Web',
    keywords: seoKeywords.join(', '),
    offers: [
      {
        '@type': 'Offer',
        name: PLANS.basic.name,
        price: PLANS.basic.price.toString(),
        priceCurrency: 'USD',
        description: `${PLANS.basic.credits} AI headshots at ${PLANS.basic.resolution} resolution - Perfect AI headshot for resume and CV`,
      },
      {
        '@type': 'Offer',
        name: PLANS.pro.name,
        price: PLANS.pro.price.toString(),
        priceCurrency: 'USD',
        description: `${PLANS.pro.credits} AI headshots at ${PLANS.pro.resolution} resolution - Best AI headshot generator for LinkedIn profile with business attire`,
      },
      {
        '@type': 'Offer',
        name: PLANS.premium.name,
        price: PLANS.premium.price.toString(),
        priceCurrency: 'USD',
        description: `${PLANS.premium.credits} AI headshots at ${PLANS.premium.resolution} resolution with priority processing and dedicated support`,
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '10000',
    },
    FAQ: [
      {
        '@type': 'Question',
        name: 'How to get professional headshots without a photographer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Use our AI headshot generator to get realistic headshots without hiring a photographer. Simply upload your selfie, choose a style, and get high-likeness portraits in minutes.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the best AI headshot generator for LinkedIn profile?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our AI headshot generator creates realistic LinkedIn profile photos with a dedicated portrait model, fast generation, and styles for business, resume, and executive use.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I get AI headshots with different backgrounds?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Our AI headshot generator offers multiple background options for different professional contexts and platforms.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you offer professional headshots for team photos online?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Teams can use our AI headshot generator to create consistent professional portraits for remote teams, company pages, and profile photos.',
        },
      },
    ],
  }

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`min-h-screen bg-white ${inter.className}`}>
        {children}
        <ButtonClickTracker />
        <DeferredPageEffects />
      </body>
    </html>
  )
}
