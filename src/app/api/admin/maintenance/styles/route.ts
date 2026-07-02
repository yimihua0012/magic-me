import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@backend/config/supabase'
import { isAdminEmail } from '@/lib/admin'
import { getCurrentUser } from '@/lib/auth/server'

export const dynamic = 'force-dynamic'

type StyleUpdates = {
  name?: unknown
  category?: unknown
  prompt?: unknown
  negative?: unknown
  is_active?: unknown
  category_order?: unknown
  style_order?: unknown
  localized_names?: unknown
  localized_category_labels?: unknown
}

type StyleCreateInput = {
  id?: unknown
  name?: unknown
  category?: unknown
  prompt?: unknown
  negative?: unknown
  is_active?: unknown
  category_order?: unknown
  style_order?: unknown
  localized_names?: unknown
  localized_category_labels?: unknown
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    if (!isAdminEmail(user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json().catch(() => null) as StyleCreateInput | null
    if (!body) {
      return NextResponse.json({ error: 'Style data is required' }, { status: 400 })
    }

    const name = stringField(body.name, 'name')
    const category = stringField(body.category, 'category')
    const prompt = stringField(body.prompt, 'prompt')
    const negative = stringField(body.negative, 'negative')
    const now = new Date().toISOString()
    const style = {
      id: typeof body.id === 'string' && body.id.trim() ? body.id.trim() : slugify(name),
      name,
      category,
      prompt,
      negative,
      is_active: typeof body.is_active === 'boolean' ? body.is_active : true,
      category_order: integerField(body.category_order, 'category_order', 0),
      style_order: integerField(body.style_order, 'style_order', 0),
      localized_names: plainObjectField(body.localized_names, 'localized_names'),
      localized_category_labels: plainObjectField(body.localized_category_labels, 'localized_category_labels'),
      selection_count: 0,
      created_at: now,
      updated_at: now,
    }

    const { data, error } = await supabaseAdmin
      .from('headshot_styles')
      .insert(style)
      .select('id,name,category,is_active,category_order,style_order,selection_count,updated_at')
      .single()

    if (error) {
      console.error('[Admin Style Maintenance] Create error:', error)
      return NextResponse.json({ error: 'Failed to create style' }, { status: 500 })
    }

    return NextResponse.json({ style: data })
  } catch (error) {
    console.error('[Admin Style Maintenance] Create error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    if (!isAdminEmail(user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json().catch(() => null) as { id?: unknown; updates?: StyleUpdates } | null
    if (!body || typeof body.id !== 'string' || !body.id.trim()) {
      return NextResponse.json({ error: 'Style id is required' }, { status: 400 })
    }

    const updates = sanitizeUpdates(body.updates || {})
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid updates provided' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('headshot_styles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', body.id.trim())
      .select('id,name,category,is_active,category_order,style_order,selection_count,updated_at')
      .single()

    if (error) {
      console.error('[Admin Style Maintenance] Update error:', error)
      return NextResponse.json({ error: 'Failed to update style' }, { status: 500 })
    }

    return NextResponse.json({ style: data })
  } catch (error) {
    console.error('[Admin Style Maintenance] Error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 })
  }
}

function sanitizeUpdates(updates: StyleUpdates) {
  const next: Record<string, unknown> = {}

  for (const field of ['name', 'category', 'prompt', 'negative'] as const) {
    if (updates[field] !== undefined) {
      if (typeof updates[field] !== 'string' || !updates[field].trim()) {
        throw new Error(`${field} must be a non-empty string`)
      }
      next[field] = updates[field].trim()
    }
  }

  if (updates.is_active !== undefined) {
    if (typeof updates.is_active !== 'boolean') {
      throw new Error('is_active must be a boolean')
    }
    next.is_active = updates.is_active
  }

  for (const field of ['category_order', 'style_order'] as const) {
    if (updates[field] !== undefined) {
      const value = Number(updates[field])
      if (!Number.isInteger(value) || value < 0 || value > 10000) {
        throw new Error(`${field} must be an integer between 0 and 10000`)
      }
      next[field] = value
    }
  }

  for (const field of ['localized_names', 'localized_category_labels'] as const) {
    if (updates[field] !== undefined) {
      if (!isPlainObject(updates[field])) {
        throw new Error(`${field} must be a JSON object`)
      }
      next[field] = updates[field]
    }
  }

  return next
}

function stringField(value: unknown, field: string) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${field} must be a non-empty string`)
  }

  return value.trim()
}

function integerField(value: unknown, field: string, fallback: number) {
  if (value === undefined || value === null || value === '') return fallback
  const numeric = Number(value)
  if (!Number.isInteger(numeric) || numeric < 0 || numeric > 10000) {
    throw new Error(`${field} must be an integer between 0 and 10000`)
  }

  return numeric
}

function plainObjectField(value: unknown, field: string) {
  if (value === undefined || value === null) return {}
  if (!isPlainObject(value)) {
    throw new Error(`${field} must be a JSON object`)
  }

  return value
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return slug || `style-${Date.now()}`
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}
