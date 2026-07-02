import { privatePageMetadata } from '@/lib/private-page-metadata'

export const metadata = {
  ...privatePageMetadata,
  title: 'Dashboard',
}

export default function LocalizedDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
