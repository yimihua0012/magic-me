import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Headshot Pricing for LinkedIn and Resume Photos',
  description: 'Compare AI headshot pricing for realistic portraits, fast generation, and high likeness. One-time PayPal checkout, starting at $12.90.',
  keywords: [
    'AI headshot generator pricing',
    'professional headshots without photographer cost',
    'LinkedIn profile photo maker pricing',
    'AI business portrait with suit price',
    'virtual headshot generator for LinkedIn cost',
    'team photos online pricing',
    'realistic AI portraits pricing',
    'fast headshot generation pricing',
  ],
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
