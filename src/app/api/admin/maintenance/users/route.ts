import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@backend/config/supabase'
import { PLANS, type PlanType } from '@backend/config/plans'
import { CreditTransactionService } from '@backend/services/credit-transaction.service'
import { isAdminEmail } from '@/lib/admin'
import { getCurrentUser } from '@/lib/auth/server'

export const dynamic = 'force-dynamic'

const planTypes = Object.keys(PLANS) as PlanType[]

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdmin(request)
    if (admin instanceof NextResponse) return admin

    const body = await request.json().catch(() => null) as {
      id?: unknown
      updates?: {
        full_name?: unknown
        plan_type?: unknown
        email_verified?: unknown
      }
    } | null

    if (!body || typeof body.id !== 'string' || !body.id.trim()) {
      return NextResponse.json({ error: 'User id is required' }, { status: 400 })
    }

    const updates = sanitizeProfileUpdates(body.updates || {})
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid updates provided' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', body.id.trim())
      .select('id,email,full_name,plan_type,email_verified,updated_at')
      .single()

    if (error) {
      console.error('[Admin User Maintenance] Update error:', error)
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }

    return NextResponse.json({ user: data })
  } catch (error) {
    console.error('[Admin User Maintenance] Error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin(request)
    if (admin instanceof NextResponse) return admin

    const body = await request.json().catch(() => null) as {
      userId?: unknown
      planType?: unknown
      credits?: unknown
      validityDays?: unknown
      status?: unknown
    } | null

    if (!body || typeof body.userId !== 'string' || !body.userId.trim()) {
      return NextResponse.json({ error: 'User id is required' }, { status: 400 })
    }

    const planType = planField(body.planType)
    const credits = positiveInteger(body.credits, 'credits', PLANS[planType].credits)
    const validityDays = positiveInteger(body.validityDays, 'validityDays', PLANS[planType].validityDays)
    const status = statusField(body.status, 'inactive')
    const now = new Date()
    const packageData: Record<string, unknown> = {
      user_id: body.userId.trim(),
      plan_type: planType,
      total_credits: credits,
      remaining_credits: credits,
      validity_days: validityDays,
      status,
      purchased_at: now.toISOString(),
      amount_paid: 0,
      currency: 'USD',
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    }

    if (status === 'active') {
      packageData.activated_at = now.toISOString()
      packageData.expires_at = addDays(now, validityDays).toISOString()
    }

    const { data, error } = await supabaseAdmin
      .from('credit_packages')
      .insert(packageData)
      .select('id,user_id,plan_type,total_credits,remaining_credits,status,expires_at')
      .single()

    if (error) {
      console.error('[Admin User Maintenance] Grant package error:', error)
      return NextResponse.json({ error: 'Failed to create credit package' }, { status: 500 })
    }

    await CreditTransactionService.record({
      userId: body.userId.trim(),
      creditPackageId: data.id,
      transactionType: 'credit_added',
      amountDelta: credits,
      packageRemainingAfter: credits,
      description: 'Manual credit package granted',
      source: 'admin',
      sourceKey: `package:add:${data.id}`,
      metadata: {
        planType,
        validityDays,
        status,
      },
    })

    return NextResponse.json({ package: data })
  } catch (error) {
    console.error('[Admin User Maintenance] Grant error:', error)
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

function sanitizeProfileUpdates(updates: Record<string, unknown>) {
  const next: Record<string, unknown> = {}

  if (updates.full_name !== undefined) {
    if (typeof updates.full_name !== 'string') {
      throw new Error('full_name must be a string')
    }
    next.full_name = updates.full_name.trim() || null
  }

  if (updates.plan_type !== undefined) {
    next.plan_type = planField(updates.plan_type)
  }

  if (updates.email_verified !== undefined) {
    if (typeof updates.email_verified !== 'boolean') {
      throw new Error('email_verified must be a boolean')
    }
    next.email_verified = updates.email_verified
  }

  return next
}

function planField(value: unknown): PlanType {
  if (typeof value !== 'string' || !planTypes.includes(value as PlanType)) {
    throw new Error('planType must be basic, pro, or premium')
  }

  return value as PlanType
}

function statusField(value: unknown, fallback: 'inactive' | 'active') {
  if (value === undefined || value === null || value === '') return fallback
  if (value !== 'inactive' && value !== 'active') {
    throw new Error('status must be inactive or active')
  }

  return value
}

function positiveInteger(value: unknown, field: string, fallback: number) {
  if (value === undefined || value === null || value === '') return fallback
  const numeric = Number(value)
  if (!Number.isInteger(numeric) || numeric < 1 || numeric > 100000) {
    throw new Error(`${field} must be an integer between 1 and 100000`)
  }

  return numeric
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000)
}
