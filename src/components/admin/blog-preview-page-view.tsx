'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, Compass, TriangleAlert } from 'lucide-react'
import AdminPageFrame from '@/components/admin/admin-page-frame'
import { useAdminAuth } from '@/components/admin/admin-auth'
import BlogCoverImage from '@/components/blog/blog-cover-image'
import BlogSectionBody from '@/components/blog/blog-section-body'
import KeywordStrip from '@/components/seo/keyword-strip'
import { buttonStyles } from '@/components/ui/button'
import Card from '@/components/ui/card'
import { localePath, type Locale } from '@/lib/i18n'

type BlogStatus = 'draft' | 'published' | 'archived'

type BlogPostPreview = {
  id?: string
  locale: Locale
  slug: string
  status: BlogStatus
  title: string
  description: string
  keywords: string[]
  category?: string
  coverImage?: {
    url: string
    alt: string
  }
  intro: string
  sections: { heading: string; body: string }[]
  enhancement?: {
    audience?: string
    searchIntent?: string
    uniqueAngle?: string
    actionSteps?: string[]
    qualityChecks?: { label: string; detail: string }[]
    avoid?: string[]
    internalLinks?: { href?: string; label?: string; reason?: string }[]
  }
  publishedAt?: string
}

interface BlogPreviewPageViewProps {
  id: string
  locale?: Locale
}

const defaultWorkflowLinks = [
  {
    href: '/sample',
    label: 'Compare samples',
    reason: 'Review original photos and generated professional portraits before choosing a style.',
  },
  {
    href: '/questions',
    label: 'Read questions',
    reason: 'Check upload tips, commercial use, credit validity, and realistic likeness guidance.',
  },
  {
    href: '/pricing',
    label: 'View credit packs',
    reason: 'Choose one-time credits before publishing the article.',
  },
]

export default function BlogPreviewPageView({ id, locale = 'en' }: BlogPreviewPageViewProps) {
  const { accessToken, isAuthorized, isCheckingAuth } = useAdminAuth(locale)
  const [post, setPost] = useState<BlogPostPreview | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!accessToken) return

    const loadPost = async () => {
      setIsLoading(true)
      setError('')

      try {
        const response = await fetch(`/api/admin/blog-posts/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(typeof data.error === 'string' ? data.error : 'Could not load preview.')
        }

        setPost(data.post || null)
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Could not load preview.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadPost()
  }, [accessToken, id])

  if (isCheckingAuth || !isAuthorized) {
    return (
      <AdminPageFrame title="Blog Preview" subtitle="Checking admin access.">
        <Card className="p-6 text-sm text-slate-600">Loading...</Card>
      </AdminPageFrame>
    )
  }

  if (isLoading) {
    return (
      <AdminPageFrame title="Blog Preview" subtitle="Loading saved blog post.">
        <Card className="p-6 text-sm text-slate-600">Loading preview...</Card>
      </AdminPageFrame>
    )
  }

  if (error || !post) {
    return (
      <AdminPageFrame title="Blog Preview" subtitle="Preview unavailable.">
        <Card className="p-6">
          <p className="text-sm font-semibold text-red-600">{error || 'Blog post not found.'}</p>
          <Link href={localePath(locale, '/dashboard/admin/blog')} className={buttonStyles({ variant: 'secondary', className: 'mt-4' })}>
            Back to Blog Content
          </Link>
        </Card>
      </AdminPageFrame>
    )
  }

  const previewLocale = post.locale || locale
  const workflowLinks = getRenderableWorkflowLinks(post.enhancement?.internalLinks, previewLocale)
  const publicHref = post.status === 'published' ? localePath(previewLocale, `/blog/${post.slug}`) : ''

  return (
    <AdminPageFrame
      title="Blog Preview"
      subtitle={`${post.status.toUpperCase()} preview. This admin page is not indexable.`}
    >
      <div className="mb-5 flex flex-wrap gap-3">
        <Link href={localePath(locale, '/dashboard/admin/blog')} className={buttonStyles({ variant: 'secondary' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Editor
        </Link>
        {publicHref && (
          <a href={publicHref} target="_blank" rel="noreferrer" className={buttonStyles()}>
            Open Public URL
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        )}
      </div>

      <article className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white px-5 py-8 shadow-sm sm:px-8">
        <div className="mb-4 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase text-slate-600">
          {previewLocale.toUpperCase()} / {post.status} / {post.category || 'Uncategorized'}
        </div>
        <h1 className="break-words text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl">{post.title}</h1>
        <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-slate-500">
          <CalendarDays className="h-4 w-4" />
          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US') : 'Not published'}
        </div>
        <p className="mt-5 break-words text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">{post.description}</p>
        <div className="mt-7">
          <KeywordStrip keywords={post.keywords || []} />
        </div>

        {post.coverImage && (
          <div className="relative mt-10 aspect-[16/10] overflow-hidden rounded-lg bg-slate-100">
            <BlogCoverImage
              src={post.coverImage.url}
              alt={post.coverImage.alt}
              priority
              sizes="(min-width: 768px) 768px, calc(100vw - 32px)"
              className="h-full w-full object-cover object-top"
            />
          </div>
        )}

        <div className="mt-10 rounded-lg bg-slate-50 p-5 text-base leading-8 text-slate-700 sm:p-6">
          <p>{post.intro}</p>
        </div>

        {post.enhancement && (
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <Compass className="h-6 w-6 text-primary-600" />
              <h2 className="break-words text-2xl font-bold text-slate-950">Who this guide is for</h2>
            </div>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-md bg-slate-50 p-4">
                <dt className="text-sm font-bold text-slate-950">Reader</dt>
                <dd className="mt-2 text-sm leading-6 text-slate-600">{post.enhancement.audience}</dd>
              </div>
              <div className="rounded-md bg-slate-50 p-4">
                <dt className="text-sm font-bold text-slate-950">Search intent</dt>
                <dd className="mt-2 text-sm leading-6 text-slate-600">{post.enhancement.searchIntent}</dd>
              </div>
            </dl>
            <p className="mt-5 text-base leading-8 text-slate-700">{post.enhancement.uniqueAngle}</p>
          </section>
        )}

        <div className="mt-10 space-y-10">
          {(post.sections || []).map((section) => (
            <section key={section.heading}>
              <h2 className="break-words text-2xl font-bold text-slate-950">{section.heading}</h2>
              <BlogSectionBody body={section.body} />
            </section>
          ))}
        </div>

        {post.enhancement?.qualityChecks?.length || post.enhancement?.avoid?.length ? (
          <section className="mt-12 grid gap-5 md:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-lg border border-accent-100 bg-accent-50 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-accent-600" />
                <h2 className="break-words text-2xl font-bold text-slate-950">Quality checks</h2>
              </div>
              <div className="mt-5 space-y-4">
                {(post.enhancement.qualityChecks || []).map((check) => (
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
                {(post.enhancement.avoid || []).map((item) => (
                  <li key={item} className="text-sm leading-6 text-slate-700">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        <section className="mt-12 rounded-lg border border-primary-100 bg-primary-50 p-6">
          <h2 className="break-words text-2xl font-bold text-slate-950">Plan your AI headshot workflow</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
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
    </AdminPageFrame>
  )
}

function getRenderableWorkflowLinks(
  links: { href?: string; label?: string; reason?: string }[] | undefined,
  locale: Locale,
) {
  const publicLinks = (links || []).filter((item): item is { href: string; label: string; reason: string } => (
    typeof item.href === 'string' &&
    /^\/(?!api(?:\/|$)|dashboard(?:\/|$)|upload(?:\/|$)|generate(?:\/|$)|generations(?:\/|$)|login(?:\/|$)|auth(?:\/|$))/.test(item.href) &&
    typeof item.label === 'string' &&
    typeof item.reason === 'string'
  ))

  return (publicLinks.length > 0 ? publicLinks : defaultWorkflowLinks).map((item) => ({
    ...item,
    href: localePath(locale, item.href),
  }))
}
