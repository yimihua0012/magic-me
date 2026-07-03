'use client'

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import AdminPageFrame from '@/components/admin/admin-page-frame'
import { useAdminAuth } from '@/components/admin/admin-auth'
import Button from '@/components/ui/button'
import Card from '@/components/ui/card'
import { LOCALES, localePath, type Locale } from '@/lib/i18n'
import { BookOpenText, CheckCircle2, ExternalLink, Eye, FilePenLine, Plus, RefreshCw, Sparkles, XCircle } from 'lucide-react'

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
}

export default function BlogContentPageView({ locale = 'en' }: BlogContentPageViewProps) {
  const { accessToken, dashboardHref, isAuthorized, isCheckingAuth } = useAdminAuth(locale)
  const [posts, setPosts] = useState<BlogPostAdminItem[]>([])
  const [form, setForm] = useState<BlogFormState>(defaultForm)
  const [selectedLocale, setSelectedLocale] = useState<Locale>('en')
  const [selectedStatus, setSelectedStatus] = useState<BlogStatus | 'all'>('all')
  const [query, setQuery] = useState('')
  const [draftLocale, setDraftLocale] = useState<Locale>('en')
  const [draftKeywords, setDraftKeywords] = useState('')
  const [draftUseCase, setDraftUseCase] = useState('LinkedIn profile photos, resumes, business profiles, and realistic professional portraits')
  const [draftBrief, setDraftBrief] = useState('')
  const [draftWordCount, setDraftWordCount] = useState('1000-1200')
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
  const publicPreviewHref = form.slug ? localePath(form.locale, `/blog/${form.slug}`) : ''

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
    })
    setMessage('')
    setError('')
  }

  const startNew = () => {
    setForm({ ...defaultForm, locale: selectedLocale })
    setMessage('')
    setError('')
  }

  const buildPromptForReview = () => {
    if (!draftKeywords.trim()) {
      setError('Enter at least one keyword before building the prompt.')
      return
    }

    setError('')
    setMessage('Prompt generated. Review it, adjust if needed, then generate the article.')
    setDraftPrompt(buildArticlePrompt({
      locale: draftLocale,
      keywords: draftKeywords,
      useCase: draftUseCase,
      brief: draftBrief,
      wordCount: draftWordCount,
    }))
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
          locale: draftLocale,
          keywords: draftKeywords,
          useCase: draftUseCase,
          brief: draftBrief,
          prompt: draftPrompt || buildArticlePrompt({
            locale: draftLocale,
            keywords: draftKeywords,
            useCase: draftUseCase,
            brief: draftBrief,
            wordCount: draftWordCount,
          }),
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

      setMessage(data.post?.status === 'published' ? 'Saved, published, and revalidated.' : 'Saved.')
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
          <div className="grid gap-3 lg:grid-cols-[160px_minmax(0,1fr)_140px_auto_auto]">
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
              value={draftKeywords}
              onChange={(event) => {
                setDraftKeywords(event.target.value)
              }}
              placeholder="Keyword cluster, separated by commas"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
            />
            <input
              value={draftWordCount}
              onChange={(event) => setDraftWordCount(event.target.value)}
              placeholder="1000-1200"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
            />
            <Button variant="secondary" onClick={buildPromptForReview} disabled={!draftKeywords.trim()}>
              Build Prompt
            </Button>
            <Button onClick={generateDraft} isLoading={isGenerating} disabled={isGenerating || !draftKeywords.trim()}>
              Generate Article
            </Button>
          </div>
          <input
            value={draftUseCase}
            onChange={(event) => setDraftUseCase(event.target.value)}
            placeholder="Use case, audience, or scenario"
            className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
          />
          <textarea
            value={draftBrief}
            onChange={(event) => setDraftBrief(event.target.value)}
            placeholder="Optional basic notes: article angle, target reader, product detail, competitor gap, local market need. Article should stay around 1000-1200 words."
            className={`${inputClass} mt-3 min-h-28`}
          />
          <textarea
            value={draftPrompt}
            onChange={(event) => setDraftPrompt(event.target.value)}
            placeholder="Click Build Prompt to generate the article prompt for review."
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
                <button
                  key={`${post.locale}:${post.slug}`}
                  type="button"
                  onClick={() => editPost(post)}
                  className="block w-full rounded-lg px-3 py-3 text-left transition-colors hover:bg-slate-50"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-slate-900">{post.title}</div>
                      <div className="mt-1 truncate text-xs text-slate-500">/{post.locale}/blog/{post.slug}</div>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                      {post.status}
                    </span>
                  </div>
                </button>
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
                {showPreview ? 'Hide Preview' : 'Preview'}
              </Button>
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

function buildArticlePrompt(input: {
  locale: Locale
  keywords: string
  useCase: string
  brief: string
  wordCount: string
}) {
  const languageNames: Record<Locale, string> = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    ja: 'Japanese',
  }
  const language = languageNames[input.locale]
  const keywords = input.keywords.trim()
  const useCase = input.useCase.trim() || 'LinkedIn profile photos, resumes, business profiles, and realistic professional portraits'
  const wordCount = input.wordCount.trim() || '1000-1200'
  const brief = input.brief.trim()

  return [
    `We are Magic-Headshot, an AI avatar, photo, and professional image generation tool. Users upload selfies and create realistic professional headshots for LinkedIn, resumes, business profiles, teams, websites, and personal branding.`,
    '',
    `Please write one SEO-friendly blog article in ${language}.`,
    `Main topic / keyword cluster: ${keywords}.`,
    `Primary use case: ${useCase}.`,
    `Target article length: about ${wordCount} words.`,
    brief ? `Additional notes from the editor: ${brief}.` : 'Additional notes from the editor: none.',
    '',
    'Before writing, decide the best search intent and article angle, but do not show your reasoning.',
    'The article should avoid generic filler. Include concrete advice about photo preparation, realistic likeness, style choice, professional use cases, and common mistakes.',
    '',
    'Return only a valid JSON object that can be saved by our blog CMS.',
    'Required JSON keys: slug, title, description, keywords, category, coverImageUrl, coverImageAlt, intro, sections, enhancement, localizedSlugs.',
    '',
    'JSON requirements:',
    '- slug: lowercase English letters, numbers, and hyphens only.',
    '- title: clear, natural, and keyword-aligned.',
    '- description: 120-160 characters, matching visible article content.',
    '- keywords: 5-8 natural search phrases.',
    '- coverImageUrl: empty string unless a site-local path is known.',
    '- coverImageAlt: descriptive alt text in the article language.',
    '- intro: 80-140 words.',
    '- sections: 5-7 objects with heading and body; each body about 100-150 words.',
    '- enhancement: include category, audience, searchIntent, uniqueAngle, actionSteps, qualityChecks, avoid, internalLinks, relatedSlugs.',
    '- internalLinks: only use public paths: /pricing, /sample, /questions, /blog, /free-id-photo-tool.',
    '- Do not invent discounts, legal claims, medical claims, guarantees, or unavailable product features.',
    '- No markdown fences. No commentary outside JSON.',
  ].join('\n')
}

function BlogDraftPreview({ form }: { form: BlogFormState }) {
  const sections = parseJsonSafe<{ heading: string; body: string }[]>(form.sectionsJson, [])
  const enhancement = parseJsonSafe<{
    searchIntent?: string
    actionSteps?: string[]
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

        {Array.isArray(enhancement.actionSteps) && enhancement.actionSteps.length > 0 && (
          <section className="mt-8">
            <h2 className="text-2xl font-bold text-slate-950">Practical steps</h2>
            <ol className="mt-4 space-y-3">
              {enhancement.actionSteps.map((step, index) => (
                <li key={step} className="flex gap-3 rounded-lg border border-slate-200 p-4 text-sm leading-6 text-slate-700">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">{index + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </section>
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
