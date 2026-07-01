import type { Metadata } from 'next'
import { appConfig } from '@/lib/config'
import { OPEN_GRAPH_LOCALES, localePath, type RoutedLocale } from '@/lib/i18n'

type LocalizedSocialMetadataInput = {
  locale: RoutedLocale
  path?: string
  title: string
  description: string
  imageAlt?: string
}

export function localizedSocialMetadata({
  locale,
  path = '',
  title,
  description,
  imageAlt,
}: LocalizedSocialMetadataInput): Pick<Metadata, 'openGraph' | 'twitter'> {
  const siteUrl = appConfig.url.replace(/\/$/, '')
  const url = localePath(locale, path)

  return {
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      locale: OPEN_GRAPH_LOCALES[locale],
      siteName: appConfig.name,
      images: [
        {
          url: `${siteUrl}/api/og`,
          width: 1200,
          height: 630,
          alt: imageAlt || `${appConfig.name} ${title}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteUrl}/api/og`],
    },
  }
}
