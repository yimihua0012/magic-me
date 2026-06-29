import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Generation Status',
  description:
    'Track AI headshot generation progress, review processing status, and open finished professional portraits for LinkedIn, resumes, and business profiles.',
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
