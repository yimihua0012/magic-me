import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@backend/config/supabase'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

async function getCurrentUser() {
  const headersList = await headers()
  const authHeader = headersList.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    try {
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
      if (!error && user) {
        return user
      }
    } catch (e) {
      console.error('[Credits] Error verifying bearer token:', e)
    }
  }
  return null
}

export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { data: pending, error: pendingError, count: pendingCount } = await supabaseAdmin
      .from('generations')
      .select('id, plan_type, style_count, created_at', { count: 'exact' })
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: true })

    if (pendingError) {
      console.error('[Credits] Error fetching pending generations:', pendingError)
      return NextResponse.json({ error: 'Failed to fetch credits' }, { status: 500 })
    }

    const { count: totalUsedCount } = await supabaseAdmin
      .from('generations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .in('status', ['completed', 'failed', 'processing'])

    const availableCredits = pendingCount || 0
    const totalUsed = totalUsedCount || 0

    return NextResponse.json({
      availableCredits,
      totalUsed,
      pendingGenerations: pending || [],
    })
  } catch (error) {
    console.error('[Credits] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
