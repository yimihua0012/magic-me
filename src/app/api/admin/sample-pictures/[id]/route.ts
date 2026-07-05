import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@backend/config/supabase'
import { isAdminEmail } from '@/lib/admin'
import { getCurrentUser } from '@/lib/auth/server'
import type { SamplePictureRow } from '@/lib/sample-pictures'

export const dynamic = 'force-dynamic'

const bucket = 'sample-pictures'

type RouteContext = {
  params: Promise<{ id: string }>
}

type UpdateInput = {
  title?: unknown
  alt?: unknown
  style_name?: unknown
  category?: unknown
  localized_title?: unknown
  localized_alt?: unknown
  localized_style_name?: unknown
  localized_category?: unknown
  sort_order?: unknown
  is_active?: unknown
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const auth = await requireAdmin(request)
  if (auth) return auth

  const { id } = await params
  if (!id) {
    return NextResponse.json({ error: 'Picture id is required.' }, { status: 400 })
  }

  const body = await request.json().catch(() => null) as UpdateInput | null
  if (!body) {
    return NextResponse.json({ error: 'Update data is required.' }, { status: 400 })
  }

  let updates: Record<string, unknown>
  try {
    updates = sanitizeUpdates(body)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Invalid update data.' },
      { status: 400 },
    )
  }
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid updates provided.' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('sample_picture')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('[Admin Sample Pictures] Update error:', error)
    return NextResponse.json({ error: 'Failed to update sample picture.' }, { status: 500 })
  }

  return NextResponse.json({ picture: data as SamplePictureRow })
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const auth = await requireAdmin(request)
  if (auth) return auth

  const { id } = await params
  if (!id) {
    return NextResponse.json({ error: 'Picture id is required.' }, { status: 400 })
  }

  const { data: existing, error: loadError } = await supabaseAdmin
    .from('sample_picture')
    .select('id,storage_path')
    .eq('id', id)
    .single()

  if (loadError) {
    console.error('[Admin Sample Pictures] Load before delete error:', loadError)
    return NextResponse.json({ error: 'Sample picture not found.' }, { status: 404 })
  }

  const { error } = await supabaseAdmin
    .from('sample_picture')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('[Admin Sample Pictures] Delete error:', error)
    return NextResponse.json({ error: 'Failed to delete sample picture.' }, { status: 500 })
  }

  if (existing?.storage_path) {
    const removal = await supabaseAdmin.storage.from(bucket).remove([existing.storage_path])
    if (removal.error) {
      console.error('[Admin Sample Pictures] Storage delete error:', removal.error)
    }
  }

  return NextResponse.json({ ok: true, id })
}

async function requireAdmin(request: Request) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  if (!isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return null
}

function sanitizeUpdates(input: UpdateInput) {
  const updates: Record<string, unknown> = {}

  for (const field of ['title', 'alt', 'style_name'] as const) {
    if (input[field] !== undefined) {
      if (typeof input[field] !== 'string' || !input[field].trim()) {
        throw new Error(`${field} must be a non-empty string`)
      }
      updates[field] = input[field].trim()
    }
  }

  if (input.category !== undefined) {
    if (typeof input.category !== 'string') {
      throw new Error('category must be a string')
    }
    updates.category = input.category.trim() || 'General'
  }

  for (const field of ['localized_title', 'localized_alt', 'localized_style_name', 'localized_category'] as const) {
    if (input[field] !== undefined) {
      updates[field] = plainLocalizedObject(input[field])
    }
  }

  if (input.sort_order !== undefined) {
    const value = Number(input.sort_order)
    if (!Number.isInteger(value) || value < 0 || value > 100000) {
      throw new Error('sort_order must be an integer between 0 and 100000')
    }
    updates.sort_order = value
  }

  if (input.is_active !== undefined) {
    if (typeof input.is_active !== 'boolean') {
      throw new Error('is_active must be boolean')
    }
    updates.is_active = input.is_active
  }

  return updates
}

function plainLocalizedObject(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}

  return Object.fromEntries(
    Object.entries(value)
      .filter(([, entry]) => typeof entry === 'string' && entry.trim())
      .map(([locale, entry]) => [locale, String(entry).trim()]),
  )
}
