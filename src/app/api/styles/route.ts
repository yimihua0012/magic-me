import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@backend/config/supabase'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

async function getCurrentUser(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
      if (!error && user) return user
    }

    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()
    return session?.user || null
  } catch {
    return null
  }
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    let { data, error } = await supabaseAdmin
      .from('headshot_styles')
      .select('id,name,category,prompt,negative,sort_order,category_order,style_order,selection_count,last_selected_at,is_active')
      .eq('is_active', true)
      .order('category_order', { ascending: true })
      .order('style_order', { ascending: true })

    if (error) {
      const fallback = await supabaseAdmin
        .from('headshot_styles')
        .select('id,name,category,prompt,negative,sort_order,is_active')
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

    return NextResponse.json({
      styles: data || [],
    })
  } catch (error) {
    console.error('[Styles] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch styles' }, { status: 500 })
  }
}
