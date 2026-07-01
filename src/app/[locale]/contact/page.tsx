import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import LocalizedContactPage from '@/components/contact/localized-contact-page'
import { WebPageJsonLd } from '@/components/seo/page-json-ld'
import { isRoutedLocale, languageAlternatesForPath, localePath, type RoutedLocale } from '@/lib/i18n'
import { localizedSocialMetadata } from '@/lib/localized-metadata'
import { localizedContactContent } from '@/lib/localized-marketing-content'
import { getLocalizedSeo } from '@/lib/localized-seo'

type PageProps = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return [{ locale: 'es' }, { locale: 'fr' }, { locale: 'de' }, { locale: 'ja' }]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isRoutedLocale(locale)) return {}
  const content = localizedContactContent[locale]
  const seo = getLocalizedSeo(locale, 'contact')
  return {
    title: content.title,
    description: content.description,
    keywords: seo.keywords,
    alternates: {
      canonical: localePath(locale, '/contact'),
      languages: languageAlternatesForPath('/contact'),
    },
    ...localizedSocialMetadata({
      locale,
      path: '/contact',
      title: content.title,
      description: content.description,
    }),
  }
}

export default async function LocalizedContactRoute({ params }: PageProps) {
  const { locale } = await params
  if (!isRoutedLocale(locale)) notFound()
  const routedLocale = locale as RoutedLocale
  const content = localizedContactContent[routedLocale]

  return (
    <>
      <WebPageJsonLd
        locale={routedLocale}
        path="/contact"
        type="ContactPage"
        title={content.title}
        description={content.description}
      />
      <LocalizedContactPage locale={routedLocale} content={content} />
    </>
  )
}
