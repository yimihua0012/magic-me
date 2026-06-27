import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@backend/config/supabase'
import { getCurrentUser } from '@/lib/auth/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { data, error } = await supabaseAdmin
      .from('headshot_styles')
      .select('id,name,category,sort_order,category_order,style_order,selection_count,last_selected_at')
      .order('category_order', { ascending: true })
      .order('style_order', { ascending: true })

    if (error) throw error

    return NextResponse.json(
      {
        styles: data || [],
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
