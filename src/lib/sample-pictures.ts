import 'server-only'

import { supabaseAdmin } from '@backend/config/supabase'
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n'

export type SamplePictureRow = {
  id: string
  image_url: string
  storage_path: string | null
  alt: string
  title: string
  style_name: string
  category: string
  localized_alt: Record<string, string> | null
  localized_title: Record<string, string> | null
  localized_style_name: Record<string, string> | null
  localized_category: Record<string, string> | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type LocalizedSamplePicture = {
  id: string
  imageUrl: string
  storagePath: string | null
  alt: string
  title: string
  styleName: string
  category: string
  sortOrder: number
  createdAt: string
  updatedAt: string
}

const samplePictureSelect = [
  'id',
  'image_url',
  'storage_path',
  'alt',
  'title',
  'style_name',
  'category',
  'localized_alt',
  'localized_title',
  'localized_style_name',
  'localized_category',
  'sort_order',
  'is_active',
  'created_at',
  'updated_at',
].join(',')

export async function getSamplePictures(locale: Locale = DEFAULT_LOCALE, activeOnly = true) {
  let query = supabaseAdmin
    .from('sample_picture')
    .select(samplePictureSelect)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (activeOnly) {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query
  if (error) {
    console.error('[Sample Pictures] Failed to load pictures:', error)
    return []
  }

  return ((data || []) as unknown as SamplePictureRow[]).map((row) => localizeSamplePicture(row, locale))
}

export function localizeSamplePicture(row: SamplePictureRow, locale: Locale): LocalizedSamplePicture {
  return {
    id: row.id,
    imageUrl: row.image_url,
    storagePath: row.storage_path,
    alt: localizedValue(row.localized_alt, locale) || row.alt,
    title: localizedValue(row.localized_title, locale) || row.title,
    styleName: localizedValue(row.localized_style_name, locale) || row.style_name,
    category: localizedValue(row.localized_category, locale) || row.category || 'General',
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function localizedValue(value: Record<string, string> | null | undefined, locale: Locale) {
  if (locale === DEFAULT_LOCALE || !value) return ''
  const localized = value[locale]
  return typeof localized === 'string' ? localized.trim() : ''
}
