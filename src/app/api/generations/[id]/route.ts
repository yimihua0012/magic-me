import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@backend/config/supabase'

export const dynamic = 'force-dynamic'

async function getCurrentUser(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    try {
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
      if (!error && user) {
        return user
      }
    } catch (e) {
      console.error('[Generation Detail] Error verifying bearer token:', e)
    }
  }

  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user || null
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { id } = await params
    const { data: generation, error } = await supabaseAdmin
      .from('generations')
      .select('*')
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
