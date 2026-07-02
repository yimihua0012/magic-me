import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@backend/config/supabase'
import { PLANS, type PlanType } from '@backend/config/plans'
import { CreditTransactionService } from '@backend/services/credit-transaction.service'
import { isAdminEmail } from '@/lib/admin'
import { getCurrentUser } from '@/lib/auth/server'

export const dynamic = 'force-dynamic'

const statuses = ['inactive', 'active', 'expired', 'depleted'] as const
const planTypes = Object.keys(PLANS) as PlanType[]

type CreditPackageRow = {
  id: string
  plan_type: PlanType
  total_credits: number
  remaining_credits: number
  status: typeof statuses[number]
  activated_at: string | null
  expires_at: string | null
  validity_days: number
}

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdmin(request)
    if (admin instanceof NextResponse) return admin

    const body = await request.json().catch(() => null) as {
      id?: unknown
      updates?: Record<string, unknown>
    } | null

    if (!body || typeof body.id !== 'string' || !body.id.trim()) {
      return NextResponse.json({ error: 'Package id is required' }, { status: 400 })
    }

    const updates = sanitizePackageUpdates(body.updates || {})
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid updates provided' }, { status: 400 })
    }

    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('credit_packages')
      .select('id,user_id,remaining_credits,total_credits,status,expires_at')
      .eq('id', body.id.trim())
      .single()

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 })
    }

    const { data, error } = await supabaseAdmin
      .from('credit_packages')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', body.id.trim())
      .select('id,user_id,plan_type,total_credits,remaining_credits,status,activated_at,expires_at,validity_days,updated_at')
      .single()

    if (error) {
      console.error('[Admin Package Maintenance] Update error:', error)
      return NextResponse.json({ error: 'Failed to update package' }, { status: 500 })
    }

    const delta = typeof updates.remaining_credits === 'number'
      ? updates.remaining_credits - existing.remaining_credits
      : 0

    if (delta !== 0) {
      await CreditTransactionService.record({
        userId: existing.user_id,
        creditPackageId: existing.id,
        transactionType: 'manual_adjustment',
        amountDelta: delta,
        packageRemainingAfter: updates.remaining_credits as number,
        description: 'Admin adjusted package credits',
        source: 'admin',
        metadata: {
          previousRemaining: existing.remaining_credits,
          nextRemaining: updates.remaining_credits,
          previousStatus: existing.status,
          nextStatus: data.status,
        },
      })
    }

    return NextResponse.json({ package: data })
  } catch (error) {
    console.error('[Admin Package Maintenance] Error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin(request)
    if (admin instanceof NextResponse) return admin

    const body = await request.json().catch(() => null) as { id?: unknown; action?: unknown } | null
    if (!body || typeof body.id !== 'string' || !body.id.trim()) {
      return NextResponse.json({ error: 'Package id is required' }, { status: 400 })
    }

    if (body.action !== 'renew') {
      return NextResponse.json({ error: 'Unsupported package action' }, { status: 400 })
    }

    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('credit_packages')
      .select('id,plan_type,total_credits,remaining_credits,status,activated_at,expires_at,validity_days')
      .eq('id', body.id.trim())
      .single()

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 })
    }

    const pkg = existing as CreditPackageRow
    const now = new Date()
    const base = pkg.expires_at && new Date(pkg.expires_at).getTime() > now.getTime()
      ? new Date(pkg.expires_at)
      : now
    const validityDays = pkg.validity_days || PLANS[pkg.plan_type]?.validityDays || 30
    const expiresAt = addDays(base, validityDays)

    const { data, error } = await supabaseAdmin
      .from('credit_packages')
      .update({
        status: pkg.remaining_credits > 0 ? 'active' : pkg.status,
        activated_at: pkg.activated_at || now.toISOString(),
        expires_at: expiresAt.toISOString(),
        updated_at: now.toISOString(),
      })
      .eq('id', pkg.id)
      .select('id,user_id,plan_type,total_credits,remaining_credits,status,activated_at,expires_at,validity_days,updated_at')
      .single()

    if (error) {
      console.error('[Admin Package Maintenance] Renew error:', error)
      return NextResponse.json({ error: 'Failed to renew package' }, { status: 500 })
    }

    await CreditTransactionService.record({
      userId: data.user_id,
      creditPackageId: data.id,
      transactionType: 'package_renewed',
      amountDelta: 0,
      packageRemainingAfter: data.remaining_credits,
      description: 'Credit package renewed',
      source: 'admin',
      metadata: {
        previousExpiresAt: pkg.expires_at,
        nextExpiresAt: data.expires_at,
        validityDays,
      },
    })

    return NextResponse.json({ package: data })
  } catch (error) {
    console.error('[Admin Package Maintenance] Renew error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 })
  }
}

async function requireAdmin(request: Request) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  if (!isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return user
}

function sanitizePackageUpdates(updates: Record<string, unknown>) {
  const next: Record<string, unknown> = {}

  if (updates.plan_type !== undefined) {
    if (typeof updates.plan_type !== 'string' || !planTypes.includes(updates.plan_type as PlanType)) {
      throw new Error('plan_type must be basic, pro, or premium')
    }
    next.plan_type = updates.plan_type
  }

  for (const field of ['total_credits', 'remaining_credits', 'validity_days'] as const) {
    if (updates[field] !== undefined) {
      next[field] = boundedInteger(updates[field], field)
    }
  }

  if (updates.status !== undefined) {
    if (typeof updates.status !== 'string' || !statuses.includes(updates.status as typeof statuses[number])) {
      throw new Error('status must be inactive, active, expired, or depleted')
    }
    next.status = updates.status
  }

  for (const field of ['activated_at', 'expires_at'] as const) {
    if (updates[field] !== undefined) {
      next[field] = nullableIsoDate(updates[field], field)
    }
  }

  return next
}

function boundedInteger(value: unknown, field: string) {
  const numeric = Number(value)
  if (!Number.isInteger(numeric) || numeric < 0 || numeric > 100000) {
    throw new Error(`${field} must be an integer between 0 and 100000`)
  }

  return numeric
}

function nullableIsoDate(value: unknown, field: string) {
  if (value === null || value === '') return null
  if (typeof value !== 'string') {
    throw new Error(`${field} must be an ISO date string or empty`)
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    throw new Error(`${field} must be a valid date`)
  }

  return date.toISOString()
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000)
}
