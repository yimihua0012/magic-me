import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Images, Sparkles } from 'lucide-react'
import StaticMarketingShell from '@/components/seo/static-marketing-shell'
import KeywordStrip from '@/components/seo/keyword-strip'
import { CollectionPageJsonLd } from '@/components/seo/page-json-ld'
import { buttonStyles } from '@/components/ui/button-styles'
import { languageAlternatesForPath } from '@/lib/i18n'
import { coreSeoKeywords, styleShowcaseCards } from '@/lib/seo-content'

export const metadata: Metadata = {
  title: 'Professional Headshot Styles and ID Photo Templates',
  description:
    'Browse professional headshot styles and ID photo templates for LinkedIn, resumes, business headshots, corporate profiles, and teams.',
  keywords: [
    'professional headshot samples',
    'LinkedIn headshots',
    'business headshots',
  ],
  alternates: {
    canonical: '/sample',
    languages: languageAlternatesForPath('/sample'),
  },
}

const categories = Array.from(new Set(styleShowcaseCards.map(card => card.category)))

export default function SamplePage() {
  return (
    <StaticMarketingShell>
      <CollectionPageJsonLd
        locale="en"
        path="/sample"
        title="Professional Headshot Styles and ID Photo Templates"
        description="Browse professional headshot styles and ID photo templates for LinkedIn, resumes, business profiles, and teams."
        image={styleShowcaseCards[0]?.src}
        items={styleShowcaseCards.map((card) => ({
          name: card.name,
          image: card.src,
        }))}
      />
      <main>
        <section className="bg-slate-950 py-14 text-white sm:py-20">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-accent-300">
              <Images className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
              Professional Headshot Styles &amp; ID Photo Templates
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
              Explore the exact scenario looks used by Magic-Headshot: LinkedIn professional headshots, executive
              portraits, business casual profiles, and document ID photo templates for men, women, and children. Pick a
              style and regenerate it with your own face.
            </p>
            <div className="mt-7">
              <KeywordStrip keywords={coreSeoKeywords.slice(0, 6)} />
            </div>
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
                      <div key={card.name} className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
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
                        <div className="flex items-center justify-between gap-2 p-3">
                          <div>
                            <h3 className="truncate text-sm font-bold text-slate-900">{card.name}</h3>
                            <p className="mt-0.5 truncate text-xs text-slate-500">AI headshot style template</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}

            <div className="mt-10 rounded-lg border border-slate-200 bg-slate-50 p-6">
              <div className="mx-auto max-w-2xl text-center">
                <Sparkles className="mx-auto mb-2 h-5 w-5 text-primary-600" />
                <p className="text-sm leading-6 text-slate-600">
                  Every style above is a template: your face stays yours, while the wardrobe, background, and lighting
                  follow the chosen professional headshot or ID photo look.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="content-auto bg-slate-50 py-12">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">Use styles to choose your direction</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Compare professional headshot styles and ID photo templates before deciding whether you need a LinkedIn
              headshot, a resume-ready portrait, or a business profile image.
            </p>
            <Link href="/pricing" className={buttonStyles({ size: 'lg', className: 'mt-7' })}>
              Generate Your Headshots
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <div className="mt-5 flex flex-wrap justify-center gap-4 text-sm font-semibold">
              <Link href="/questions" className="text-primary-600 underline-offset-4 hover:underline">
                Read AI headshot questions
              </Link>
              <Link href="/blog" className="text-primary-600 underline-offset-4 hover:underline">
                Browse AI headshot guides
              </Link>
            </div>
          </div>
        </section>
      </main>
    </StaticMarketingShell>
  )
}