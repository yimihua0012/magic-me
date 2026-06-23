import type { Metadata } from 'next'
import './globals.css'
import CookieConsent from '@/components/layout/cookie-consent'
import { appConfig } from '@/lib/config'
import { PLANS } from '@backend/config/plans'

export const metadata: Metadata = {
  title: appConfig.title,
  description: appConfig.description,
  keywords: appConfig.keywords,
  openGraph: {
    title: appConfig.title,
    description: appConfig.description,
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: appConfig.name,
    description: `${appConfig.description} Starting at $${PLANS.basic.price}.`,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        {children}
        <CookieConsent />
      </body>
    </html>
  )
}