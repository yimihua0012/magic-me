import { notFound } from 'next/navigation'
import GenerationInfoPageView from '@/components/generations/generation-info-page-view'
import { isRoutedLocale, type RoutedLocale } from '@/lib/i18n'

interface PageProps {
  params: Promise<{ locale: string; id: string }>
}

export default async function LocalizedGenerationInfoPage({ params }: PageProps) {
  const { locale } = await params

  if (!isRoutedLocale(locale)) {
    notFound()
  }

  return <GenerationInfoPageView locale={locale as RoutedLocale} />
}
