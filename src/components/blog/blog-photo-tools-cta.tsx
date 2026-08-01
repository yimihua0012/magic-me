import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { localePath, type Locale } from '@/lib/i18n'

type BlogPhotoToolsCtaProps = {
  locale: Locale
  photoTools: BlogCtaItem
  workflow: BlogCtaItem
  pricing: BlogCtaItem
  variant?: 'white' | 'muted'
}

type BlogCtaItem = {
  heading: string
  description: string
  linkLabel: string
  href?: string
}

export default function BlogPhotoToolsCta({
  locale,
  photoTools,
  workflow,
  pricing,
  variant = 'muted',
}: BlogPhotoToolsCtaProps) {
  const backgroundClass = variant === 'white' ? 'bg-white' : 'bg-slate-50'
  const items = [
    {
      ...photoTools,
      href: localePath(locale, photoTools.href || '/photo-tools'),
    },
    {
      ...workflow,
      href: localePath(locale, workflow.href || '/upload'),
    },
    {
      ...pricing,
      href: localePath(locale, pricing.href || '/pricing'),
    },
  ]

  return (
    <section className={`${backgroundClass} py-12 sm:py-16`}>
      <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:gap-5 sm:px-6 md:grid-cols-3 lg:px-8">
        {items.map((item) => (
          <article key={item.href} className="flex min-h-[190px] flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:min-h-[230px] sm:p-6">
            <h2 className="break-words text-xl font-bold leading-snug text-slate-950 sm:text-2xl">{item.heading}</h2>
            <p className="mt-3 flex-1 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">{item.description}</p>
            <Link href={item.href} className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-primary-600 px-5 text-center text-sm font-bold text-white shadow-md shadow-primary-600/20 transition hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-600/25 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:mt-6 sm:w-fit">
              {item.linkLabel}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
