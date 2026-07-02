import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Images, Sparkles } from 'lucide-react'
import StaticMarketingShell from '@/components/seo/static-marketing-shell'
import KeywordStrip from '@/components/seo/keyword-strip'
import { CollectionPageJsonLd } from '@/components/seo/page-json-ld'
import { buttonStyles } from '@/components/ui/button-styles'
import { languageAlternatesForPath } from '@/lib/i18n'
import { coreSeoKeywords, sampleComparisons } from '@/lib/seo-content'

export const metadata: Metadata = {
  title: 'AI Headshot Sample Comparisons Before and After for LinkedIn and Resumes',
  description:
    'See real AI headshot comparison groups with original photos and generated corporate portraits for LinkedIn, resumes, business profiles, and professional photos.',
  keywords: [
    'AI headshots for LinkedIn',
    'AI resume photo generator',
    'professional headshots without photographer',
    'realistic AI headshot generator',
  ],
  alternates: {
    canonical: '/sample',
    languages: languageAlternatesForPath('/sample'),
  },
}

export default function SamplePage() {
  return (
    <StaticMarketingShell>
      <CollectionPageJsonLd
        locale="en"
        path="/sample"
        title="AI Headshot Sample Comparisons"
        description="See real AI headshot comparison groups with original photos and generated corporate portraits for LinkedIn, resumes, business profiles, and professional photos."
        image={sampleComparisons[0]?.generated[0]?.src}
        items={sampleComparisons.map((sample) => ({
          name: sample.title,
          description: sample.description,
          image: sample.generated[0]?.src,
        }))}
      />
      <main>
        <section className="bg-slate-950 py-14 text-white sm:py-20">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-accent-300">
              <Images className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
              AI Headshot Sample Comparisons
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
              Explore real Magic-Headshot comparison groups: one original reference photo and two generated AI
              headshots for LinkedIn, AI resume photo generator use cases, business portrait AI generator styles, and
              professional headshots without photographer scheduling.
            </p>
            <div className="mt-7">
              <KeywordStrip keywords={coreSeoKeywords.slice(0, 6)} />
            </div>
          </div>
        </section>

        <section className="content-auto py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10">
              {sampleComparisons.map((sample) => (
                <article key={sample.title} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                  <div className="grid gap-4 border-b border-slate-200 p-4 sm:gap-5 sm:p-5 md:grid-cols-3 lg:gap-6">
                    <div className="mx-auto w-full max-w-[280px] overflow-hidden rounded-md border border-slate-200 bg-white sm:max-w-none">
                      <div className="flex min-h-[60px] items-center justify-center bg-slate-900 px-4 py-3 text-center text-[13px] font-extrabold leading-5 text-white">
                        original photos provided by the user
                      </div>
                      <div className="relative aspect-[4/5] bg-slate-100">
                        <Image
                          src={sample.original.src}
                          alt={sample.original.alt}
                          fill
                          sizes="(min-width: 1024px) 28vw, (min-width: 768px) 31vw, 280px"
                          className="object-cover"
                        />
                      </div>
                    </div>
                    {sample.generated.map((generated) => (
                      <div key={generated.src} className="mx-auto w-full max-w-[280px] overflow-hidden rounded-md border border-slate-200 bg-white sm:max-w-none">
                        <div className="flex min-h-[60px] items-center justify-center bg-primary-600 px-4 py-3 text-center text-[13px] font-extrabold leading-5 text-white">
                          generated corporate portraits for professional photos
                        </div>
                        <div className="relative aspect-[4/5] bg-slate-100">
                          <Image
                            src={generated.src}
                            alt={generated.alt}
                            fill
                            sizes="(min-width: 1024px) 28vw, (min-width: 768px) 31vw, 280px"
                            className="object-cover"
                          />
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
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {sample.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="content-auto bg-slate-50 py-12">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">Use samples to choose your direction</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Samples help you compare realistic AI headshot generator outputs before deciding whether you need a
              LinkedIn profile photo maker look, a resume-ready portrait, or a business profile image.
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
