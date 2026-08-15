import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Headshot Generator Pricing for LinkedIn, Resume, and Business Portraits',
  description:
    'Compare AI headshot pricing for realistic portraits, fast generation, and high likeness. New users get 2 free headshots, then one-time PayPal checkout.',
  keywords: [
    'AI headshot pricing',
    'professional headshot cost',
    'LinkedIn photo pricing',
    'AI business portrait',
  ],
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
