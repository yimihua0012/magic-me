import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen, CalendarDays } from 'lucide-react'
import BlogCoverImage from '@/components/blog/blog-cover-image'
import StaticMarketingShell from '@/components/seo/static-marketing-shell'
import KeywordStrip from '@/components/seo/keyword-strip'
import BlogJsonLd from '@/components/seo/blog-json-ld'
import { blogGeneratedPortraitImages, coreSeoKeywords } from '@/lib/seo-content'
import { getBlogPublishDate } from '@/lib/blog-dates'
import { getBlogEnhancement } from '@/lib/blog-enhancements'
import { getBlogIndexLanguageAlternates, getPublishedBlogPosts } from '@/lib/blog-store'

export async function generateMetadata(): Promise<Metadata> {
  return {
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
      languages: await getBlogIndexLanguageAlternates(),
    },
  }
}

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts('en')

  return (
    <StaticMarketingShell>
      <BlogJsonLd posts={posts} locale="en" path="/blog" />
      <main>
        <section className="bg-slate-50 py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
              <BookOpen className="h-6 w-6" />
            </div>
            <h1 className="break-words text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl">
              AI Image Generation and Headshot Blog
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Twenty static guides covering Magic-Headshot, AI image generation, AI headshots for LinkedIn, professional
              headshots without photographer sessions, AI resume photo generator workflows, and realistic business
              portraits. Browse practical advice on what to upload, how to choose styles, where to use the results, and
              how to keep professional profile photos believable.
            </p>
            <div className="mt-7">
              <KeywordStrip keywords={coreSeoKeywords.slice(0, 6)} />
            </div>
          </div>
        </section>

        <section className="content-auto py-12 sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
            {posts.map((post, index) => {
              const fallbackPortrait = index < blogGeneratedPortraitImages.length ? blogGeneratedPortraitImages[index] : null
              const portrait = post.coverImage || (fallbackPortrait ? { url: fallbackPortrait.src, alt: fallbackPortrait.alt } : null)
              const enhancement = post.enhancement || getBlogEnhancement(post.slug)
              const href = `/blog/${post.slug}`

              return (
                <article key={post.slug} className="content-auto flex min-h-[270px] flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  {portrait && (
                    <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-md bg-slate-100">
                      <BlogCoverImage
                        src={portrait.url}
                        alt={portrait.alt}
                        sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, calc(100vw - 40px)"
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                  )}
                  <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <CalendarDays className="h-4 w-4" />
                    {getBlogPublishDate(index)}
                    {enhancement && (
                      <>
                        <span className="text-slate-300">/</span>
                        <span className="text-primary-600">{enhancement.category}</span>
                      </>
                    )}
                  </div>
                  <h2 className="break-words text-xl font-bold leading-snug text-slate-950">
                    <Link href={`/blog/${post.slug}`} className="hover:text-primary-600">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-3 flex-1 break-words text-sm leading-6 text-slate-600">{post.description}</p>
                  {enhancement && (
                    <p className="mt-3 rounded-md bg-slate-50 px-3 py-2 text-xs font-medium leading-5 text-slate-600">
                      {enhancement.searchIntent}
                    </p>
                  )}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {post.keywords.slice(0, 2).map((keyword) => (
                      <span key={keyword} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {keyword}
                      </span>
                    ))}
                  </div>
                  <Link href={href} className="mt-5 inline-flex items-center text-sm font-bold text-primary-600 hover:text-primary-700">
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
