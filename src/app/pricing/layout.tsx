import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing - Best AI Headshot Generator for LinkedIn Profile',
  description: 'Simple pricing for professional headshots without a photographer. AI headshots with business attire for LinkedIn & resume. Starting at $12.90.',
  keywords: [
    'AI headshot generator pricing',
    'professional headshots without photographer cost',
    'LinkedIn profile photo maker pricing',
    'AI business portrait with suit price',
    'virtual headshot generator for LinkedIn cost',
    'team photos online pricing',
  ],
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
