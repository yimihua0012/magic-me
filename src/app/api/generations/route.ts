import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { data: generations, error } = await supabase
      .from('generations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ generations })
  } catch (error) {
    console.error('Fetch generations error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
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
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ generation })
  } catch (error) {
    console.error('Create generation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
