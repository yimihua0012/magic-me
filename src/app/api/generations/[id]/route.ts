import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@backend/config/supabase'
import { getCurrentUser } from '@/lib/auth/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { id } = await params
    const { data: generation, error } = await supabaseAdmin
      .from('generations')
      .select('id,status,plan_type,style_count,output_photos,progress,current_step,created_at,updated_at,completed_at,metadata')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) {
      console.error('[Generation Detail] Fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch generation' }, { status: 500 })
    }

    if (!generation) {
      return NextResponse.json({ error: 'Generation not found' }, { status: 404 })
    }

    return NextResponse.json({ generation })
  } catch (error) {
    console.error('[Generation Detail] Fetch exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { id } = await params
    const { error } = await supabaseAdmin
      .from('generations')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('[Generation Detail] Delete error:', error)
      return NextResponse.json({ error: 'Failed to delete generation' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[Generation Detail] Delete exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
