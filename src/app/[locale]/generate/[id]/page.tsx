import { notFound } from 'next/navigation'
import GenerationPageView from '@/components/generate/generation-page-view'
import { isRoutedLocale, type RoutedLocale } from '@/lib/i18n'

interface PageProps {
  params: Promise<{ locale: string; id: string }>
}

export default async function LocalizedGenerationPage({ params }: PageProps) {
  const { locale } = await params

  if (!isRoutedLocale(locale)) {
    notFound()
  }

  return <GenerationPageView locale={locale as RoutedLocale} />
}
