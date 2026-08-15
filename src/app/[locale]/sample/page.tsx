import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import LocalizedSamplePage from '@/components/sample/localized-sample-page'
import { CollectionPageJsonLd } from '@/components/seo/page-json-ld'
import { ROUTED_LOCALES, isRoutedLocale, languageAlternatesForPath, localePath, type RoutedLocale } from '@/lib/i18n'
import { localizedSocialMetadata } from '@/lib/localized-metadata'
import { localizedSampleContent } from '@/lib/localized-marketing-content'
import { getLocalizedSeo } from '@/lib/localized-seo'
import { styleShowcaseCards } from '@/lib/seo-content'

type PageProps = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return ROUTED_LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isRoutedLocale(locale)) return {}
  const content = localizedSampleContent[locale]
  const seo = getLocalizedSeo(locale, 'sample')
  return {
    title: content.title,
    description: content.description,
    keywords: seo.keywords,
    alternates: {
      canonical: localePath(locale, '/sample'),
      languages: languageAlternatesForPath('/sample'),
    },
    ...localizedSocialMetadata({
      locale,
      path: '/sample',
      title: content.title,
      description: content.description,
    }),
  }
}

export default async function LocalizedSampleRoute({ params }: PageProps) {
  const { locale } = await params
  if (!isRoutedLocale(locale)) notFound()
  const routedLocale = locale as RoutedLocale
  const content = localizedSampleContent[routedLocale]

  return (
    <>
      <CollectionPageJsonLd
        locale={routedLocale}
        path="/sample"
        title={content.title}
        description={content.description}
        image={styleShowcaseCards[0]?.src}
        items={styleShowcaseCards.slice(0, 4).map((card) => ({
          name: card.name,
          description: content.description,
          image: card.src,
        }))}
      />
      <LocalizedSamplePage locale={routedLocale} content={content} />
    </>
  )
}
