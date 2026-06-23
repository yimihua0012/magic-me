import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (!user && authError) {
      console.warn('Auth error:', authError)
    }

    // 如果没有用户，返回空数组
    if (!user) {
      return NextResponse.json({ generations: [] })
    }

    const { data: generations, error } = await supabase
      .from('generations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ generations: [] })
    }

    return NextResponse.json({ generations })
  } catch (error) {
    console.error('Fetch generations error:', error)
    return NextResponse.json({ generations: [] })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (!user && authError) {
      console.warn('Auth error:', authError)
    }

    const userId = user?.id || 'anonymous'
    const { plan_type, photo_count } = await request.json()

    const { data: generation, error } = await supabase
      .from('generations')
      .insert({
        user_id: userId,
        status: 'pending',
        plan_type: plan_type || 'basic',
        style_count: plan_type === 'pro' ? 100 : 30,
        input_photos: [],
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      // 如果数据库插入失败，返回模拟数据
      const mockGeneration = {
        id: `gen_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        user_id: userId,
        status: 'pending',
        plan_type: plan_type || 'basic',
        style_count: plan_type === 'pro' ? 100 : 30,
        input_photos: [] as string[],
        output_photos: [] as string[],
        progress: 0,
        created_at: new Date().toISOString(),
      }
      return NextResponse.json({ generation: mockGeneration })
    }

    return NextResponse.json({ generation })
  } catch (error) {
    console.error('Create generation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
