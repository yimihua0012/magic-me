import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Upload Photos',
  description:
    'Upload clear selfies to Magic-Headshot, choose professional portrait styles, and generate realistic AI headshots for LinkedIn, resumes, and profiles.',
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
