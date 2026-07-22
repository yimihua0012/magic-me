'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import AdminPageFrame from '@/components/admin/admin-page-frame'
import { useAdminAuth } from '@/components/admin/admin-auth'
import Button from '@/components/ui/button'
import Card from '@/components/ui/card'
import { LOCALES, localePath, type Locale } from '@/lib/i18n'
import { ExternalLink, RefreshCw, Rocket, Send, Sparkles } from 'lucide-react'

type FastContentStatus = 'pending' | 'generating' | 'draft' | 'failed' | 'published'

type FastContentItem = {
  id: string
  locale: Locale
  keyword: string
  status: FastContentStatus
  blogPostId: string | null
  blogSlug: string | null
  prompt: string | null
  errorMessage: string | null
  createdAt: string
  updatedAt: string
}

type BlogPostAdminItem = {
  id?: string
  locale: Locale
  translationGroupId?: string
  sourcePostId?: string | null
  slug: string
  status: 'draft' | 'published' | 'archived'
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
}

interface FastContentPageViewProps {
  locale?: Locale
}

export default function FastContentPageView({ locale = 'en' }: FastContentPageViewProps) {
  const { accessToken, dashboardHref, isAuthorized, isCheckingAuth } = useAdminAuth(locale)
  const [selectedLocale, setSelectedLocale] = useState<Locale>('en')
  const [keywordLines, setKeywordLines] = useState('')
  const [items, setItems] = useState<FastContentItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [activeId, setActiveId] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const itemCountLabel = useMemo(() => `${items.length} keywords`, [items.length])

  const authHeaders = useCallback(() => {
    if (!accessToken) throw new Error('Authentication required')
    return {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    }
  }, [accessToken])

  const loadItems = useCallback(async () => {
    if (!accessToken) return
    setIsLoading(true)
    setError('')

    try {
      const params = new URLSearchParams({ locale: selectedLocale, generated: 'false' })
      const response = await fetch(`/api/admin/fast-content?${params.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'Could not load fast content keywords.')
      }
      setItems(Array.isArray(data.items) ? data.items : [])
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load fast content keywords.')
    } finally {
      setIsLoading(false)
    }
  }, [accessToken, selectedLocale])

  useEffect(() => {
    void loadItems()
  }, [loadItems])

  const addKeywords = async () => {
    if (!accessToken) {
      window.location.href = dashboardHref
      return
    }

    setIsAdding(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch('/api/admin/fast-content', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          locale: selectedLocale,
          keywords: keywordLines,
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'Could not add keywords.')
      }

      const insertedCount = Array.isArray(data.inserted) ? data.inserted.length : 0
      const skippedCount = Array.isArray(data.skipped) ? data.skipped.length : 0
      const errorCount = Array.isArray(data.errors) ? data.errors.length : 0
      setMessage(`Added ${insertedCount}. Skipped duplicates ${skippedCount}. Failed ${errorCount}.`)
      if (insertedCount > 0) setKeywordLines('')
      await loadItems()
    } catch (addError) {
      setError(addError instanceof Error ? addError.message : 'Could not add keywords.')
    } finally {
      setIsAdding(false)
    }
  }

  const updateFastItem = async (id: string, patch: Partial<Pick<FastContentItem, 'status' | 'blogPostId' | 'blogSlug' | 'prompt' | 'errorMessage'>>) => {
    const response = await fetch('/api/admin/fast-content', {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({
        id,
        status: patch.status,
        blogPostId: patch.blogPostId,
        blogSlug: patch.blogSlug,
        prompt: patch.prompt,
        errorMessage: patch.errorMessage,
      }),
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(typeof data.error === 'string' ? data.error : 'Could not update fast content item.')
    }
    const item = data.item as FastContentItem | undefined
    if (item) {
      setItems((current) => current.map((entry) => entry.id === item.id ? item : entry))
    }
    return item
  }

  const generateDraft = async (item: FastContentItem) => {
    if (!accessToken) {
      window.location.href = dashboardHref
      return
    }

    setActiveId(item.id)
    setError('')
    setMessage('')

    try {
      await updateFastItem(item.id, { status: 'generating', errorMessage: '' })
      const prepared = await preparePrompt(item)
      await updateFastItem(item.id, { status: 'generating', prompt: prepared.prompt })
      const generated = await generateArticle(item, prepared.keyword, prepared.prompt)
      const savedPost = await saveBlogPost(generated, 'draft')
      await updateFastItem(item.id, {
        status: 'draft',
        blogPostId: savedPost.id,
        blogSlug: savedPost.slug,
        prompt: prepared.prompt,
        errorMessage: '',
      })
      setMessage(`Draft saved for ${item.keyword}: ${savedPost.slug}`)
    } catch (generateError) {
      const detail = generateError instanceof Error ? generateError.message : 'Could not generate draft.'
      await updateFastItem(item.id, { status: 'failed', errorMessage: detail }).catch(() => undefined)
      setError(detail)
    } finally {
      setActiveId('')
    }
  }

  const publishItem = async (item: FastContentItem) => {
    if (!accessToken) {
      window.location.href = dashboardHref
      return
    }

    if (!item.blogPostId) {
      setError('Generate and save a draft before publishing.')
      return
    }

    setActiveId(item.id)
    setError('')
    setMessage('')

    try {
      const post = await loadBlogPost(item.blogPostId)
      const publishedPost = await saveBlogPost(postToGeneratedDraft(post), 'published')
      await updateFastItem(item.id, {
        status: 'published',
        blogPostId: publishedPost.id,
        blogSlug: publishedPost.slug,
        errorMessage: '',
      })
      setMessage(`Published: ${localePath(publishedPost.locale, `/blog/${publishedPost.slug}`)}`)
    } catch (publishError) {
      const detail = publishError instanceof Error ? publishError.message : 'Could not publish draft.'
      await updateFastItem(item.id, { errorMessage: detail }).catch(() => undefined)
      setError(detail)
    } finally {
      setActiveId('')
    }
  }

  const preparePrompt = async (item: FastContentItem) => {
    const response = await fetch('/api/admin/blog-post-draft', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        mode: 'prepare',
        locale: item.locale,
        keywords: item.keyword,
      }),
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(typeof data.error === 'string' ? data.error : 'Could not prepare prompt.')
    }
    const keywords = Array.isArray(data.keywords)
      ? data.keywords.filter((entry: unknown): entry is string => typeof entry === 'string')
      : []
    const prompt = typeof data.prompt === 'string' ? data.prompt : ''
    if (keywords.length !== 1 || !prompt) {
      throw new Error('DeepSeek did not return one keyword and a prompt.')
    }
    return { keyword: keywords[0], prompt }
  }

  const generateArticle = async (item: FastContentItem, keyword: string, prompt: string) => {
    const response = await fetch('/api/admin/blog-post-draft', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        mode: 'article',
        locale: item.locale,
        keywords: keyword,
        prompt,
      }),
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(typeof data.error === 'string' ? data.error : 'Could not generate article.')
    }
    if (!data.draft) {
      throw new Error('DeepSeek did not return a draft.')
    }
    return data.draft as Partial<BlogPostAdminItem> & {
      coverImageUrl?: string
      coverImageAlt?: string
    }
  }

  const saveBlogPost = async (
    draft: Partial<BlogPostAdminItem> & { coverImageUrl?: string; coverImageAlt?: string },
    status: 'draft' | 'published',
  ) => {
    const payload = {
      id: draft.id,
      locale: draft.locale || selectedLocale,
      translationGroupId: draft.translationGroupId || undefined,
      sourcePostId: draft.sourcePostId || null,
      slug: draft.slug || '',
      status,
      title: draft.title || '',
      description: draft.description || '',
      keywords: Array.isArray(draft.keywords) ? draft.keywords : [],
      category: draft.category || '',
      coverImageUrl: draft.coverImageUrl || draft.coverImage?.url || '',
      coverImageAlt: draft.coverImageAlt || draft.coverImage?.alt || '',
      intro: draft.intro || '',
      sections: Array.isArray(draft.sections) ? draft.sections : [],
      enhancement: draft.enhancement || {},
      localizedSlugs: draft.localizedSlugs || { [draft.locale || selectedLocale]: draft.slug || '' },
      submittedToBing: Boolean(draft.submittedToBing),
    }

    const response = await fetch('/api/admin/blog-posts', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      const errors = Array.isArray(data.errors) ? data.errors.join(' ') : data.error
      throw new Error(errors || 'Could not save blog post.')
    }
    if (!data.post?.id || !data.post?.slug) {
      throw new Error('Blog post was saved but no id or slug was returned.')
    }
    return data.post as BlogPostAdminItem
  }

  const loadBlogPost = async (id: string) => {
    const response = await fetch(`/api/admin/blog-posts/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(typeof data.error === 'string' ? data.error : 'Could not load saved draft.')
    }
    return data.post as BlogPostAdminItem
  }

  return (
    <AdminPageFrame
      locale={locale}
      title="Fast Content"
      subtitle="Queue confirmed keywords, generate SEO drafts, and publish them through the existing blog workflow."
      isCheckingAuth={isCheckingAuth}
      isAuthorized={isAuthorized}
    >
      <div className="space-y-6">
        <Card className="p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Rocket className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">Add keywords</h2>
          </div>
          <div className="grid gap-3 lg:grid-cols-[160px_minmax(0,1fr)_auto]">
            <select
              value={selectedLocale}
              onChange={(event) => setSelectedLocale(event.target.value as Locale)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-800"
            >
              {LOCALES.map((item) => (
                <option key={item} value={item}>{item.toUpperCase()}</option>
              ))}
            </select>
            <textarea
              value={keywordLines}
              onChange={(event) => setKeywordLines(event.target.value)}
              placeholder={'one localized long-tail keyword\nanother localized long-tail keyword'}
              className="min-h-28 rounded-lg border border-slate-200 px-3 py-2 font-mono text-xs leading-5 text-slate-900 placeholder:text-slate-400"
            />
            <Button onClick={addKeywords} isLoading={isAdding} disabled={isAdding || !keywordLines.trim()}>
              Add keywords
            </Button>
          </div>
        </Card>

        {error && <Notice tone="error" message={error} />}
        {message && <Notice tone="success" message={message} />}

        <Card className="overflow-hidden">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 p-4">
            <div>
              <div className="font-bold text-slate-900">Keyword queue</div>
              <div className="mt-1 text-sm text-slate-500">{selectedLocale.toUpperCase()} / ungenerated / {itemCountLabel}</div>
            </div>
            <Button variant="secondary" onClick={loadItems} disabled={isLoading || !accessToken}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Keyword</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Blog</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {items.map((item) => {
                  const publicHref = item.blogSlug ? localePath(item.locale, `/blog/${item.blogSlug}`) : ''
                  const busy = activeId === item.id
                  return (
                    <tr key={item.id}>
                      <td className="max-w-sm px-4 py-3">
                        <div className="font-semibold text-slate-900">{item.keyword}</div>
                        {item.errorMessage && <div className="mt-1 text-xs leading-5 text-red-600">{item.errorMessage}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-4 py-3">
                        {publicHref ? (
                          <a href={publicHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline">
                            {item.blogSlug}
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        ) : (
                          <span className="text-slate-400">No draft</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-500">{formatAdminDateTime(item.updatedAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="secondary"
                            onClick={() => generateDraft(item)}
                            isLoading={busy && item.status === 'generating'}
                            disabled={Boolean(activeId) || item.status === 'published'}
                          >
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate
                          </Button>
                          <Button
                            onClick={() => publishItem(item)}
                            isLoading={busy && item.status !== 'generating'}
                            disabled={Boolean(activeId) || !item.blogPostId || item.status === 'published'}
                          >
                            <Send className="mr-2 h-4 w-4" />
                            Publish
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {!isLoading && items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">No ungenerated keywords.</td>
                  </tr>
                )}
                {isLoading && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">Loading...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminPageFrame>
  )
}

function postToGeneratedDraft(post: BlogPostAdminItem) {
  return {
    id: post.id,
    locale: post.locale,
    translationGroupId: post.translationGroupId,
    sourcePostId: post.sourcePostId,
    slug: post.slug,
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    category: post.category,
    coverImageUrl: post.coverImage?.url || '',
    coverImageAlt: post.coverImage?.alt || '',
    intro: post.intro,
    sections: post.sections,
    enhancement: post.enhancement || {},
    localizedSlugs: post.localizedSlugs || { [post.locale]: post.slug },
    submittedToBing: Boolean(post.submittedToBing),
  }
}

function StatusBadge({ status }: { status: FastContentStatus }) {
  const className = status === 'published'
    ? 'bg-green-100 text-green-700'
    : status === 'draft'
      ? 'bg-blue-100 text-blue-700'
      : status === 'failed'
        ? 'bg-red-100 text-red-700'
        : status === 'generating'
          ? 'bg-amber-100 text-amber-700'
          : 'bg-slate-100 text-slate-600'

  return <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${className}`}>{status}</span>
}

function Notice({ tone, message }: { tone: 'success' | 'error'; message: string }) {
  const className = tone === 'success'
    ? 'border-green-200 bg-green-50 text-green-700'
    : 'border-red-200 bg-red-50 text-red-700'

  return (
    <div className={`rounded-xl border px-4 py-3 text-sm font-semibold ${className}`}>
      {message}
    </div>
  )
}

function formatAdminDateTime(value?: string) {
  if (!value) return 'unknown'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'unknown'
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day} ${hours}:${minutes}`
}
