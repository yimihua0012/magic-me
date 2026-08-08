import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, CalendarDays, CheckCircle2, Compass, TriangleAlert } from 'lucide-react'
import BlogSectionBody from '@/components/blog/blog-section-body'
import BlogCoverImage from '@/components/blog/blog-cover-image'
import BlogPhotoToolsCta from '@/components/blog/blog-photo-tools-cta'
import StaticMarketingShell from '@/components/seo/static-marketing-shell'
import KeywordStrip from '@/components/seo/keyword-strip'
import BlogPostJsonLd from '@/components/seo/blog-post-json-ld'
import { blogGeneratedPortraitImages } from '@/lib/seo-content'
import { getBlogPublishDate } from '@/lib/blog-dates'
import { getBlogEnhancement } from '@/lib/blog-enhancements'
import { getEnglishBlogCtaContent, getEnglishBlogInternalLinks } from '@/lib/blog-internal-links'
import { getBlogLanguageAlternates, getPublishedBlogPost, getPublishedBlogPosts, getPublishedBlogSlugs, getRelatedPublishedBlogPosts } from '@/lib/blog-store'


type BlogArticlePageProps = {
  params: Promise<{
    slug: string
  }>
}

const defaultWorkflowLinks = [
  {
    href: '/sample',
    label: 'Compare AI headshot samples',
    reason: 'Review original photos and generated professional portraits before choosing a style.',
  },
  {
    href: '/questions',
    label: 'Read AI headshot questions',
    reason: 'Check upload tips, commercial use, credit validity, and realistic likeness guidance.',
  },
  {
    href: '/pricing',
    label: 'View credit packs',
    reason: 'Choose one-time credits for LinkedIn headshots, resume photos, and business portraits.',
  },
]

export async function generateStaticParams() {
  const slugs = await getPublishedBlogSlugs('en')
  return slugs.map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPublishedBlogPost(slug, 'en')

  if (!post) {
    return {
      title: 'AI Headshot Article',
    }
  }

  const fallbackPortrait = blogGeneratedPortraitImages[0] || null
  const portrait = post.coverImage || (fallbackPortrait ? { url: fallbackPortrait.src, alt: fallbackPortrait.alt } : null)

  return {
    title: post.title,
    description: post.description,
    keywords: [...post.keywords],
    alternates: {
      canonical: `/blog/${post.slug}`,
      languages: await getBlogLanguageAlternates(post),
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: `/blog/${post.slug}`,
      images: portrait ? [portrait.url] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: portrait ? [portrait.url] : undefined,
    },
  }
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params
  const post = await getPublishedBlogPost(slug, 'en')

  if (!post) {
    notFound()
  }

  const fallbackPortrait = blogGeneratedPortraitImages[0] || null
  const portrait = post.coverImage || (fallbackPortrait ? { url: fallbackPortrait.src, alt: fallbackPortrait.alt } : null)
  const enhancement = post.enhancement || getBlogEnhancement(post.slug)
  const related = await getRelatedPublishedBlogPosts('en', post.slug, enhancement?.relatedSlugs)
  const workflowLinks = getEnglishBlogInternalLinks(post, getRenderableWorkflowLinks(enhancement?.internalLinks))
  const ctaContent = getEnglishBlogCtaContent(post)

  return (
    <StaticMarketingShell>
      <BlogPostJsonLd post={post} index={0} imagePath={portrait?.url} />
      <main>
        <article className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <Link href="/blog" className="mb-8 inline-flex items-center text-sm font-bold text-primary-600 hover:text-primary-700">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to blog
          </Link>
          <h1 className="break-words text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl">{post.title}</h1>
          <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-slate-500">
            <CalendarDays className="h-4 w-4" />
            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en') : getBlogPublishDate(0)}
          </div>
          <p className="mt-5 break-words text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">{post.description}</p>
          <div className="mt-7">
            <KeywordStrip keywords={post.keywords} />
          </div>

          {portrait && (
            <div className="relative mt-10 aspect-[16/10] overflow-hidden rounded-lg bg-slate-100">
              <BlogCoverImage
                src={portrait.url}
                alt={portrait.alt}
                priority
                sizes="(min-width: 1280px) 1216px, calc(100vw - 32px)"
                className="h-full w-full object-cover object-top"
              />
            </div>
          )}

          <div className="mt-10 rounded-lg bg-slate-50 p-5 text-base leading-8 text-slate-700 sm:p-6">
            <p>{post.intro}</p>
          </div>

          {enhancement && (
            <section className="content-auto mt-10 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <Compass className="h-6 w-6 text-primary-600" />
                <h2 className="break-words text-2xl font-bold text-slate-950">Who this guide is for</h2>
              </div>
              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-md bg-slate-50 p-4">
                  <dt className="text-sm font-bold text-slate-950">Reader</dt>
                  <dd className="mt-2 text-sm leading-6 text-slate-600">{enhancement.audience}</dd>
                </div>
                <div className="rounded-md bg-slate-50 p-4">
                  <dt className="text-sm font-bold text-slate-950">Search intent</dt>
                  <dd className="mt-2 text-sm leading-6 text-slate-600">{enhancement.searchIntent}</dd>
                </div>
              </dl>
              <p className="mt-5 text-base leading-8 text-slate-700">{enhancement.uniqueAngle}</p>
            </section>
          )}

          <div className="content-auto mt-10 space-y-10">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="break-words text-2xl font-bold text-slate-950">{section.heading}</h2>
                <BlogSectionBody body={section.body} />
              </section>
            ))}
          </div>

          {enhancement && (
            <>
              <section className="content-auto mt-12 grid gap-5 md:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-lg border border-accent-100 bg-accent-50 p-5 sm:p-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-accent-600" />
                    <h2 className="break-words text-2xl font-bold text-slate-950">Quality checks</h2>
                  </div>
                  <div className="mt-5 space-y-4">
                    {enhancement.qualityChecks.map((check) => (
                      <div key={check.label}>
                        <h3 className="font-bold text-slate-950">{check.label}</h3>
                        <p className="mt-1 text-sm leading-6 text-slate-700">{check.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-amber-100 bg-amber-50 p-5 sm:p-6">
                  <div className="flex items-center gap-3">
                    <TriangleAlert className="h-6 w-6 text-amber-600" />
                    <h2 className="break-words text-2xl font-bold text-slate-950">Avoid</h2>
                  </div>
                  <ul className="mt-5 space-y-3">
                    {enhancement.avoid.map((item) => (
                      <li key={item} className="text-sm leading-6 text-slate-700">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </>
          )}

          <section className="content-auto mt-10">
            <h2 className="break-words text-2xl font-bold text-slate-950">Use This Guide to Finish Your Photo</h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              Choose the next step based on what this article covers: edit the photo with a focused tool, generate a professional headshot, compare samples, or check pricing.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {workflowLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:border-primary-200 sm:p-5"
                >
                  <h3 className="break-words font-bold leading-snug text-slate-950">{item.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.reason}</p>
                </Link>
              ))}
            </div>
          </section>
        </article>

        <BlogPhotoToolsCta
          locale="en"
          photoTools={ctaContent.photoTools}
          workflow={ctaContent.workflow}
          pricing={ctaContent.pricing}
        />

        <section className="content-auto border-t border-slate-200 bg-slate-50 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="break-words text-2xl font-bold text-slate-950">Related AI Headshot Guides</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {related.map((item) => (
                <Link key={item.slug} href={`/blog/${item.slug}`} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:border-primary-200 sm:p-5">
                  <h3 className="break-words font-bold leading-snug text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </StaticMarketingShell>
  )
}

function getRenderableWorkflowLinks(
  links: { href?: string; label?: string; reason?: string }[] | undefined,
) {
  const publicLinks = (links || []).filter((item): item is { href: string; label: string; reason: string } => (
    typeof item.href === 'string' &&
    /^\/(?!api(?:\/|$)|dashboard(?:\/|$)|upload(?:\/|$)|generate(?:\/|$)|generations(?:\/|$)|login(?:\/|$)|auth(?:\/|$))/.test(item.href) &&
    typeof item.label === 'string' &&
    typeof item.reason === 'string'
  ))

  return publicLinks.length > 0 ? publicLinks : defaultWorkflowLinks
}
