import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@backend/config/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    let { data, error } = await supabaseAdmin
      .from('headshot_styles')
      .select('id,name,category,category_order,style_order,selection_count,last_selected_at')
      .eq('is_active', true)
      .order('category_order', { ascending: true })
      .order('style_order', { ascending: true })

    if (error) {
      const fallback = await supabaseAdmin
        .from('headshot_styles')
        .select('id,name,category,sort_order,selection_count,last_selected_at')
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
      throw error
    }

    return NextResponse.json(
      {
        styles: data || [],
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
