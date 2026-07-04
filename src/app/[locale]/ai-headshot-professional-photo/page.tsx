import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import UseCasePageView from '@/components/use-case/use-case-page-view'
import { isRoutedLocale, ROUTED_LOCALES, type RoutedLocale } from '@/lib/i18n'
import { getLocalizedSeo } from '@/lib/localized-seo'
import { buildUseCasePageMetadata, getUseCasePageContent } from '@/lib/use-case-pages'

const slug = 'ai-headshot-professional-photo'
const seoPage = 'aiHeadshotProfessionalPhoto'

type PageProps = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return ROUTED_LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isRoutedLocale(locale)) return {}
  const seo = getLocalizedSeo(locale, seoPage)
  return buildUseCasePageMetadata({ slug, locale, keywords: seo.keywords })
}

export default async function LocalizedAiHeadshotProfessionalPhotoPage({ params }: PageProps) {
  const { locale } = await params
  if (!isRoutedLocale(locale)) notFound()
  const routedLocale = locale as RoutedLocale
  return <UseCasePageView locale={routedLocale} slug={slug} content={getUseCasePageContent(slug, routedLocale)} />
}
