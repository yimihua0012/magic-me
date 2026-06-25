import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')))
    const offset = (page - 1) * limit

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (!user && authError) {
      console.warn('Auth error:', authError)
    }

    // 如果没有用户，返回空数组
    if (!user) {
      return NextResponse.json({ generations: [], pagination: { page, limit, total: 0, totalPages: 0 } })
    }

    // 并行查询数据和总数
    const [{ data: generations, error }, { count, error: countError }] = await Promise.all([
      supabase
        .from('generations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1),
      supabase
        .from('generations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id),
    ])

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ generations: [], pagination: { page, limit, total: 0, totalPages: 0 } })
    }

    const total = count || 0
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      generations: generations || [],
      pagination: { page, limit, total, totalPages },
    })
  } catch (error) {
    console.error('Fetch generations error:', error)
    return NextResponse.json({ generations: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { plan_type, photo_count } = await request.json()

    const { data: generation, error } = await supabase
      .from('generations')
      .insert({
        user_id: user.id,
        status: 'pending',
        plan_type: plan_type || 'basic',
        style_count: plan_type === 'pro' ? 100 : 30,
        input_photos: [],
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to create generation' }, { status: 500 })
    }

    return NextResponse.json({ generation })
  } catch (error) {
    console.error('Create generation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
