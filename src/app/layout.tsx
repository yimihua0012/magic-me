import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { headers } from 'next/headers'
import Script from 'next/script'
import './globals.css'
import ButtonClickTracker from '@/components/ui/button-click-tracker'
import PageViewTracker from '@/components/ui/page-view-tracker'
import DeferredPageEffects from '@/components/layout/deferred-page-effects'
import HtmlLangSync from '@/components/layout/html-lang-sync'
import { appConfig } from '@/lib/config'
import { DEFAULT_LOCALE, isLocale } from '@/lib/i18n'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-inter',
  fallback: ['system-ui', 'sans-serif'],
})

const siteUrl = appConfig.url.replace(/\/$/, '')
const googleAnalyticsId = 'G-1JFS76C362'
const microsoftClarityId = 'xzqhimnhp8'
const siteDescription = appConfig.description
const siteKeywords = appConfig.keywords
  .split(',')
  .map((keyword) => keyword.trim())
  .filter(Boolean)
  .slice(0, 5)

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
  description: siteDescription,
  keywords: siteKeywords,
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
    description: siteDescription,
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
    description: siteDescription,
    images: [`${siteUrl}/api/og`],
  },
  icons: {
    icon: '/api/icon?size=32',
    apple: '/api/icon?size=180',
  },
  manifest: '/manifest.json',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const requestHeaders = await headers()
  const requestLocale = requestHeaders.get('x-mh-locale')
  const locale = requestLocale && isLocale(requestLocale) ? requestLocale : DEFAULT_LOCALE
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: appConfig.name,
        url: siteUrl,
        logo: `${siteUrl}/api/icon?size=180`,
        email: 'support@mail.magic-headshot.com',
        areaServed: 'Worldwide',
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            email: 'support@mail.magic-headshot.com',
            availableLanguage: ['English', 'Spanish', 'French', 'German', 'Japanese', 'Simplified Chinese'],
          },
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        name: appConfig.name,
        url: siteUrl,
        description: siteDescription,
        publisher: {
          '@type': 'Organization',
          '@id': `${siteUrl}/#organization`,
        },
        inLanguage: locale,
      },
    ],
  }

  return (
    <html lang={locale} className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`min-h-screen bg-white ${inter.className}`}>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${googleAnalyticsId}');
          `}
        </Script>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${microsoftClarityId}");
          `}
        </Script>
        {children}
        <HtmlLangSync />
        <PageViewTracker />
        <ButtonClickTracker />
        <DeferredPageEffects />
      </body>
    </html>
  )
}
