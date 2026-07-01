import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, HelpCircle, SearchCheck } from 'lucide-react'
import StaticMarketingShell from '@/components/seo/static-marketing-shell'
import KeywordStrip from '@/components/seo/keyword-strip'
import { buttonStyles } from '@/components/ui/button-styles'
import { languageAlternatesForPath } from '@/lib/i18n'
import { coreSeoKeywords, questions } from '@/lib/seo-content'

export const metadata: Metadata = {
  title: 'AI Headshot Questions and Answers for LinkedIn, Resumes, and Profile Photos',
  description:
    'Answers about Magic-Headshot, AI headshots for LinkedIn, resume photo generation, likeness, upload quality, and professional headshots without photographer sessions.',
  keywords: [
    'Magic-Headshot',
    'AI headshots for LinkedIn',
    'professional headshots without photographer',
    'AI resume photo generator',
  ],
  alternates: {
    canonical: '/questions',
    languages: languageAlternatesForPath('/questions'),
  },
}

export default function QuestionsPage() {
  return (
    <StaticMarketingShell>
      <main>
        <section className="bg-slate-50 py-14 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              AI Headshot Questions and Answers
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Clear answers about Magic-Headshot, AI headshots for LinkedIn, professional headshots without photographer
              sessions, AI resume photo generator workflows, likeness, upload quality, and business profile use.
            </p>
            <div className="mt-7">
              <KeywordStrip keywords={coreSeoKeywords.slice(0, 5)} />
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center gap-3">
              <SearchCheck className="h-6 w-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-slate-950">Common Questions</h2>
            </div>
            <div className="space-y-4">
              {questions.map((item) => (
                <article key={item.question} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-950">{item.question}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-primary-600 py-12 text-white">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold">Ready to compare real AI headshot samples?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-primary-100">
              Review original photo and generated portrait examples before choosing styles for LinkedIn, resumes, and
              business profiles.
            </p>
            <Link href="/sample" className={buttonStyles({ size: 'lg', className: 'mt-7 bg-white text-primary-600 hover:bg-primary-50' })}>
              View Sample Comparisons
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>
    </StaticMarketingShell>
  )
}
