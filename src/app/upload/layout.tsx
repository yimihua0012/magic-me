import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Upload Photos',
  description: 'Upload your selfies to generate AI headshots.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function UploadLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
