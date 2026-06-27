import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Generation Status',
  description: 'Track your AI headshot generation progress.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function GenerateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
