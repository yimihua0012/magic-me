import { privatePageMetadata } from '@/lib/private-page-metadata'

export const metadata = {
  ...privatePageMetadata,
  title: 'Dashboard',
  description:
    'View your AI headshot history, check remaining credits, manage packages, and download professional portraits for LinkedIn, resumes, and business profiles.',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
