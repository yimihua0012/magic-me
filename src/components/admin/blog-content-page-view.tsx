'use client'

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import AdminPageFrame from '@/components/admin/admin-page-frame'
import { useAdminAuth } from '@/components/admin/admin-auth'
import Button from '@/components/ui/button'
import Card from '@/components/ui/card'
import { LOCALES, localePath, type Locale } from '@/lib/i18n'
import { BookOpenText, CheckCircle2, Copy, ExternalLink, Eye, FilePenLine, Plus, RefreshCw, Sparkles, XCircle } from 'lucide-react'

type BlogStatus = 'draft' | 'published' | 'archived'

type BlogPostAdminItem = {
  id?: string
  locale: Locale
  translationGroupId?: string
  sourcePostId?: string | null
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
  enhancement?: Record<string, unknown>
  localizedSlugs?: Partial<Record<Locale, string>>
  submittedToBing?: boolean
  updatedAt?: string
}

type BlogFormState = {
  id?: string
  locale: Locale
  translationGroupId: string
  sourcePostId: string
  slug: string
  status: BlogStatus
  title: string
  description: string
  keywords: string
  category: string
  coverImageUrl: string
  coverImageAlt: string
  intro: string
  sectionsJson: string
  enhancementJson: string
  localizedSlugsJson: string
  submittedToBing: boolean
}

interface BlogContentPageViewProps {
  locale?: Locale
}

const emptySections = [
  { heading: 'Search intent', body: '' },
  { heading: 'What to prepare', body: '' },
  { heading: 'Quality checklist', body: '' },
]

const defaultForm: BlogFormState = {
  locale: 'en',
  translationGroupId: '',
  sourcePostId: '',
  slug: '',
  status: 'draft',
  title: '',
  description: '',
  keywords: '',
  category: '',
  coverImageUrl: '',
  coverImageAlt: '',
  intro: '',
  sectionsJson: JSON.stringify(emptySections, null, 2),
  enhancementJson: '{}',
  localizedSlugsJson: '{}',
  submittedToBing: false,
}

export default function BlogContentPageView({ locale = 'en' }: BlogContentPageViewProps) {
  const { accessToken, dashboardHref, isAuthorized, isCheckingAuth } = useAdminAuth(locale)
  const [posts, setPosts] = useState<BlogPostAdminItem[]>([])
  const [form, setForm] = useState<BlogFormState>(defaultForm)
  const [selectedLocale, setSelectedLocale] = useState<Locale>('en')
  const [selectedStatus, setSelectedStatus] = useState<BlogStatus | 'all'>('all')
  const [query, setQuery] = useState('')
  const [draftLocale, setDraftLocale] = useState<Locale>('en')
  const [draftRelatedTerms, setDraftRelatedTerms] = useState('')
  const [draftKeywords, setDraftKeywords] = useState('')
  const [draftPrompt, setDraftPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const filteredPostsLabel = useMemo(() => {
    const status = selectedStatus === 'all' ? 'all statuses' : selectedStatus
    return `${selectedLocale.toUpperCase()} · ${status}`
  }, [selectedLocale, selectedStatus])
  const publicPreviewHref = form.status === 'published' && form.slug ? localePath(form.locale, `/blog/${form.slug}`) : ''
  const adminPreviewHref = form.id ? localePath(locale, `/dashboard/admin/blog/preview/${form.id}`) : ''

  const loadPosts = useCallback(async () => {
    if (!accessToken) return
    setIsLoading(true)
    setError('')

    try {
      const params = new URLSearchParams({ locale: selectedLocale })
      if (selectedStatus !== 'all') params.set('status', selectedStatus)
      if (query.trim()) params.set('query', query.trim())

      const response = await fetch(`/api/admin/blog-posts?${params.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'Could not load blog posts.')
      }

      setPosts(Array.isArray(data.posts) ? data.posts : [])
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load blog posts.')
    } finally {
      setIsLoading(false)
    }
  }, [accessToken, query, selectedLocale, selectedStatus])

  useEffect(() => {
    void loadPosts()
  }, [loadPosts])

  const editPost = (post: BlogPostAdminItem) => {
    setForm({
      id: post.id,
      locale: post.locale,
      translationGroupId: post.translationGroupId || '',
      sourcePostId: post.sourcePostId || '',
      slug: post.slug,
      status: post.status,
      title: post.title,
      description: post.description,
      keywords: post.keywords.join(', '),
      category: post.category || '',
      coverImageUrl: post.coverImage?.url || '',
      coverImageAlt: post.coverImage?.alt || '',
      intro: post.intro,
      sectionsJson: JSON.stringify(post.sections, null, 2),
      enhancementJson: JSON.stringify(post.enhancement || {}, null, 2),
      localizedSlugsJson: JSON.stringify(post.localizedSlugs || { [post.locale]: post.slug }, null, 2),
      submittedToBing: Boolean(post.submittedToBing),
    })
    setMessage('')
    setError('')
  }

  const startNew = () => {
    setForm({ ...defaultForm, locale: selectedLocale })
    setMessage('')
    setError('')
  }

  const copyPublicLink = async (post: BlogPostAdminItem) => {
    const path = localePath(post.locale, `/blog/${post.slug}`)
    const url = typeof window === 'undefined' ? path : `${window.location.origin}${path}`

    try {
      await navigator.clipboard.writeText(url)
      setMessage(`Copied public URL: ${url}`)
      setError('')
    } catch {
      setError(`Could not copy automatically. Public URL: ${url}`)
      setMessage('')
    }
  }

  const prepareDraftPrompt = async () => {
    if (!accessToken) {
      window.location.href = dashboardHref
      return
    }

    if (!draftRelatedTerms.trim()) {
      setError('Enter related terms before preparing keywords and prompt.')
      return
    }

    setIsGenerating(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch('/api/admin/blog-post-draft', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: 'prepare',
          locale: draftLocale,
          relatedTerms: draftRelatedTerms,
        }),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'Could not prepare localized keywords and prompt.')
      }

      const preparedKeywords = Array.isArray(data.keywords)
        ? data.keywords.filter((item: unknown): item is string => typeof item === 'string').slice(0, 2)
        : []
      const preparedPrompt = typeof data.prompt === 'string' ? data.prompt : ''

      if (preparedKeywords.length !== 2 || !preparedPrompt) {
        throw new Error('DeepSeek did not return two keywords and a prompt.')
      }

      setDraftKeywords(preparedKeywords.join(', '))
      setDraftPrompt(preparedPrompt)
      setMessage('Localized keywords and article prompt prepared. Review them, edit if needed, then generate the article.')
    } catch (prepareError) {
      setError(prepareError instanceof Error ? prepareError.message : 'Could not prepare localized keywords and prompt.')
    } finally {
      setIsGenerating(false)
    }
  }

  const generateDraft = async () => {
    if (!accessToken) {
      window.location.href = dashboardHref
      return
    }

    setIsGenerating(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch('/api/admin/blog-post-draft', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: 'article',
          locale: draftLocale,
          keywords: draftKeywords,
          prompt: draftPrompt,
        }),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'Could not generate blog draft.')
      }

      const draft = data.draft as Partial<BlogPostAdminItem> & {
        coverImageUrl?: string
        coverImageAlt?: string
      }

      setForm({
        ...defaultForm,
        locale: draftLocale,
        slug: draft.slug || '',
        title: draft.title || '',
        description: draft.description || '',
        keywords: Array.isArray(draft.keywords) ? draft.keywords.join(', ') : draftKeywords,
        category: draft.category || '',
        coverImageUrl: draft.coverImageUrl || draft.coverImage?.url || '',
        coverImageAlt: draft.coverImageAlt || draft.coverImage?.alt || '',
        intro: draft.intro || '',
        sectionsJson: JSON.stringify(draft.sections || emptySections, null, 2),
        enhancementJson: JSON.stringify(draft.enhancement || {}, null, 2),
        localizedSlugsJson: JSON.stringify(draft.localizedSlugs || { [draftLocale]: draft.slug || '' }, null, 2),
      })

      const warnings = Array.isArray(data.validationErrors) && data.validationErrors.length > 0
        ? ` Review before saving: ${data.validationErrors.join(' ')}`
        : ''
      setMessage(`Draft generated and filled into New Post.${warnings}`)
    } catch (generateError) {
      setError(generateError instanceof Error ? generateError.message : 'Could not generate blog draft.')
    } finally {
      setIsGenerating(false)
    }
  }

  const savePost = async (nextStatus?: BlogStatus) => {
    if (!accessToken) {
      window.location.href = dashboardHref
      return
    }

    setIsSaving(true)
    setError('')
    setMessage('')

    try {
      const sections = parseJson(form.sectionsJson, 'sections')
      const enhancement = parseJson(form.enhancementJson, 'SEO enhancement')
      const localizedSlugs = parseJson(form.localizedSlugsJson, 'localized slugs')
      const payload = {
        id: form.id,
        locale: form.locale,
        translationGroupId: form.translationGroupId || undefined,
        sourcePostId: form.sourcePostId || null,
        slug: form.slug,
        status: nextStatus || form.status,
        title: form.title,
        description: form.description,
        keywords: form.keywords,
        category: form.category,
        coverImageUrl: form.coverImageUrl,
        coverImageAlt: form.coverImageAlt,
        intro: form.intro,
        sections,
        enhancement,
        localizedSlugs,
        submittedToBing: form.submittedToBing,
      }

      const response = await fetch('/api/admin/blog-posts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        const errors = Array.isArray(data.errors) ? data.errors.join(' ') : data.error
        throw new Error(errors || 'Could not save blog post.')
      }

      setMessage(data.post?.status === 'published' ? 'Saved, published, and public URL revalidated.' : 'Saved as draft. Publish it before opening the public URL.')
      if (data.post) editPost(data.post as BlogPostAdminItem)
      await loadPosts()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save blog post.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AdminPageFrame
      locale={locale}
      title="Blog Content"
      subtitle="Create localized blog pages that are ready for sitemap, hreflang, structured data, and crawl inspection."
      isCheckingAuth={isCheckingAuth}
      isAuthorized={isAuthorized}
    >
      <div className="space-y-6">
        <Card className="p-5 sm:p-6">
          <div className="grid gap-3 xl:grid-cols-[160px_160px_minmax(0,1fr)_auto_auto]">
            <select
              value={selectedLocale}
              onChange={(event) => setSelectedLocale(event.target.value as Locale)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-800"
            >
              {LOCALES.map((item) => (
                <option key={item} value={item}>{item.toUpperCase()}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value as BlogStatus | 'all')}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-800"
            >
              <option value="all">All statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') void loadPosts()
              }}
              placeholder="Search title, slug, or description"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
            />
            <Button variant="secondary" onClick={loadPosts} disabled={isLoading || !accessToken}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button onClick={startNew}>
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">DeepSeek Draft Generator</h2>
          </div>
          <div className="grid gap-3 lg:grid-cols-[160px_minmax(0,1fr)_auto_auto]">
            <select
              value={draftLocale}
              onChange={(event) => setDraftLocale(event.target.value as Locale)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-800"
            >
              {LOCALES.map((item) => (
                <option key={item} value={item}>{item.toUpperCase()}</option>
              ))}
            </select>
            <input
              value={draftRelatedTerms}
              onChange={(event) => {
                setDraftRelatedTerms(event.target.value)
              }}
              placeholder="Related terms only, e.g. AI headshot, consultant photo, team profile"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
            />
            <Button variant="secondary" onClick={prepareDraftPrompt} isLoading={isGenerating} disabled={isGenerating || !draftRelatedTerms.trim()}>
              Prepare Keywords
            </Button>
            <Button onClick={generateDraft} isLoading={isGenerating} disabled={isGenerating || !draftKeywords.trim() || !draftPrompt.trim()}>
              Generate Article
            </Button>
          </div>
          <input
            value={draftKeywords}
            onChange={(event) => setDraftKeywords(event.target.value)}
            placeholder="DeepSeek will return exactly 2 localized search keywords here."
            className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
          />
          <textarea
            value={draftPrompt}
            onChange={(event) => setDraftPrompt(event.target.value)}
            placeholder="Click Prepare Keywords to generate two localized search keywords and the article prompt for review."
            className={`${monoInputClass} mt-3 min-h-64`}
          />
        </Card>

        {error && <Notice tone="error" message={error} />}
        {message && <Notice tone="success" message={message} />}

        <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <Card className="overflow-hidden">
            <div className="border-b border-slate-100 p-4">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <BookOpenText className="h-4 w-4 text-blue-600" />
                {filteredPostsLabel}
              </div>
            </div>
            <div className="max-h-[720px] overflow-y-auto p-2">
              {posts.map((post) => (
                <div
                  key={`${post.locale}:${post.slug}`}
                  className="group rounded-lg px-3 py-3 transition-colors hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => editPost(post)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <div className="truncate font-semibold text-slate-900">{post.title}</div>
                      <div className="mt-1 truncate text-xs text-slate-500">{localePath(post.locale, `/blog/${post.slug}`)}</div>
                    </button>
                    <div className="flex flex-none items-center gap-2">
                      <button
                        type="button"
                        onClick={() => copyPublicLink(post)}
                        title="Copy public URL"
                        aria-label={`Copy public URL for ${post.title}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                        {post.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs font-semibold text-slate-500">
                    Bing: {post.submittedToBing ? 'submitted' : 'not submitted'}
                  </div>
                </div>
              ))}
              {!isLoading && posts.length === 0 && (
                <div className="p-4 text-sm text-slate-500">No posts found.</div>
              )}
              {isLoading && <div className="p-4 text-sm text-slate-500">Loading...</div>}
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-2">
              <FilePenLine className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-bold text-slate-900">{form.id ? 'Edit Post' : 'New Post'}</h2>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Field label="Locale">
                <select value={form.locale} onChange={(event) => setField('locale', event.target.value as Locale)} className={inputClass}>
                  {LOCALES.map((item) => (
                    <option key={item} value={item}>{item.toUpperCase()}</option>
                  ))}
                </select>
              </Field>
              <Field label="Status">
                <select value={form.status} onChange={(event) => setField('status', event.target.value as BlogStatus)} className={inputClass}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </Field>
              <label className="mt-4 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={form.submittedToBing}
                  onChange={(event) => setField('submittedToBing', event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Submitted to Bing
              </label>
              <Field label="Slug">
                <input value={form.slug} onChange={(event) => setField('slug', event.target.value)} className={inputClass} />
              </Field>
              <Field label="Translation group ID">
                <input value={form.translationGroupId} onChange={(event) => setField('translationGroupId', event.target.value)} className={inputClass} />
              </Field>
              <Field label="Title">
                <input value={form.title} onChange={(event) => setField('title', event.target.value)} className={inputClass} />
              </Field>
              <Field label="Category">
                <input value={form.category} onChange={(event) => setField('category', event.target.value)} className={inputClass} />
              </Field>
              <Field label="Keywords">
                <input value={form.keywords} onChange={(event) => setField('keywords', event.target.value)} className={inputClass} placeholder="keyword one, keyword two" />
              </Field>
              <Field label="Source post ID">
                <input value={form.sourcePostId} onChange={(event) => setField('sourcePostId', event.target.value)} className={inputClass} />
              </Field>
              <Field label="Cover image URL">
                <input value={form.coverImageUrl} onChange={(event) => setField('coverImageUrl', event.target.value)} className={inputClass} placeholder="/blog/example.jpg" />
              </Field>
              <Field label="Cover image alt">
                <input value={form.coverImageAlt} onChange={(event) => setField('coverImageAlt', event.target.value)} className={inputClass} />
              </Field>
            </div>

            <Field label="Meta description">
              <textarea value={form.description} onChange={(event) => setField('description', event.target.value)} className={`${inputClass} min-h-24`} maxLength={180} />
            </Field>
            <Field label="Intro">
              <textarea value={form.intro} onChange={(event) => setField('intro', event.target.value)} className={`${inputClass} min-h-28`} />
            </Field>
            <Field label="Sections JSON">
              <textarea value={form.sectionsJson} onChange={(event) => setField('sectionsJson', event.target.value)} className={`${monoInputClass} min-h-64`} />
            </Field>
            <Field label="SEO enhancement JSON">
              <textarea value={form.enhancementJson} onChange={(event) => setField('enhancementJson', event.target.value)} className={`${monoInputClass} min-h-48`} />
            </Field>
            <Field label="Localized slugs JSON">
              <textarea value={form.localizedSlugsJson} onChange={(event) => setField('localizedSlugsJson', event.target.value)} className={`${monoInputClass} min-h-28`} />
            </Field>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => savePost()} isLoading={isSaving} disabled={isSaving}>Save</Button>
              <Button onClick={() => savePost('published')} isLoading={isSaving} disabled={isSaving}>
                Publish
              </Button>
              <Button variant="secondary" onClick={() => savePost('archived')} disabled={isSaving}>Archive</Button>
              <Button variant="secondary" onClick={() => setShowPreview((current) => !current)}>
                <Eye className="mr-2 h-4 w-4" />
                {showPreview ? 'Hide Inline Preview' : 'Inline Preview'}
              </Button>
              {adminPreviewHref && (
                <a
                  href={adminPreviewHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-slate-50"
                >
                  Admin Preview
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              {publicPreviewHref && (
                <a
                  href={publicPreviewHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary-200 bg-white px-6 py-3 text-base font-semibold text-primary-600 transition-all duration-200 hover:border-primary-400 hover:bg-primary-50"
                >
                  Public URL
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>

            {showPreview && <BlogDraftPreview form={form} />}
          </Card>
        </div>
      </div>
    </AdminPageFrame>
  )

  function setField<Key extends keyof BlogFormState>(key: Key, value: BlogFormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }))
  }
}

function BlogDraftPreview({ form }: { form: BlogFormState }) {
  const sections = parseJsonSafe<{ heading: string; body: string }[]>(form.sectionsJson, [])
  const enhancement = parseJsonSafe<{
    searchIntent?: string
    qualityChecks?: { label: string; detail: string }[]
    avoid?: string[]
  }>(form.enhancementJson, {})
  const keywords = form.keywords.split(',').map((item) => item.trim()).filter(Boolean)

  return (
    <div className="mt-8 border-t border-slate-200 pt-6">
      <div className="mb-4 flex items-center gap-2">
        <Eye className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-bold text-slate-900">Draft Preview</h3>
      </div>

      <article className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6">
        <div className="mb-3 text-xs font-bold uppercase text-blue-600">{form.locale.toUpperCase()} / {form.category || 'Uncategorized'}</div>
        <h1 className="break-words text-3xl font-bold leading-tight text-slate-950">{form.title || 'Untitled article'}</h1>
        <p className="mt-4 break-words text-base leading-7 text-slate-600">{form.description || 'No meta description yet.'}</p>

        {keywords.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {keywords.map((keyword) => (
              <span key={keyword} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {keyword}
              </span>
            ))}
          </div>
        )}

        {form.coverImageUrl && (
          <div className="mt-6 rounded-lg bg-slate-50 p-4">
            <div className="break-all text-sm font-semibold text-slate-700">{form.coverImageUrl}</div>
            <div className="mt-1 text-sm text-slate-500">Alt: {form.coverImageAlt || 'Missing alt text'}</div>
          </div>
        )}

        <div className="mt-6 rounded-lg bg-slate-50 p-5 text-base leading-8 text-slate-700">
          {form.intro || 'No intro yet.'}
        </div>

        <div className="mt-8 space-y-7">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="break-words text-2xl font-bold text-slate-950">{section.heading}</h2>
              <p className="mt-3 whitespace-pre-wrap text-base leading-8 text-slate-700">{section.body}</p>
            </section>
          ))}
        </div>

        {enhancement.searchIntent && (
          <div className="mt-8 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-900">
            <strong>Search intent:</strong> {enhancement.searchIntent}
          </div>
        )}

      </article>
    </div>
  )
}

const inputClass = 'mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100'
const monoInputClass = `${inputClass} font-mono text-xs leading-5`

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="mt-4 block text-sm font-semibold text-slate-700">
      {label}
      {children}
    </label>
  )
}

function Notice({ tone, message }: { tone: 'success' | 'error'; message: string }) {
  const Icon = tone === 'success' ? CheckCircle2 : XCircle
  const classes = tone === 'success'
    ? 'border-green-200 bg-green-50 text-green-700'
    : 'border-red-200 bg-red-50 text-red-700'

  return (
    <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${classes}`}>
      <Icon className="mt-0.5 h-5 w-5 flex-none" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  )
}

function parseJson(value: string, label: string) {
  try {
    return JSON.parse(value || '{}') as unknown
  } catch {
    throw new Error(`${label} is not valid JSON.`)
  }
}

function parseJsonSafe<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value || 'null') as T ?? fallback
  } catch {
    return fallback
  }
}
