import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@backend/config/supabase'
import { isLocale, type Locale } from '@/lib/i18n'

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

    return NextResponse.json(
      {
        styles: (data || []).map((style) => localizeStyle(style, locale)),
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
  name: string
  category: string
  localized_names?: Record<string, string> | null
  localized_category_labels?: Record<string, string> | null
  [key: string]: unknown
}

function localizeStyle(style: StyleRow, locale: Locale) {
  const localizedName = style.localized_names?.[locale]
  const localizedCategoryLabel = style.localized_category_labels?.[locale]

  return {
    ...style,
    default_name: style.name,
    name: localizedName || style.name,
    category_label: localizedCategoryLabel || style.category,
  }
}
