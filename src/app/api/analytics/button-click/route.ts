import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { supabaseAdmin } from '@backend/config/supabase'
import { isAdminDashboardPath } from '@/lib/analytics-paths'

export const dynamic = 'force-dynamic'

async function getCurrentUserId(headersList: Headers) {
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
    const headersList = await headers()
    const { buttonType, source, clickedAt, metadata } = await request.json()

    if (typeof buttonType !== 'string' || !buttonType.trim()) {
      return NextResponse.json({ error: 'buttonType is required' }, { status: 400 })
    }

    if (typeof source !== 'string' || !source.trim()) {
      return NextResponse.json({ error: 'source is required' }, { status: 400 })
    }

    const safeMetadata = metadata && typeof metadata === 'object'
      ? metadata as Record<string, unknown>
      : {}

    if (isAdminAnalyticsEvent({
      source,
      metadata: safeMetadata,
      referer: headersList.get('referer'),
    })) {
      return NextResponse.json({ ok: true, skipped: true })
    }

    const parsedClickedAt = clickedAt ? new Date(clickedAt) : new Date()
    const userId = await getCurrentUserId(headersList)

    const { error } = await supabaseAdmin
      .from('button_click_logs')
      .insert({
        clicked_at: Number.isNaN(parsedClickedAt.getTime()) ? new Date().toISOString() : parsedClickedAt.toISOString(),
        button_type: buttonType.trim(),
        source: source.trim(),
        user_id: userId,
        metadata: safeMetadata,
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

function isAdminAnalyticsEvent({
  source,
  metadata,
  referer,
}: {
  source: string
  metadata: Record<string, unknown>
  referer: string | null
}) {
  if (isAdminDashboardPath(source) || isAdminDashboardPath(referer)) {
    return true
  }

  return [
    metadata.currentPath,
    metadata.pathname,
    metadata.path,
    metadata.pagePath,
    metadata.referrerPath,
  ].some((value) => typeof value === 'string' && isAdminDashboardPath(value))
}
