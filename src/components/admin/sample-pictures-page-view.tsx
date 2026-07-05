'use client'

import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import AdminPageFrame from '@/components/admin/admin-page-frame'
import { useAdminAuth } from '@/components/admin/admin-auth'
import Button from '@/components/ui/button'
import Card from '@/components/ui/card'
import Input from '@/components/ui/input'
import { type Locale } from '@/lib/i18n'
import { CheckCircle2, ImagePlus, RefreshCw, Save, Trash2, UploadCloud } from 'lucide-react'

type LocalizedFields = Record<'es' | 'fr' | 'de' | 'ja', string>

type SamplePicture = {
  id: string
  image_url: string
  storage_path: string | null
  alt: string
  title: string
  style_name: string
  category: string
  localized_alt: Partial<LocalizedFields>
  localized_title: Partial<LocalizedFields>
  localized_style_name: Partial<LocalizedFields>
  localized_category: Partial<LocalizedFields>
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

type FormState = {
  title: string
  alt: string
  style_name: string
  category: string
  localized_title: LocalizedFields
  localized_alt: LocalizedFields
  localized_style_name: LocalizedFields
  localized_category: LocalizedFields
  sort_order: number
  is_active: boolean
}

interface SamplePicturesPageViewProps {
  locale?: Locale
}

const routedLocales = ['es', 'fr', 'de', 'ja'] as const
const emptyLocalized = { es: '', fr: '', de: '', ja: '' }

const emptyForm: FormState = {
  title: '',
  alt: '',
  style_name: '',
  category: 'General',
  localized_title: emptyLocalized,
  localized_alt: emptyLocalized,
  localized_style_name: emptyLocalized,
  localized_category: emptyLocalized,
  sort_order: 0,
  is_active: true,
}

export default function SamplePicturesPageView({ locale = 'en' }: SamplePicturesPageViewProps) {
  const { accessToken, isAuthorized, isCheckingAuth } = useAdminAuth(locale)
  const [pictures, setPictures] = useState<SamplePicture[]>([])
  const [form, setForm] = useState<FormState>(emptyForm)
  const [editingId, setEditingId] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [originalSize, setOriginalSize] = useState(0)
  const [compressedSize, setCompressedSize] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const isEditing = Boolean(editingId)

  const loadPictures = useCallback(async () => {
    if (!accessToken) return
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/sample-pictures', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'Failed to load sample pictures.')
      }
      setPictures(Array.isArray(data.pictures) ? data.pictures : [])
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load sample pictures.')
    } finally {
      setIsLoading(false)
    }
  }, [accessToken])

  useEffect(() => {
    if (isAuthorized && accessToken) {
      void loadPictures()
    }
  }, [accessToken, isAuthorized, loadPictures])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const sortedPictures = useMemo(() => {
    return [...pictures].sort((a, b) => a.sort_order - b.sort_order || b.created_at.localeCompare(a.created_at))
  }, [pictures])

  const categories = useMemo(() => {
    return Array.from(new Set(pictures.map((picture) => picture.category || 'General'))).sort((a, b) => a.localeCompare(b))
  }, [pictures])

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId('')
    setSelectedFile(null)
    setOriginalSize(0)
    setCompressedSize(0)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl('')
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError('')
    setSuccess('')
    setOriginalSize(file.size)

    try {
      const compressed = await compressImage(file)
      setSelectedFile(compressed)
      setCompressedSize(compressed.size)

      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(URL.createObjectURL(compressed))
    } catch (compressError) {
      setError(compressError instanceof Error ? compressError.message : 'Failed to compress image.')
    }
  }

  const savePicture = async () => {
    if (!accessToken) return
    setError('')
    setSuccess('')
    setIsSaving(true)

    try {
      if (isEditing) {
        const response = await fetch(`/api/admin/sample-pictures/${editingId}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(toPayload(form)),
        })
        const data = await response.json().catch(() => ({}))
        if (!response.ok) {
          throw new Error(typeof data.error === 'string' ? data.error : 'Failed to update sample picture.')
        }
        setSuccess('Sample picture updated.')
      } else {
        if (!selectedFile) {
          throw new Error('Choose an image first.')
        }

        const formData = new FormData()
        formData.set('file', selectedFile)
        formData.set('title', form.title)
        formData.set('alt', form.alt)
        formData.set('style_name', form.style_name)
        formData.set('category', form.category)
        formData.set('localized_title', JSON.stringify(cleanLocalized(form.localized_title)))
        formData.set('localized_alt', JSON.stringify(cleanLocalized(form.localized_alt)))
        formData.set('localized_style_name', JSON.stringify(cleanLocalized(form.localized_style_name)))
        formData.set('localized_category', JSON.stringify(cleanLocalized(form.localized_category)))
        formData.set('sort_order', String(form.sort_order))
        formData.set('is_active', String(form.is_active))

        const response = await fetch('/api/admin/sample-pictures', {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}` },
          body: formData,
        })
        const data = await response.json().catch(() => ({}))
        if (!response.ok) {
          throw new Error(typeof data.error === 'string' ? data.error : 'Failed to upload sample picture.')
        }
        setSuccess('Sample picture uploaded.')
        resetForm()
      }

      await loadPictures()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save sample picture.')
    } finally {
      setIsSaving(false)
    }
  }

  const startEdit = (picture: SamplePicture) => {
    setError('')
    setSuccess('')
    setEditingId(picture.id)
    setSelectedFile(null)
    setOriginalSize(0)
    setCompressedSize(0)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(picture.image_url)
    setForm({
      title: picture.title,
      alt: picture.alt,
      style_name: picture.style_name,
      category: picture.category || 'General',
      localized_title: fillLocalized(picture.localized_title),
      localized_alt: fillLocalized(picture.localized_alt),
      localized_style_name: fillLocalized(picture.localized_style_name),
      localized_category: fillLocalized(picture.localized_category),
      sort_order: Number(picture.sort_order || 0),
      is_active: Boolean(picture.is_active),
    })
  }

  const deletePicture = async (picture: SamplePicture) => {
    if (!accessToken) return
    const confirmed = window.confirm(`Delete "${picture.title}"? This also removes the uploaded image file when possible.`)
    if (!confirmed) return

    setError('')
    setSuccess('')

    try {
      const response = await fetch(`/api/admin/sample-pictures/${picture.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'Failed to delete sample picture.')
      }
      if (editingId === picture.id) resetForm()
      setSuccess('Sample picture deleted.')
      await loadPictures()
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete sample picture.')
    }
  }

  return (
    <AdminPageFrame
      locale={locale}
      title="Sample Pictures"
      subtitle="Upload compressed gallery images and manage localized title, alt text, style labels, and ordering."
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

        <Card className="p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{isEditing ? 'Edit Picture Metadata' : 'Upload Picture'}</h2>
              <p className="mt-1 text-sm text-slate-500">
                Images are compressed in the browser for faster preview and gallery loading.
              </p>
            </div>
            {isEditing && (
              <Button type="button" variant="secondary" onClick={resetForm}>
                New Upload
              </Button>
            )}
          </div>

          <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
            <div>
              <label className="flex min-h-[360px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center transition hover:border-blue-300 hover:bg-blue-50/40">
                {previewUrl ? (
                  <img src={previewUrl} alt="Selected sample preview" className="max-h-[320px] rounded-md object-contain" />
                ) : (
                  <>
                    <ImagePlus className="mb-3 h-10 w-10 text-slate-400" />
                    <span className="text-sm font-bold text-slate-700">Choose an image</span>
                    <span className="mt-1 text-xs text-slate-500">JPG, PNG, or WebP. Dimensions are preserved and converted to WebP.</span>
                  </>
                )}
                {!isEditing && (
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />
                )}
              </label>
              {!isEditing && (originalSize > 0 || compressedSize > 0) && (
                <div className="mt-3 rounded-lg bg-slate-100 p-3 text-xs text-slate-600">
                  <div>Original: {formatBytes(originalSize)}</div>
                  <div>Compressed: {formatBytes(compressedSize)}</div>
                </div>
              )}
            </div>

            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-4">
                <Input label="English Title" value={form.title} onChange={(event) => setFormValue('title', event.target.value, setForm)} />
                <Input label="English Alt" value={form.alt} onChange={(event) => setFormValue('alt', event.target.value, setForm)} />
                <Input label="Style Name" value={form.style_name} onChange={(event) => setFormValue('style_name', event.target.value, setForm)} />
                <Input
                  label="Category"
                  value={form.category}
                  list="sample-picture-categories"
                  onChange={(event) => setFormValue('category', event.target.value, setForm)}
                />
                <datalist id="sample-picture-categories">
                  {categories.map((category) => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </div>

              <div className="grid gap-4 md:grid-cols-[1fr_160px_120px]">
                <Input
                  label="Sort Order"
                  type="number"
                  min={0}
                  value={form.sort_order}
                  onChange={(event) => setFormValue('sort_order', Number(event.target.value), setForm)}
                />
                <label className="mt-8 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(event) => setFormValue('is_active', event.target.checked, setForm)}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  Active
                </label>
              </div>

              <div className="rounded-lg border border-slate-200">
                <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800">
                  Localized metadata
                </div>
                <div className="divide-y divide-slate-100">
                  {routedLocales.map((targetLocale) => (
                    <div key={targetLocale} className="grid gap-3 p-4 md:grid-cols-[72px_1fr_1fr_1fr_1fr]">
                      <div className="pt-3 text-sm font-bold uppercase text-slate-500">{targetLocale}</div>
                      <Input
                        label="Category"
                        value={form.localized_category[targetLocale]}
                        onChange={(event) => setLocalizedValue('localized_category', targetLocale, event.target.value, setForm)}
                      />
                      <Input
                        label="Title"
                        value={form.localized_title[targetLocale]}
                        onChange={(event) => setLocalizedValue('localized_title', targetLocale, event.target.value, setForm)}
                      />
                      <Input
                        label="Alt"
                        value={form.localized_alt[targetLocale]}
                        onChange={(event) => setLocalizedValue('localized_alt', targetLocale, event.target.value, setForm)}
                      />
                      <Input
                        label="Style"
                        value={form.localized_style_name[targetLocale]}
                        onChange={(event) => setLocalizedValue('localized_style_name', targetLocale, event.target.value, setForm)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button type="button" onClick={savePicture} isLoading={isSaving}>
                  {isEditing ? <Save className="mr-2 h-4 w-4" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                  {isEditing ? 'Save Changes' : 'Upload Picture'}
                </Button>
                <Button type="button" variant="secondary" onClick={resetForm}>
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 p-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Gallery Records</h2>
              <p className="text-sm text-slate-500">{pictures.length} pictures</p>
            </div>
            <Button type="button" variant="secondary" onClick={() => void loadPictures()} isLoading={isLoading}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>

          <div className="grid gap-4 p-4 xl:grid-cols-2">
            {sortedPictures.map((picture) => (
              <div key={picture.id} className="grid gap-4 rounded-lg border border-slate-200 p-3 md:grid-cols-[120px_minmax(0,1fr)]">
                <img
                  src={picture.image_url}
                  alt={picture.alt}
                  loading="lazy"
                  className="aspect-[4/5] w-full rounded-md bg-slate-100 object-cover"
                />
                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold text-slate-900">{picture.title}</h3>
                      <p className="mt-1 truncate text-xs text-slate-500">{picture.style_name}</p>
                      <p className="mt-1 truncate text-xs font-semibold text-blue-700">{picture.category || 'General'}</p>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-xs font-bold ${picture.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {picture.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-600">{picture.alt}</p>
                  <div className="mt-3 text-xs text-slate-500">Sort: {picture.sort_order}</div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button type="button" size="sm" variant="secondary" onClick={() => startEdit(picture)}>
                      Edit
                    </Button>
                    <Button type="button" size="sm" variant="ghost" onClick={() => void deletePicture(picture)}>
                      <Trash2 className="mr-1 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminPageFrame>
  )
}

async function compressImage(file: File) {
  if (!file.type.startsWith('image/')) {
    throw new Error('Choose an image file.')
  }

  const image = await loadImage(file)
  const width = image.width
  const height = image.height
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Could not prepare image compression.')

  context.drawImage(image, 0, 0, width, height)
  URL.revokeObjectURL(image.src)

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/webp', 0.82)
  })
  if (!blob) throw new Error('Could not compress image.')

  const baseName = file.name.replace(/\.[^.]+$/, '') || 'sample-picture'
  return new File([blob], `${baseName}.webp`, { type: 'image/webp' })
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => {
      URL.revokeObjectURL(image.src)
      reject(new Error('Could not read image file.'))
    }
    image.src = URL.createObjectURL(file)
  })
}

function setFormValue<K extends keyof FormState>(
  key: K,
  value: FormState[K],
  setForm: (updater: (current: FormState) => FormState) => void,
) {
  setForm((current) => ({ ...current, [key]: value }))
}

function setLocalizedValue(
  key: 'localized_title' | 'localized_alt' | 'localized_style_name' | 'localized_category',
  locale: keyof LocalizedFields,
  value: string,
  setForm: (updater: (current: FormState) => FormState) => void,
) {
  setForm((current) => ({
    ...current,
    [key]: {
      ...current[key],
      [locale]: value,
    },
  }))
}

function toPayload(form: FormState) {
  return {
    title: form.title,
    alt: form.alt,
    style_name: form.style_name,
    category: form.category || 'General',
    localized_title: cleanLocalized(form.localized_title),
    localized_alt: cleanLocalized(form.localized_alt),
    localized_style_name: cleanLocalized(form.localized_style_name),
    localized_category: cleanLocalized(form.localized_category),
    sort_order: form.sort_order,
    is_active: form.is_active,
  }
}

function cleanLocalized(value: LocalizedFields) {
  return Object.fromEntries(
    Object.entries(value)
      .map(([key, entry]) => [key, entry.trim()])
      .filter(([, entry]) => entry),
  )
}

function fillLocalized(value: Partial<LocalizedFields> | null | undefined): LocalizedFields {
  return {
    es: value?.es || '',
    fr: value?.fr || '',
    de: value?.de || '',
    ja: value?.ja || '',
  }
}

function formatBytes(bytes: number) {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB']
  let value = bytes
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit += 1
  }
  return `${value.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`
}
