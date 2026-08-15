'use client'

import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import AdminPageFrame from '@/components/admin/admin-page-frame'
import { useAdminAuth } from '@/components/admin/admin-auth'
import Button from '@/components/ui/button'
import Card from '@/components/ui/card'
import { type Locale } from '@/lib/i18n'
import { CheckCircle2, ImagePlus, RefreshCw, Sparkles, Trash2, UploadCloud } from 'lucide-react'

type StyleTemplateRow = {
  id: string
  name: string
  category: string
  has_template: boolean
  image_url: string | null
  storage_path: string | null
  updated_at: string | null
}

interface StyleTemplatesPageViewProps {
  locale?: Locale
}

export default function StyleTemplatesPageView({ locale = 'en' }: StyleTemplatesPageViewProps) {
  const { accessToken, isAuthorized, isCheckingAuth } = useAdminAuth(locale)
  const [styles, setStyles] = useState<StyleTemplateRow[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [savingId, setSavingId] = useState('')
  const [deletingId, setDeletingId] = useState('')
  const [generatingId, setGeneratingId] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileInputRef = useRef<Record<string, HTMLInputElement | null>>({})

  const loadStyles = useCallback(async () => {
    if (!accessToken) return
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/style-templates', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'Failed to load style templates.')
      }
      setStyles(Array.isArray(data.styles) ? data.styles : [])
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load style templates.')
    } finally {
      setIsLoading(false)
    }
  }, [accessToken])

  useEffect(() => {
    if (isAuthorized && accessToken) {
      void loadStyles()
    }
  }, [accessToken, isAuthorized, loadStyles])

  const categories = useMemo(() => {
    return Array.from(new Set(styles.map((style) => style.category || 'General'))).sort((a, b) => a.localeCompare(b))
  }, [styles])

  const groupedByCategory = useMemo(() => {
    return categories
      .map((category) => ({
        category,
        styles: styles.filter((style) => (style.category || 'General') === category),
      }))
      .filter((group) => group.styles.length > 0)
  }, [categories, styles])

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>, styleId: string) => {
    const file = event.target.files?.[0]
    if (!file) return
    event.target.value = ''

    void uploadTemplate(styleId, file)
  }

  const uploadTemplate = async (styleId: string, file: File) => {
    if (!accessToken) return
    setError('')
    setSuccess('')
    setSavingId(styleId)

    try {
      const formData = new FormData()
      formData.set('file', file)
      formData.set('style_id', styleId)
      formData.set('alt', styleId)

      const response = await fetch('/api/admin/style-templates', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'Failed to upload style template.')
      }
      setSuccess(`Template saved for "${data.style?.id || styleId}".`)
      await loadStyles()
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Failed to upload style template.')
    } finally {
      setSavingId('')
    }
  }

  const deleteTemplate = async (style: StyleTemplateRow) => {
    if (!accessToken) return
    const confirmed = window.confirm(`Remove the template for "${style.name}"?`)
    if (!confirmed) return

    setError('')
    setSuccess('')
    setDeletingId(style.id)

    try {
      const response = await fetch(
        `/api/admin/style-templates?style_id=${encodeURIComponent(style.id)}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'Failed to delete style template.')
      }
      setSuccess(`Template removed for "${style.name}".`)
      await loadStyles()
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete style template.')
    } finally {
      setDeletingId('')
    }
  }

  const generateTemplate = async (style: StyleTemplateRow) => {
    if (!accessToken) return
    setError('')
    setSuccess('')
    setGeneratingId(style.id)

    try {
      const response = await fetch('/api/admin/style-templates/generate', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ style_id: style.id }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'Failed to generate style template.')
      }
      setSuccess(`Template generated for "${data.style?.id || style.id}".`)
      await loadStyles()
    } catch (generateError) {
      setError(generateError instanceof Error ? generateError.message : 'Failed to generate style template.')
    } finally {
      setGeneratingId('')
    }
  }

  return (
    <AdminPageFrame
      locale={locale}
      title="Style Templates"
      subtitle="One template image per style. The picker shows it as the preview, and generation uses it as a style reference image while keeping the user's own face."
      isCheckingAuth={isCheckingAuth}
      isAuthorized={isAuthorized}
    >
      <div className="space-y-6">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            {success}
          </div>
        )}

        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Style Template Gallery</h2>
              <p className="text-sm text-slate-500">
                {styles.length} styles · {styles.filter((style) => style.has_template).length} with a template
              </p>
            </div>
            <Button type="button" variant="secondary" onClick={() => void loadStyles()} isLoading={isLoading}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>

          {groupedByCategory.map((group) => (
            <div key={group.category} className="border-b border-slate-100 p-4 last:border-b-0">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">{group.category}</h3>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {group.styles.map((style) => {
                  const isSaving = savingId === style.id
                  const isDeleting = deletingId === style.id
                  const isGenerating = generatingId === style.id
                  return (
                    <div key={style.id} className="grid gap-3 rounded-lg border border-slate-200 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="truncate text-sm font-bold text-slate-900">{style.name}</h4>
                          <p className="truncate text-xs text-slate-500">{style.id}</p>
                        </div>
                        <span className={`flex-none rounded-full px-2 py-0.5 text-xs font-bold ${style.has_template ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {style.has_template ? 'Set' : 'None'}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1.5 rounded-md border border-slate-200 p-2">
                        {style.image_url ? (
                          <img
                            src={style.image_url}
                            alt={style.name}
                            loading="lazy"
                            className="aspect-square w-full rounded bg-slate-100 object-cover"
                          />
                        ) : (
                          <div className="flex aspect-square w-full items-center justify-center rounded bg-slate-50">
                            <ImagePlus className="h-5 w-5 text-slate-300" />
                          </div>
                        )}
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          isLoading={isSaving}
                          disabled={isDeleting}
                          onClick={() => fileInputRef.current[style.id]?.click()}
                          className="w-full"
                        >
                          <UploadCloud className="mr-1 h-3.5 w-3.5" />
                          {style.has_template ? 'Replace' : 'Upload'}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          isLoading={isGenerating}
                          disabled={isSaving || isDeleting}
                          onClick={() => void generateTemplate(style)}
                          className="w-full"
                        >
                          <Sparkles className="mr-1 h-3.5 w-3.5" />
                          {style.has_template ? 'Generate Again' : 'Generate'}
                        </Button>
                        {style.has_template && (
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            isLoading={isDeleting}
                            disabled={isSaving}
                            onClick={() => void deleteTemplate(style)}
                            className="w-full"
                          >
                            <Trash2 className="mr-1 h-3.5 w-3.5" />
                            Remove
                          </Button>
                        )}
                        <input
                          ref={(node) => {
                            fileInputRef.current[style.id] = node
                          }}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={(event) => void handleFileChange(event, style.id)}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {groupedByCategory.length === 0 && !isLoading && (
            <div className="p-8 text-center text-sm text-slate-500">No styles found.</div>
          )}
        </Card>
      </div>
    </AdminPageFrame>
  )
}