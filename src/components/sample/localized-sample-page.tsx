import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Images, Sparkles } from 'lucide-react'
import Navbar from '@/components/layout/localized-navbar'
import Footer from '@/components/layout/localized-footer'
import Card from '@/components/ui/card'
import { buttonStyles } from '@/components/ui/button-styles'
import { sampleComparisons } from '@/lib/seo-content'
import { localePath, type RoutedLocale } from '@/lib/i18n'
import { withSource } from '@/lib/navigation-source'
import type { LocalizedSampleContent } from '@/lib/localized-marketing-content'

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
            <div className="grid gap-10">
              {sampleComparisons.slice(0, 4).map((sample) => (
                <Card key={sample.title} className="overflow-hidden">
                  <div className="grid gap-4 border-b border-slate-200 p-4 sm:gap-5 sm:p-5 md:grid-cols-3 lg:gap-6">
                    <div className="mx-auto w-full max-w-[280px] overflow-hidden rounded-md border border-slate-200 bg-white sm:max-w-none">
                      <div className="flex min-h-[60px] items-center justify-center bg-slate-900 px-4 py-3 text-center text-[13px] font-bold leading-5 text-white">
                        {content.originalLabel}
                      </div>
                      <div className="relative aspect-[4/5] bg-slate-100">
                        <Image src={sample.original.src} alt={sample.original.alt} fill sizes="(min-width: 1024px) 28vw, (min-width: 768px) 31vw, 280px" className="object-cover" />
                      </div>
                    </div>
                    {sample.generated.map((generated) => (
                      <div key={generated.src} className="mx-auto w-full max-w-[280px] overflow-hidden rounded-md border border-slate-200 bg-white sm:max-w-none">
                        <div className="flex min-h-[60px] items-center justify-center bg-primary-600 px-4 py-3 text-center text-[13px] font-bold leading-5 text-white">
                          {content.generatedLabel}
                        </div>
                        <div className="relative aspect-[4/5] bg-slate-100">
                          <Image src={generated.src} alt={generated.alt} fill sizes="(min-width: 1024px) 28vw, (min-width: 768px) 31vw, 280px" className="object-cover" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-6">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700">
                      <Sparkles className="h-3.5 w-3.5" />
                      {sample.keyword}
                    </div>
                    <h2 className="text-xl font-bold text-slate-950">{sample.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{sample.description}</p>
                  </div>
                </Card>
              ))}
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
