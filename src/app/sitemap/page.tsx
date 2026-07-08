import type { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink, Map, SearchCheck } from 'lucide-react'
import StaticMarketingShell from '@/components/seo/static-marketing-shell'
import { getSitemapIndexEntries } from '@/lib/sitemap'

export const metadata: Metadata = {
  title: 'Magic-Headshot Sitemap Index',
  description:
    'Find every Magic-Headshot XML sitemap for English, Spanish, French, German, and Japanese pages in one public sitemap index.',
  alternates: {
    canonical: '/sitemap',
    languages: {
      en: '/sitemap',
      'x-default': '/sitemap',
    },
  },
}

export default function PublicSitemapPage() {
  const sitemapEntries = getSitemapIndexEntries()

  return (
    <StaticMarketingShell>
      <main>
        <section className="bg-slate-50 py-14 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
              <Map className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Magic-Headshot Sitemap Index
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              This page collects the public XML sitemap files for Magic-Headshot, including English and localized
              pages. Search engines can also discover these sitemap URLs from robots.txt.
            </p>
          </div>
        </section>

        <section className="content-auto py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center gap-3">
              <SearchCheck className="h-6 w-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-slate-950">XML Sitemap Files</h2>
            </div>

            <div className="divide-y divide-slate-200 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              {sitemapEntries.map((entry) => (
                <a
                  key={entry.url}
                  href={entry.url}
                  className="flex flex-col gap-2 px-5 py-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span>
                    <span className="block text-sm font-bold uppercase tracking-wide text-primary-600">
                      {entry.locale}
                    </span>
                    <span className="mt-1 block break-all text-sm font-medium text-slate-700">{entry.url}</span>
                  </span>
                  <ExternalLink className="h-4 w-4 flex-none text-slate-400" />
                </a>
              ))}
            </div>

            <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
              <p>
                For human browsing, start from the <Link href="/blog" className="font-semibold text-primary-600 hover:underline">blog</Link>,
                {' '}<Link href="/sample" className="font-semibold text-primary-600 hover:underline">sample gallery</Link>,
                {' '}or <Link href="/questions" className="font-semibold text-primary-600 hover:underline">questions page</Link>.
              </p>
            </div>
          </div>
        </section>
      </main>
    </StaticMarketingShell>
  )
}
