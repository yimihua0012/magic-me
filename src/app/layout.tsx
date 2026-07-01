import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { headers } from 'next/headers'
import './globals.css'
import ButtonClickTracker from '@/components/ui/button-click-tracker'
import DeferredPageEffects from '@/components/layout/deferred-page-effects'
import HtmlLangSync from '@/components/layout/html-lang-sync'
import { appConfig } from '@/lib/config'
import { DEFAULT_LOCALE, isLocale, isRoutedLocale, localePath, type Locale, type RoutedLocale } from '@/lib/i18n'
import { localizedHomeContent } from '@/lib/localized-home-content'
import { getLocalizedSeo } from '@/lib/localized-seo'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-inter',
  fallback: ['system-ui', 'sans-serif'],
})

const siteUrl = appConfig.url.replace(/\/$/, '')
const siteDescription = appConfig.description
const siteKeywords = appConfig.keywords
  .split(',')
  .map((keyword) => keyword.trim())
  .filter(Boolean)
  .slice(0, 5)

const englishJsonLdFaq = [
  {
    '@type': 'Question',
    name: 'How to get professional headshots without a photographer?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Use our AI headshot generator to get realistic headshots without hiring a photographer. Simply upload your selfie, choose a style, and get high-likeness portraits in minutes.',
    },
  },
  {
    '@type': 'Question',
    name: 'What is the best AI headshot generator for LinkedIn profile?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Our AI headshot generator creates realistic LinkedIn profile photos with a dedicated portrait model, fast generation, and styles for business, resume, and executive use.',
    },
  },
  {
    '@type': 'Question',
    name: 'Can I get AI headshots with different backgrounds?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Yes. Our AI headshot generator offers multiple background options for different professional contexts and platforms.',
    },
  },
  {
    '@type': 'Question',
    name: 'Do you offer professional headshots for team photos online?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Yes. Teams can use our AI headshot generator to create consistent professional portraits for remote teams, company pages, and profile photos.',
    },
  },
]

const localizedJsonLdFaq: Record<RoutedLocale, typeof englishJsonLdFaq> = {
  es: [
    {
      '@type': 'Question',
      name: '¿Cómo crear retratos profesionales sin fotógrafo?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sube selfies claros, elige estilos profesionales y genera retratos realistas con IA para LinkedIn, CV y perfiles de negocio en minutos.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Necesito una suscripción?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Compras créditos una vez y los usas para generar los estilos que elijas.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Puedo usar los retratos comercialmente?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sí. Puedes usar los resultados en LinkedIn, CV, perfiles de empresa, sitios web y materiales profesionales.',
      },
    },
  ],
  fr: [
    {
      '@type': 'Question',
      name: 'Comment obtenir des portraits professionnels sans photographe ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Importez des selfies clairs, choisissez des styles professionnels et générez des portraits IA réalistes pour LinkedIn, CV et profils business en quelques minutes.',
      },
    },
    {
      '@type': 'Question',
      name: 'Ai-je besoin d’un abonnement ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Non. Vous achetez des crédits une seule fois et les utilisez pour générer les styles choisis.',
      },
    },
    {
      '@type': 'Question',
      name: 'Puis-je utiliser les portraits commercialement ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui. Les résultats peuvent être utilisés sur LinkedIn, CV, profils d’entreprise, sites web et supports professionnels.',
      },
    },
  ],
  de: [
    {
      '@type': 'Question',
      name: 'Wie bekomme ich professionelle Headshots ohne Fotografen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Lade klare Selfies hoch, wähle professionelle Stile und erstelle in Minuten realistische KI-Headshots für LinkedIn, Lebenslauf und Business-Profile.',
      },
    },
    {
      '@type': 'Question',
      name: 'Brauche ich ein Abonnement?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nein. Du kaufst einmalig Credits und nutzt sie für die ausgewählten Stile.',
      },
    },
    {
      '@type': 'Question',
      name: 'Darf ich die Headshots kommerziell nutzen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ja. Die Ergebnisse können für LinkedIn, Lebenslauf, Unternehmensprofile, Websites und berufliche Materialien genutzt werden.',
      },
    },
  ],
  ja: [
    {
      '@type': 'Question',
      name: '写真館を使わずにプロ向けヘッドショットを作れますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '鮮明なセルフィーをアップロードし、プロ向けスタイルを選ぶだけで、LinkedIn、履歴書、ビジネスプロフィール向けのリアルなAIヘッドショットを数分で作成できます。',
      },
    },
    {
      '@type': 'Question',
      name: 'サブスクリプションは必要ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'いいえ。一回払いでクレジットを購入し、選択したスタイルの生成に利用します。',
      },
    },
    {
      '@type': 'Question',
      name: '商用利用できますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'はい。LinkedIn、履歴書、会社プロフィール、Webサイト、業務用プロフィールに利用できます。',
      },
    },
  ],
}

function getJsonLdContent(locale: Locale) {
  if (isRoutedLocale(locale)) {
    const homeContent = localizedHomeContent[locale]
    return {
      description: homeContent.description,
      url: `${siteUrl}${localePath(locale)}`,
      keywords: getLocalizedSeo(locale, 'home').keywords.join(', '),
      faq: localizedJsonLdFaq[locale],
    }
  }

  return {
    description: siteDescription,
    url: siteUrl,
    keywords: siteKeywords.join(', '),
    faq: englishJsonLdFaq,
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#4F46E5',
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: appConfig.title,
    template: `%s | ${appConfig.name}`,
  },
  description: siteDescription,
  keywords: siteKeywords,
  authors: [{ name: appConfig.name }],
  creator: appConfig.name,
  publisher: appConfig.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: appConfig.title,
    description: siteDescription,
    type: 'website',
    locale: 'en_US',
    siteName: appConfig.name,
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}/api/og`,
        width: 1200,
        height: 630,
        alt: `${appConfig.name} - Best AI Headshot Generator for LinkedIn Profile`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: appConfig.title,
    description: siteDescription,
    images: [`${siteUrl}/api/og`],
  },
  icons: {
    icon: '/api/icon?size=32',
    apple: '/api/icon?size=180',
  },
  manifest: '/manifest.json',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const requestHeaders = await headers()
  const requestLocale = requestHeaders.get('x-mh-locale')
  const locale = requestLocale && isLocale(requestLocale) ? requestLocale : DEFAULT_LOCALE
  const jsonLdContent = getJsonLdContent(locale)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: appConfig.name,
    description: jsonLdContent.description,
    url: jsonLdContent.url,
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Web',
    keywords: jsonLdContent.keywords,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '10000',
    },
    FAQ: jsonLdContent.faq,
  }

  return (
    <html lang={locale} className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`min-h-screen bg-white ${inter.className}`}>
        {children}
        <HtmlLangSync />
        <ButtonClickTracker />
        <DeferredPageEffects />
      </body>
    </html>
  )
}
