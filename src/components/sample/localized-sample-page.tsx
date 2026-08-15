import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Images, Sparkles } from 'lucide-react'
import Navbar from '@/components/layout/localized-navbar'
import Footer from '@/components/layout/localized-footer'
import Card from '@/components/ui/card'
import { buttonStyles } from '@/components/ui/button-styles'
import { styleShowcaseCards } from '@/lib/seo-content'
import { localePath, type RoutedLocale } from '@/lib/i18n'
import { withSource } from '@/lib/navigation-source'
import type { LocalizedSampleContent } from '@/lib/localized-marketing-content'

const categories = Array.from(new Set(styleShowcaseCards.map(card => card.category)))

interface LocalizedSamplePageProps {
  locale: RoutedLocale
  content: LocalizedSampleContent
}

export default function LocalizedSamplePage({ locale, content }: LocalizedSamplePageProps) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar locale={locale} />

      <main className="pt-20">
        <section className="bg-slate-950 py-14 text-white sm:py-20">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-accent-300">
              <Images className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">{content.title}</h1>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
              {content.description}
            </p>
          </div>
        </section>

        <section className="content-auto py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            {categories.map((category) => (
              <div key={category} className="mb-12 last:mb-0">
                <h2 className="mb-6 text-xl font-bold text-slate-900 sm:text-2xl">{category}</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-5">
                  {styleShowcaseCards
                    .filter((card) => card.category === category)
                    .map((card) => (
                      <Card key={card.name} className="overflow-hidden">
                        <div className="relative aspect-square overflow-hidden bg-slate-100">
                          <Image
                            src={card.src}
                            alt={`${card.name} AI headshot style example`}
                            fill
                            sizes="(min-width: 1024px) 23vw, (min-width: 640px) 31vw, 45vw"
                            loading="lazy"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-3">
                          <h3 className="truncate text-sm font-bold text-slate-900">{card.name}</h3>
                          <p className="mt-0.5 truncate text-xs text-slate-500">AI headshot style template</p>
                        </div>
                      </Card>
                    ))}
                </div>
              </div>
            ))}

            <div className="mt-10 rounded-lg border border-slate-200 bg-slate-50 p-6">
              <div className="mx-auto max-w-2xl text-center">
                <Sparkles className="mx-auto mb-2 h-5 w-5 text-primary-600" />
                <p className="text-sm leading-6 text-slate-600">{content.ctaText}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="content-auto bg-slate-50 py-12">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">{content.ctaTitle}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">{content.ctaText}</p>
            <Link href={withSource(localePath(locale, '/pricing'), `sample_cta_pricing_${locale}`)} className={buttonStyles({ size: 'lg', className: 'mt-7' })}>
              {content.cta}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </div>
  )
}