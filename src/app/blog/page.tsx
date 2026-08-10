import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen, CalendarDays } from 'lucide-react'
import BlogCoverImage from '@/components/blog/blog-cover-image'
import BlogPhotoToolsCta from '@/components/blog/blog-photo-tools-cta'
import StaticMarketingShell from '@/components/seo/static-marketing-shell'
import KeywordStrip from '@/components/seo/keyword-strip'
import BlogJsonLd from '@/components/seo/blog-json-ld'
import BreadcrumbNav from '@/components/seo/breadcrumb-nav'
import { blogGeneratedPortraitImages, coreSeoKeywords } from '@/lib/seo-content'
import { getBlogPublishDate } from '@/lib/blog-dates'
import { getBlogEnhancement } from '@/lib/blog-enhancements'
import { getBlogBreadcrumbLabel } from '@/lib/blog-breadcrumb'
import {
  blogCategoryPath,
  blogPostCategoryLabel,
  getBlogCategoriesFromPosts,
  getBlogIndexLanguageAlternates,
  getPublishedBlogPosts,
  slugifyBlogCategory,
} from '@/lib/blog-store'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'AI Headshot and Photo Tool Blog for Profiles and ID Photos',
    description:
      'Read practical guides for AI headshots, LinkedIn photos, resume portraits, ID photo tools, background changes, resizing, and print layouts.',
    keywords: [
      'Magic-Headshot',
      'AI headshots for LinkedIn',
      'practical photo tools',
    ],
    alternates: {
      canonical: '/blog',
      languages: await getBlogIndexLanguageAlternates(),
    },
  }
}

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts('en')
  const categories = getBlogCategoriesFromPosts(posts, 'en')
  const blogLabel = getBlogBreadcrumbLabel('en')

  return (
    <StaticMarketingShell>
      <BlogJsonLd posts={posts} locale="en" path="/blog" breadcrumbName={blogLabel} />
      <main>
        <section className="bg-slate-50 py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
            <BreadcrumbNav
              className="mb-6 justify-center"
              items={[
                { label: 'Home', href: '/' },
                { label: blogLabel, href: '/blog' },
              ]}
            />
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
              <BookOpen className="h-6 w-6" />
            </div>
            <h1 className="break-words text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl">
              Professional Headshot and Photo Tools Blog
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Read practical guides for professional headshots, LinkedIn photos, resume portraits, ID photo tools,
              background removal, background color changes, cropping, resizing, and printable photo layouts. Each guide
              points you toward the right next step: generate a polished headshot or finish the photo with a focused tool.
            </p>
            <div className="mt-7">
              <KeywordStrip keywords={coreSeoKeywords.slice(0, 6)} />
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-950">Browse blog categories</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Use these category pages to find related headshot, profile photo, resume photo, document photo, and publishing workflow guides.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={blogCategoryPath('en', category.slug)}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
                >
                  {category.label}
                  <span className="ml-2 text-slate-400">{category.count}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="content-auto py-12 sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
            {posts.map((post, index) => {
              const fallbackPortrait = index < blogGeneratedPortraitImages.length ? blogGeneratedPortraitImages[index] : null
              const portrait = post.coverImage || (fallbackPortrait ? { url: fallbackPortrait.src, alt: fallbackPortrait.alt } : null)
              const enhancement = post.enhancement || getBlogEnhancement(post.slug)
              const categoryLabel = blogPostCategoryLabel({ ...post, enhancement })
              const categoryHref = blogCategoryPath('en', slugifyBlogCategory(categoryLabel))
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
                    <span className="text-slate-300">/</span>
                    <Link href={categoryHref} className="text-primary-600 hover:text-primary-700">
                      {categoryLabel}
                    </Link>
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

        <BlogPhotoToolsCta
          locale="en"
          photoTools={{
            heading: 'Use the right photo tool',
            description: 'Open the photo tools to remove a background, change background color, crop an ID photo, resize an image, compress to KB, or build a printable photo sheet.',
            linkLabel: 'Open photo tools',
          }}
          workflow={{
            heading: 'Generate professional headshots',
            description: 'Use the blog guidance to choose a better direction, then generate professional headshots for LinkedIn, resumes, business profiles, team pages, or public bios.',
            linkLabel: 'Generate professional headshots',
          }}
          pricing={{
            heading: 'Choose the right credit pack',
            description: 'Compare one-time credit packs before producing final images for a profile refresh, job application, team page, or document-style photo workflow.',
            linkLabel: 'View pricing',
          }}
        />
      </main>
    </StaticMarketingShell>
  )
}
