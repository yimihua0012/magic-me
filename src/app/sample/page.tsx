import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Images, Sparkles } from 'lucide-react'
import StaticMarketingShell from '@/components/seo/static-marketing-shell'
import KeywordStrip from '@/components/seo/keyword-strip'
import { buttonStyles } from '@/components/ui/button-styles'
import { coreSeoKeywords, corporateHeadshotSamples, sampleComparisons } from '@/lib/seo-content'

export const metadata: Metadata = {
  title: 'AI Headshot Sample Comparisons Before and After for LinkedIn and Resumes',
  description:
    'See six AI headshot before-and-after comparisons plus corporate portrait samples for LinkedIn, resumes, business profiles, and professional photos.',
  keywords: [
    'AI headshots for LinkedIn',
    'AI resume photo generator',
    'professional headshots without photographer',
    'realistic AI headshot generator',
  ],
  alternates: {
    canonical: '/sample',
  },
}

export default function SamplePage() {
  return (
    <StaticMarketingShell>
      <main>
        <section className="bg-slate-950 py-14 text-white sm:py-20">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-accent-300">
              <Images className="h-6 w-6" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              AI Headshot Sample Comparisons
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
              Explore six before-and-after examples for Magic-Headshot, including AI headshots for LinkedIn, AI resume
              photo generator use cases, business portrait AI generator styles, and professional headshots without
              photographer scheduling. The page also includes corporate headshot samples for LinkedIn and resume use.
            </p>
            <div className="mt-7">
              <KeywordStrip keywords={coreSeoKeywords.slice(0, 6)} />
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-2">
              {sampleComparisons.map((sample) => (
                <article key={sample.title} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                  <div className="grid grid-cols-2 border-b border-slate-200">
                    <div className="relative aspect-[4/5] bg-slate-100">
                      <Image src={sample.before} alt={sample.beforeAlt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
                    </div>
                    <div className="relative aspect-[4/5] bg-slate-100">
                      <Image src={sample.after} alt={sample.afterAlt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700">
                      <Sparkles className="h-3.5 w-3.5" />
                      {sample.keyword}
                    </div>
                    <h2 className="text-xl font-bold text-slate-950">{sample.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{sample.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                Corporate AI Headshot Samples
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-600">
                These corporate portrait examples show how Magic-Headshot can support AI headshots for LinkedIn,
                professional headshots without photographer scheduling, AI resume photo generator needs, and business
                profile pages.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {corporateHeadshotSamples.map((sample) => (
                <article key={sample.src} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                  <div className="relative aspect-[4/5] bg-slate-100">
                    <Image
                      src={sample.src}
                      alt={sample.alt}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-slate-950">{sample.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      A polished corporate style for LinkedIn, resumes, company bios, and professional profile photos.
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-12">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-950">Use samples to choose your direction</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Samples help you compare realistic AI headshot generator outputs before deciding whether you need a
              LinkedIn profile photo maker look, a resume-ready portrait, or a business profile image.
            </p>
            <Link href="/pricing" className={buttonStyles({ size: 'lg', className: 'mt-7' })}>
              Generate Your Headshots
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>
    </StaticMarketingShell>
  )
}
