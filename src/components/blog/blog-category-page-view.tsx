import Link from 'next/link'
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays, HelpCircle } from 'lucide-react'
import BlogCoverImage from '@/components/blog/blog-cover-image'
import BlogPhotoToolsCta from '@/components/blog/blog-photo-tools-cta'
import BlogJsonLd from '@/components/seo/blog-json-ld'
import { FaqPageJsonLd } from '@/components/seo/page-json-ld'
import KeywordStrip from '@/components/seo/keyword-strip'
import type { BlogCategorySeoContent } from '@/lib/blog-category-content'
import { getBlogPublishDate } from '@/lib/blog-dates'
import { blogGeneratedPortraitImages } from '@/lib/seo-content'
import { localePath, type Locale } from '@/lib/i18n'
import type { BlogCategorySummary, BlogPostWithMeta } from '@/lib/blog-store'

type BlogCategoryPageViewProps = {
  locale: Locale
  category: BlogCategorySummary
  content: BlogCategorySeoContent
}

export default function BlogCategoryPageView({ locale, category, content }: BlogCategoryPageViewProps) {
  const categoryPath = `/blog/category/${category.slug}`
  const blogHref = localePath(locale, '/blog')

  return (
    <>
      <BlogJsonLd
        posts={category.posts}
        locale={locale}
        path={categoryPath}
        title={content.title}
        description={content.description}
        includeBreadcrumb={false}
      />
      <FaqPageJsonLd
        locale={locale}
        path={categoryPath}
        title={content.h1}
        description={content.description}
        items={content.faqs}
        parent={{ name: content.blogName, path: '/blog' }}
      />
      <main>
        <section className="bg-slate-50 py-14 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <Link href={blogHref} className="mb-8 inline-flex items-center text-sm font-bold text-primary-600 hover:text-primary-700">
              <ArrowLeft className="mr-1 h-4 w-4" />
              {content.backToBlog}
            </Link>
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                  <BookOpen className="h-6 w-6" />
                </div>
                <p className="mb-3 text-sm font-bold uppercase tracking-wide text-primary-600">{content.articleCount}</p>
                <h1 className="break-words text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl">
                  {content.h1}
                </h1>
                <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
                  {content.intro}
                </p>
              </div>
            </div>
            <div className="mt-7">
              <KeywordStrip keywords={content.keywords} />
            </div>
          </div>
        </section>

        <section className="content-auto py-10 sm:py-12">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <h2 className="break-words text-2xl font-bold leading-tight text-slate-950">
                  {content.h1}
                </h2>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  {content.description}
                </p>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  {content.toolsDescription}
                </p>
              </div>
              <div className="rounded-md bg-slate-50 p-5">
                <p className="text-sm font-bold uppercase tracking-wide text-primary-600">{content.articleCount}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {content.workflowDescription}
                </p>
                <div className="mt-4">
                  <KeywordStrip keywords={content.keywords} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="content-auto py-12 sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
            {category.posts.map((post, index) => {
              const image = blogCardImage(post, index)
              const href = localePath(locale, `/blog/${post.slug}`)

              return (
                <article key={post.slug} className="content-auto flex min-h-[270px] flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  {image && (
                    <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-md bg-slate-100">
                      <BlogCoverImage
                        src={image.url}
                        alt={image.alt}
                        sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, calc(100vw - 40px)"
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                  )}
                  <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <CalendarDays className="h-4 w-4" />
                    {blogDate(locale, post, index)}
                  </div>
                  <h2 className="break-words text-xl font-bold leading-snug text-slate-950">
                    <Link href={href} className="hover:text-primary-600">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-3 flex-1 break-words text-sm leading-6 text-slate-600">{post.description}</p>
                  <Link href={href} className="mt-5 inline-flex items-center text-sm font-bold text-primary-600 hover:text-primary-700">
                    {content.readArticle}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </article>
              )
            })}
          </div>
        </section>

        <BlogPhotoToolsCta
          locale={locale}
          photoTools={{
            heading: content.toolsHeading,
            description: content.toolsDescription,
            linkLabel: content.toolsLink,
          }}
          workflow={{
            heading: content.workflowHeading,
            description: content.workflowDescription,
            linkLabel: content.workflowLink,
          }}
          pricing={{
            heading: content.pricingHeading,
            description: content.pricingDescription,
            linkLabel: content.pricingLink,
          }}
          variant="white"
        />

        <section className="bg-slate-50 py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center gap-3">
              <HelpCircle className="h-6 w-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-slate-950">{content.faqHeading}</h2>
            </div>
            <div className="grid gap-4">
              {content.faqs.map((item) => (
                <article key={item.question} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="break-words text-base font-bold text-slate-950">{item.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

function blogCardImage(post: BlogPostWithMeta, index: number) {
  if (post.coverImage) return post.coverImage
  const fallbackImages: readonly { src: string; alt: string }[] = blogGeneratedPortraitImages
  if (fallbackImages.length === 0) return null
  const fallback = fallbackImages[index % fallbackImages.length]
  return { url: fallback.src, alt: fallback.alt }
}

function blogDate(locale: Locale, post: BlogPostWithMeta, index: number) {
  const date = post.publishedAt || post.updatedAt
  if (date) return new Date(date).toLocaleDateString(locale)
  return getBlogPublishDate(index)
}
