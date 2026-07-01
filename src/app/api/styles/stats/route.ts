import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@backend/config/supabase'
import { getCurrentUser } from '@/lib/auth/server'
import { isLocale, type Locale } from '@/lib/i18n'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const requestedLocale = url.searchParams.get('locale') || 'en'
    const locale: Locale = isLocale(requestedLocale) ? requestedLocale : 'en'
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    let { data, error } = await supabaseAdmin
      .from('headshot_styles')
      .select('id,name,category,sort_order,category_order,style_order,selection_count,last_selected_at,localized_names,localized_category_labels')
      .order('category_order', { ascending: true })
      .order('style_order', { ascending: true })

    if (error) {
      const fallback = await supabaseAdmin
        .from('headshot_styles')
        .select('id,name,category,sort_order,category_order,style_order,selection_count,last_selected_at')
        .order('category_order', { ascending: true })
        .order('style_order', { ascending: true })

      data = fallback.data?.map((style) => ({
        ...style,
        localized_names: {},
        localized_category_labels: {},
      })) || null
      error = fallback.error
    }

    if (error) throw error

    return NextResponse.json(
      {
        styles: (data || []).map((style) => localizeStyle(style, locale)),
      },
      {
        headers: {
          'Cache-Control': 'private, max-age=60, stale-while-revalidate=300',
        },
      }
    )
  } catch (error) {
    console.error('[Styles Stats] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch style stats' }, { status: 500 })
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
