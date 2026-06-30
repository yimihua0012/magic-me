import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BookOpen, CalendarDays } from 'lucide-react'
import StaticMarketingShell from '@/components/seo/static-marketing-shell'
import KeywordStrip from '@/components/seo/keyword-strip'
import { blogGeneratedPortraitImages, blogPosts, coreSeoKeywords } from '@/lib/seo-content'
import { getBlogPublishDate } from '@/lib/blog-dates'

export const metadata: Metadata = {
  title: 'AI Image Generation Blog for Headshots, LinkedIn Photos, and Resume Portraits',
  description:
    'Read Magic-Headshot guides about AI image generation, AI headshots for LinkedIn, resume photo generation, profile photos, and professional portraits.',
  keywords: [
    'Magic-Headshot',
    'AI headshots for LinkedIn',
    'professional headshots without photographer',
    'AI resume photo generator',
  ],
  alternates: {
    canonical: '/blog',
  },
}

export default function BlogPage() {
  return (
    <StaticMarketingShell>
      <main>
        <section className="bg-slate-50 py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
              <BookOpen className="h-6 w-6" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              AI Image Generation and Headshot Blog
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Twenty static guides covering Magic-Headshot, AI image generation, AI headshots for LinkedIn, professional
              headshots without photographer sessions, AI resume photo generator workflows, and realistic business portraits.
            </p>
            <div className="mt-7">
              <KeywordStrip keywords={coreSeoKeywords.slice(0, 6)} />
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
            {blogPosts.map((post, index) => {
              const portrait = index < blogGeneratedPortraitImages.length ? blogGeneratedPortraitImages[index] : null

              return (
                <article key={post.slug} className="flex min-h-[270px] flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  {portrait && (
                    <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-md bg-slate-100">
                      <Image
                        src={portrait.src}
                        alt={portrait.alt}
                        fill
                        sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                        className="object-cover object-top"
                      />
                    </div>
                  )}
                  <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <CalendarDays className="h-4 w-4" />
                    {getBlogPublishDate(index)}
                  </div>
                  <h2 className="text-xl font-bold leading-snug text-slate-950">
                    <Link href={`/blog/${post.slug}`} className="hover:text-primary-600">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{post.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {post.keywords.slice(0, 2).map((keyword) => (
                      <span key={keyword} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {keyword}
                      </span>
                    ))}
                  </div>
                  <Link href={`/blog/${post.slug}`} className="mt-5 inline-flex items-center text-sm font-bold text-primary-600 hover:text-primary-700">
                    Read article
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </article>
              )
            })}
          </div>
        </section>
      </main>
    </StaticMarketingShell>
  )
}
