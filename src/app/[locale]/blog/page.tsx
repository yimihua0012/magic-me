import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, BookOpen, CalendarDays } from 'lucide-react'
import BlogCoverImage from '@/components/blog/blog-cover-image'
import Navbar from '@/components/layout/localized-navbar'
import Footer from '@/components/layout/localized-footer'
import BlogJsonLd from '@/components/seo/blog-json-ld'
import KeywordStrip from '@/components/seo/keyword-strip'
import { blogGeneratedPortraitImages, coreSeoKeywords } from '@/lib/seo-content'
import { getBlogPublishDate } from '@/lib/blog-dates'
import { getBlogIndexLanguageAlternates, getCmsPublishedBlogPosts, localeHasPublishedCmsBlogPosts } from '@/lib/blog-store'
import { isRoutedLocale, localePath, ROUTED_LOCALES, type RoutedLocale } from '@/lib/i18n'

type PageProps = {
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return ROUTED_LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isRoutedLocale(locale)) return {}

  return {
    title: 'AI Headshot Blog | Magic-Headshot',
    description: 'Localized AI headshot guides for LinkedIn photos, resume portraits, profile photos, and business portraits.',
    alternates: {
      canonical: localePath(locale, '/blog'),
      languages: await getBlogIndexLanguageAlternates(),
    },
    robots: {
      index: await localeHasPublishedCmsBlogPosts(locale),
      follow: true,
    },
  }
}

export default async function LocalizedBlogPage({ params }: PageProps) {
  const { locale } = await params
  if (!isRoutedLocale(locale)) notFound()
  const routedLocale = locale as RoutedLocale
  const posts = await getCmsPublishedBlogPosts(routedLocale)

  if (posts.length === 0) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <BlogJsonLd posts={posts} locale={routedLocale} path="/blog" />
      <Navbar locale={routedLocale} />
      <main className="pt-20">
        <section className="bg-slate-50 py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
              <BookOpen className="h-6 w-6" />
            </div>
            <h1 className="break-words text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl">
              AI Headshot Blog
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Localized guides for choosing realistic AI headshots, LinkedIn profile photos, resume portraits, and business profile images.
            </p>
            <div className="mt-7">
              <KeywordStrip keywords={coreSeoKeywords.slice(0, 6)} />
            </div>
          </div>
        </section>

        <section className="content-auto py-12 sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
            {posts.map((post, index) => {
              const portrait = post.coverImage || (index < blogGeneratedPortraitImages.length ? blogGeneratedPortraitImages[index] : null)
              const href = localePath(routedLocale, `/blog/${post.slug}`)

              return (
                <article key={post.slug} className="content-auto flex min-h-[270px] flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  {portrait && (
                    <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-md bg-slate-100">
                      <BlogCoverImage
                        src={'url' in portrait ? portrait.url : portrait.src}
                        alt={'alt' in portrait ? portrait.alt : post.title}
                        sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, calc(100vw - 40px)"
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                  )}
                  <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <CalendarDays className="h-4 w-4" />
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US') : getBlogPublishDate(index)}
                    {post.category && (
                      <>
                        <span className="text-slate-300">/</span>
                        <span className="text-primary-600">{post.category}</span>
                      </>
                    )}
                  </div>
                  <h2 className="break-words text-xl font-bold leading-snug text-slate-950">
                    <Link href={href} className="hover:text-primary-600">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-3 flex-1 break-words text-sm leading-6 text-slate-600">{post.description}</p>
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
      <Footer locale={routedLocale} />
    </div>
  )
}
