import { appConfig } from '@/lib/config'
import { localePath, type Locale } from '@/lib/i18n'

const defaultSeoImage = `/home-pages/${encodeURIComponent('Ai headshot-linkedin-professional.jpg')}`

type JsonLdImage = {
  url: string
  width?: number
  height?: number
}

interface WebPageJsonLdProps {
  locale: Locale
  path: string
  type?: 'WebPage' | 'ContactPage' | 'CollectionPage'
  title: string
  description: string
  image?: string | JsonLdImage
}

interface FaqPageJsonLdProps {
  locale: Locale
  path: string
  title: string
  description: string
  items: readonly { question: string; answer: string }[]
}

interface CollectionPageJsonLdProps extends WebPageJsonLdProps {
  items: readonly { name: string; description?: string; image?: string }[]
}

interface BreadcrumbJsonLdProps {
  locale: Locale
  path: string
  currentName: string
  parent?: {
    name: string
    path: string
  }
}

function absoluteUrl(pathOrUrl: string) {
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl
  }

  const siteUrl = appConfig.url.replace(/\/$/, '')
  return `${siteUrl}${pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`}`
}

function pageUrl(locale: Locale, path: string) {
  return absoluteUrl(localePath(locale, path))
}

function imageObject(image?: string | JsonLdImage) {
  if (!image) return undefined

  if (typeof image === 'string') {
    return absoluteUrl(image)
  }

  return {
    '@type': 'ImageObject',
    url: absoluteUrl(image.url),
    width: image.width,
    height: image.height,
  }
}

function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

function homeName(locale: Locale) {
  const labels: Record<Locale, string> = {
    en: 'Home',
    es: 'Inicio',
    fr: 'Accueil',
    de: 'Startseite',
    ja: 'ホーム',
  }

  return labels[locale]
}

export function BreadcrumbJsonLd({ locale, path, currentName, parent }: BreadcrumbJsonLdProps) {
  const items = [
    {
      name: homeName(locale),
      item: pageUrl(locale, '/'),
    },
    ...(parent
      ? [
          {
            name: parent.name,
            item: pageUrl(locale, parent.path),
          },
        ]
      : []),
    {
      name: currentName,
      item: pageUrl(locale, path),
    },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  }

  return <JsonLdScript data={jsonLd} />
}

export function WebPageJsonLd({
  locale,
  path,
  type = 'WebPage',
  title,
  description,
  image = defaultSeoImage,
}: WebPageJsonLdProps) {
  const url = pageUrl(locale, path)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${url}#webpage`,
    name: title,
    description,
    url,
    inLanguage: locale,
    isPartOf: {
      '@id': `${appConfig.url.replace(/\/$/, '')}/#website`,
    },
    primaryImageOfPage: imageObject(image),
  }

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <BreadcrumbJsonLd locale={locale} path={path} currentName={title} />
    </>
  )
}

export function FaqPageJsonLd({ locale, path, title, description, items }: FaqPageJsonLdProps) {
  const url = pageUrl(locale, path)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    name: title,
    description,
    url,
    inLanguage: locale,
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <BreadcrumbJsonLd locale={locale} path={path} currentName={title} />
    </>
  )
}

export function CollectionPageJsonLd({
  locale,
  path,
  title,
  description,
  image = defaultSeoImage,
  items,
}: CollectionPageJsonLdProps) {
  const url = pageUrl(locale, path)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#collection`,
    name: title,
    description,
    url,
    inLanguage: locale,
    primaryImageOfPage: imageObject(image),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'ImageObject',
          name: item.name,
          description: item.description,
          contentUrl: item.image ? absoluteUrl(item.image) : undefined,
        },
      })),
    },
  }

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <BreadcrumbJsonLd locale={locale} path={path} currentName={title} />
    </>
  )
}
