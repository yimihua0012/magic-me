import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import LocalizedQuestionsPage from '@/components/questions/localized-questions-page'
import { FaqPageJsonLd } from '@/components/seo/page-json-ld'
import { isRoutedLocale, languageAlternatesForPath, localePath, type RoutedLocale } from '@/lib/i18n'
import { localizedSocialMetadata } from '@/lib/localized-metadata'
import { localizedQuestionsContent } from '@/lib/localized-marketing-content'
import { getLocalizedSeo } from '@/lib/localized-seo'

type PageProps = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return [{ locale: 'es' }, { locale: 'fr' }, { locale: 'de' }, { locale: 'ja' }]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isRoutedLocale(locale)) return {}
  const content = localizedQuestionsContent[locale]
  const seo = getLocalizedSeo(locale, 'questions')
  return {
    title: content.title,
    description: content.description,
    keywords: seo.keywords,
    alternates: {
      canonical: localePath(locale, '/questions'),
      languages: languageAlternatesForPath('/questions'),
    },
    ...localizedSocialMetadata({
      locale,
      path: '/questions',
      title: content.title,
      description: content.description,
    }),
  }
}

export default async function LocalizedQuestionsRoute({ params }: PageProps) {
  const { locale } = await params
  if (!isRoutedLocale(locale)) notFound()
  const routedLocale = locale as RoutedLocale
  const content = localizedQuestionsContent[routedLocale]

  return (
    <>
      <FaqPageJsonLd
        locale={routedLocale}
        path="/questions"
        title={content.title}
        description={content.description}
        items={content.questions}
      />
      <LocalizedQuestionsPage locale={routedLocale} content={content} />
    </>
  )
}
