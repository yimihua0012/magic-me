import type { Metadata } from 'next'
import './globals.css'
import CookieConsent from '@/components/layout/cookie-consent'

export const metadata: Metadata = {
  title: 'AI Headshot Generator - Professional Photos in 3 Minutes',
  description: 'Upload a selfie and get 30 professional AI headshot styles in minutes. Perfect for LinkedIn, Instagram, dating apps. Starting at $9.90.',
  keywords: 'AI headshot, professional photos, LinkedIn photo, AI portrait, headshot generator',
  openGraph: {
    title: 'AI Headshot Generator - Professional Photos in 3 Minutes',
    description: 'Upload a selfie and get 30 professional AI headshot styles in minutes. Starting at $9.90.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Headshot Generator',
    description: 'Professional AI headshots in 3 minutes. $9.90 only.',
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
