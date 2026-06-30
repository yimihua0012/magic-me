import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { supabaseAdmin } from '@backend/config/supabase'

export const dynamic = 'force-dynamic'

async function getCurrentUserId() {
  const headersList = await headers()
  const authHeader = headersList.get('authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  try {
    const token = authHeader.substring(7)
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    return error ? null : user?.id ?? null
  } catch (error) {
    console.error('[ButtonClick] Error verifying bearer token:', error)
    return null
  }
}

export async function POST(request: Request) {
  try {
    const { buttonType, source, clickedAt, metadata } = await request.json()

    if (typeof buttonType !== 'string' || !buttonType.trim()) {
      return NextResponse.json({ error: 'buttonType is required' }, { status: 400 })
    }

    if (typeof source !== 'string' || !source.trim()) {
      return NextResponse.json({ error: 'source is required' }, { status: 400 })
    }

    const parsedClickedAt = clickedAt ? new Date(clickedAt) : new Date()
    const userId = await getCurrentUserId()

    const { error } = await supabaseAdmin
      .from('button_click_logs')
      .insert({
        clicked_at: Number.isNaN(parsedClickedAt.getTime()) ? new Date().toISOString() : parsedClickedAt.toISOString(),
        button_type: buttonType.trim(),
        source: source.trim(),
        user_id: userId,
        metadata: metadata && typeof metadata === 'object' ? metadata : {},
      })

    if (error) {
      console.error('[ButtonClick] Insert error:', error)
      return NextResponse.json({ error: 'Failed to log button click' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[ButtonClick] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
