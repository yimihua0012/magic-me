import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@backend/config/supabase'
import { isLocale, type Locale } from '@/lib/i18n'
import { PHOTO_TOOL_STYLE_CONFIGS } from '@/lib/photo-tool-styles'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
const requestedLocale = url.searchParams.get('locale') || 'en'
    const locale: Locale = isLocale(requestedLocale) ? requestedLocale : 'en'

    let { data, error } = await supabaseAdmin
      .from('headshot_styles')
      .select('id,name,category,category_order,style_order,selection_count,last_selected_at,localized_names,localized_category_labels')
      .eq('is_active', true)
      .order('category_order', { ascending: true })
      .order('style_order', { ascending: true })

    if (error) {
      const fallback = await supabaseAdmin
        .from('headshot_styles')
        .select('id,name,category,sort_order,selection_count,last_selected_at,localized_names,localized_category_labels')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      data = fallback.data?.map((style) => ({
        ...style,
        category_order: 99,
        style_order: style.sort_order || 0,
        selection_count: 0,
        last_selected_at: null,
      })) || null
      error = fallback.error
    }

    if (error) {
      const legacyFallback = await supabaseAdmin
        .from('headshot_styles')
        .select('id,name,category,sort_order,selection_count,last_selected_at')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      data = legacyFallback.data?.map((style) => ({
        ...style,
        category_order: 99,
        style_order: style.sort_order || 0,
        selection_count: style.selection_count || 0,
        last_selected_at: style.last_selected_at || null,
        localized_names: {},
        localized_category_labels: {},
      })) || null
      error = legacyFallback.error
    }

    if (error) {
      throw error
    }

    const styles = includeFallbackPhotoToolStyles(data || []).map(applyPhotoToolStyleOverrides)

    // 预览图：优先按 style_name 精确匹配样例库，其次按 category 兜底
    const previewMap = await loadStylePreviewMap()

    return NextResponse.json(
      {
        styles: styles.map((style) => localizeStyle(style, locale, previewMap)),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    )
  } catch (error) {
    console.error('[Styles] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch styles' }, { status: 500 })
  }
}

type StyleRow = {
  id?: string
  name: string
  category: string
  localized_names?: Record<string, string> | null
  localized_category_labels?: Record<string, string> | null
  [key: string]: unknown
}

function includeFallbackPhotoToolStyles(styles: StyleRow[]) {
  const existingIds = new Set(styles.map((style) => style.id).filter(Boolean))
  const missingPhotoToolStyles = PHOTO_TOOL_STYLE_CONFIGS
    .filter((style) => !existingIds.has(style.id))
    .map((style) => ({
      ...style,
      is_active: true,
    }))

  if (missingPhotoToolStyles.length === 0) {
    return styles
  }

  return [...styles, ...missingPhotoToolStyles].sort((left, right) => {
    const leftCategoryOrder = typeof left.category_order === 'number' ? left.category_order : 99
    const rightCategoryOrder = typeof right.category_order === 'number' ? right.category_order : 99
    if (leftCategoryOrder !== rightCategoryOrder) return leftCategoryOrder - rightCategoryOrder

    const leftStyleOrder = typeof left.style_order === 'number' ? left.style_order : 0
    const rightStyleOrder = typeof right.style_order === 'number' ? right.style_order : 0
    return leftStyleOrder - rightStyleOrder
  })
}

function applyPhotoToolStyleOverrides(style: StyleRow): StyleRow {
  const photoToolStyle = PHOTO_TOOL_STYLE_CONFIGS.find((config) => config.id === style.id)
  if (!photoToolStyle) return style

  return {
    ...style,
    name: photoToolStyle.name,
    category: photoToolStyle.category,
    localized_names: {
      ...(style.localized_names || {}),
      ...photoToolStyle.localized_names,
    },
    localized_category_labels: {
      ...(style.localized_category_labels || {}),
      ...photoToolStyle.localized_category_labels,
    },
  }
}

function localizeStyle(style: StyleRow, locale: Locale, previewMap?: StylePreviewMap) {
  const localizedName = style.localized_names?.[locale]
  const localizedCategoryLabel = style.localized_category_labels?.[locale]

  const styleId = style.id || style.name
  const normalize = (value: string) => value.trim().toLowerCase()
  const previewImage =
    previewMap?.byStyleId.get(styleId) ??
    previewMap?.byStyleName.get(normalize(style.name)) ??
    previewMap?.byCategory.get(normalize(style.category)) ??
    null

  return {
    ...style,
    default_name: style.name,
    name: localizedName || style.name,
    category_label: localizedCategoryLabel || style.category,
    preview_image: previewImage,
  }
}

type StylePreviewMap = {
  byStyleId: Map<string, string>
  byStyleName: Map<string, string>
  byCategory: Map<string, string>
}

// 风格模板图：优先 style_templates（按 style_id 精确匹配），
// 其次 sample_picture 样例库按 风格名/分类 匹配兜底。
async function loadStylePreviewMap(): Promise<StylePreviewMap> {
  const byStyleId = new Map<string, string>()
  const byStyleName = new Map<string, string>()
  const byCategory = new Map<string, string>()
  const normalize = (value: unknown) => String(value ?? '').trim().toLowerCase()

  try {
    const { data: templates } = await supabaseAdmin
      .from('style_templates')
      .select('style_id,image_url')

    for (const row of templates || []) {
      if (!row?.style_id || !row.image_url) continue
      if (!byStyleId.has(row.style_id)) byStyleId.set(row.style_id, row.image_url)
    }
  } catch (error) {
    // 表不存在时静默降级（由 sample_picture 兜底），仅开发期打日志
    if (!String(error).toLowerCase().includes('relation') && !String(error).toLowerCase().includes('does not exist')) {
      console.error('[Styles] Failed to load style templates:', error)
    }
  }

  try {
    const { data } = await supabaseAdmin
      .from('sample_picture')
      .select('style_name,category,image_url')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    for (const row of data || []) {
      if (!row?.image_url) continue
      const styleName = normalize(row.style_name)
      const category = normalize(row.category)

      if (styleName && !byStyleName.has(styleName)) {
        byStyleName.set(styleName, row.image_url)
      }
      if (category && !byCategory.has(category)) {
        byCategory.set(category, row.image_url)
      }
    }
  } catch (error) {
    console.error('[Styles] Failed to load sample picture preview map:', error)
  }

  return { byStyleId, byStyleName, byCategory }
}
