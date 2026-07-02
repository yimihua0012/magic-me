import { privatePageMetadata } from '@/lib/private-page-metadata'

export const metadata = {
  ...privatePageMetadata,
  title: 'Generation Status',
}

export default function LocalizedGenerateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
