import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import LoginPageView from '@/components/auth/login-page-view'
import { isRoutedLocale, localePath, type RoutedLocale } from '@/lib/i18n'
import { localizedSocialMetadata } from '@/lib/localized-metadata'
import { localizedAuthContent } from '@/lib/localized-auth-content'

type PageProps = {
  params: Promise<{
    locale: string
  }>
}

export function generateStaticParams() {
  return [{ locale: 'es' }, { locale: 'fr' }, { locale: 'de' }, { locale: 'ja' }]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params

  if (!isRoutedLocale(locale)) {
    return {}
  }

  const content = localizedAuthContent[locale]

  return {
    title: content.signInTitle,
    description: content.signInSubtitle,
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: localePath(locale, '/login'),
    },
    ...localizedSocialMetadata({
      locale,
      path: '/login',
      title: content.signInTitle,
      description: content.signInSubtitle,
    }),
  }
}

export default async function LocalizedLoginRoute({ params }: PageProps) {
  const { locale } = await params

  if (!isRoutedLocale(locale)) {
    notFound()
  }

  return <LoginPageView locale={locale as RoutedLocale} />
}
