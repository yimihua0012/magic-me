import { notFound } from 'next/navigation'
import { isRoutedLocale } from '@/lib/i18n'

type PageProps = {
  params: Promise<{
    locale: string
    slug: string[]
  }>
}

export default async function LocalizedCatchAllRoute({ params }: PageProps) {
  const { locale } = await params

  if (!isRoutedLocale(locale)) {
    notFound()
  }

  notFound()
}
