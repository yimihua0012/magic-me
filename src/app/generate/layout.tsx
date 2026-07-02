import type { Metadata } from 'next'
import { privatePageMetadata } from '@/lib/private-page-metadata'

export const metadata: Metadata = {
  ...privatePageMetadata,
  title: 'Generation Status',
  description:
    'Track AI headshot generation progress, review processing status, and open finished professional portraits for LinkedIn, resumes, and business profiles.',
}

export default function GenerateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
