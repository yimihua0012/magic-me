import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
  description:
    'View your AI headshot history, check remaining credits, manage packages, and download professional portraits for LinkedIn, resumes, and business profiles.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
