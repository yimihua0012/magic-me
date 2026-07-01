import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import LocalizedSamplePage from '@/components/sample/localized-sample-page'
import { CollectionPageJsonLd } from '@/components/seo/page-json-ld'
import { isRoutedLocale, languageAlternatesForPath, localePath, type RoutedLocale } from '@/lib/i18n'
import { localizedSocialMetadata } from '@/lib/localized-metadata'
import { localizedSampleContent } from '@/lib/localized-marketing-content'
import { getLocalizedSeo } from '@/lib/localized-seo'
import { sampleComparisons } from '@/lib/seo-content'

type PageProps = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return [{ locale: 'es' }, { locale: 'fr' }, { locale: 'de' }, { locale: 'ja' }]
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
        image={sampleComparisons[0]?.generated[0]?.src}
        items={sampleComparisons.slice(0, 4).map((sample) => ({
          name: sample.title,
          description: sample.description,
          image: sample.generated[0]?.src,
        }))}
      />
      <LocalizedSamplePage locale={routedLocale} content={content} />
    </>
  )
}
