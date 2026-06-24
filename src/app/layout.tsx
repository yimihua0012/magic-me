import type { Metadata } from 'next'
import './globals.css'
import CookieConsent from '@/components/layout/cookie-consent'
import { appConfig } from '@/lib/config'
import { PLANS } from '@backend/config/plans'

const siteUrl = appConfig.url.replace(/\/$/, '')

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: appConfig.title,
    template: `%s | ${appConfig.name}`,
  },
  description: `${appConfig.description} - Get professional headshots without a photographer. Perfect AI headshot for LinkedIn profile & resume. 36 styles with business attire.`,
  keywords: [
    ...appConfig.keywords.split(','),
    'AI headshot generator',
    'professional headshots without photographer',
    'LinkedIn profile photo maker',
    'AI business portrait',
    'virtual headshot generator',
    'team photos online',
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
    description: `${appConfig.description} - Get professional headshots without a photographer. Perfect AI headshot for LinkedIn profile & resume.`,
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
    description: `${appConfig.description} Starting at $${PLANS.basic.price}.`,
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
    description: `${appConfig.description} - Get professional headshots without a photographer. Best AI headshot generator for LinkedIn profile & resume.`,
    url: siteUrl,
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Web',
    keywords: 'AI headshot generator, LinkedIn profile photo maker, professional headshots without photographer, AI business portrait with suit, virtual headshot generator',
    offers: [
      {
        '@type': 'Offer',
        name: 'Basic Plan',
        price: PLANS.basic.price.toString(),
        priceCurrency: 'USD',
        description: `${PLANS.basic.styleCount} unique AI styles at ${PLANS.basic.resolution} resolution - Perfect AI headshot for resume and CV`,
      },
      {
        '@type': 'Offer',
        name: 'Pro Plan',
        price: PLANS.pro.price.toString(),
        priceCurrency: 'USD',
        description: `${PLANS.pro.styleCount} unique AI styles at ${PLANS.pro.resolution} resolution - Best AI headshot generator for LinkedIn profile with business attire`,
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
          text: 'Use our AI headshot generator to get professional headshots without hiring a photographer. Simply upload your selfie, choose from 36 unique styles with business attire, and get high-quality headshots in 3 minutes.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the best AI headshot generator for LinkedIn profile?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our AI headshot generator creates professional LinkedIn profile photos with 36 unique styles, including corporate professional, business attire, and executive portraits. Perfect for updating your LinkedIn profile photo.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I get AI headshots with different backgrounds?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Our AI headshot generator offers multiple background options including solid colors, office settings, and custom backgrounds. Perfect for different professional contexts and platforms.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you offer professional headshots for team photos online?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Our Enterprise plan includes team management features for generating professional headshots for remote teams. Get consistent, high-quality team photos without coordinating a group photoshoot.',
        },
      },
    ],
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-white">
        {children}
        <CookieConsent />
      </body>
    </html>
  )
}