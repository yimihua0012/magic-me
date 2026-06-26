import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import CookieConsent from '@/components/layout/cookie-consent'
import BackToTop from '@/components/layout/back-to-top'
import { ToastProvider } from '@/components/ui/toast'
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
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
    'AI headshot generator',
    'professional headshots without photographer',
    'LinkedIn profile photo maker',
    'AI business portrait',
    'virtual headshot generator',
    'team photos online',
    'realistic AI portraits',
    'fast headshot generation',
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
    keywords: 'AI headshot generator, LinkedIn profile photo maker, professional headshots without photographer, AI business portrait, virtual headshot generator, realistic AI portraits, fast headshot generation',
    offers: [
      {
        '@type': 'Offer',
        name: 'Basic Plan',
        price: PLANS.basic.price.toString(),
        priceCurrency: 'USD',
        description: `${PLANS.basic.credits} AI headshots at ${PLANS.basic.resolution} resolution - Perfect AI headshot for resume and CV`,
      },
      {
        '@type': 'Offer',
        name: 'Pro Plan',
        price: PLANS.pro.price.toString(),
        priceCurrency: 'USD',
        description: `${PLANS.pro.credits} AI headshots at ${PLANS.pro.resolution} resolution - Best AI headshot generator for LinkedIn profile with business attire`,
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
          text: 'Yes. Our Enterprise plan includes team management features for consistent, high-quality headshots for remote teams.',
        },
      },
    ],
  }

  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Preload critical resources - highest priority */}
        <link rel="preload" href="/logo.svg" as="image" fetchPriority="high" />
        
        {/* Preconnect critical origins */}
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Google Analytics - Load after page is interactive */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1JFS76C362"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1JFS76C362');
          `}
        </Script>
        {/* JSON-LD Schema - Critical for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`min-h-screen bg-white ${inter.className}`}>
        <ToastProvider>
          {children}
        </ToastProvider>
        <Analytics />
        <SpeedInsights />
        <CookieConsent />
        <BackToTop />
      </body>
    </html>
  )
}
