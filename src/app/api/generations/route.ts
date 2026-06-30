import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@backend/config/supabase'
import { getCurrentUser } from '@/lib/auth/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)))
    const offset = (page - 1) * limit

    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const [{ data: generations, error }, { count, error: countError }] = await Promise.all([
      supabaseAdmin
        .from('generations')
        .select('id,status,plan_type,style_count,output_photos,created_at,updated_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1),
      supabaseAdmin
        .from('generations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id),
    ])

    if (error || countError) {
      console.error('[Generations] Database error:', error || countError)
      return NextResponse.json({ error: 'Failed to fetch generations' }, { status: 500 })
    }

    const total = count || 0
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      generations: generations || [],
      pagination: { page, limit, total, totalPages },
    })
  } catch (error) {
    console.error('[Generations] Fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { plan_type } = await request.json()

    const { data: generation, error } = await supabaseAdmin
      .from('generations')
      .insert({
        user_id: user.id,
        status: 'pending',
        plan_type: plan_type || 'basic',
        style_count: plan_type === 'pro' ? 100 : 30,
        input_photos: [],
      })
      .select('id,status,plan_type,style_count,output_photos,created_at,updated_at')
      .single()

    if (error) {
      console.error('[Generations] Create error:', error)
      return NextResponse.json({ error: 'Failed to create generation' }, { status: 500 })
    }

    return NextResponse.json({ generation })
  } catch (error) {
    console.error('[Generations] Create exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
