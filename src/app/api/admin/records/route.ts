import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@backend/config/supabase'
import { isAdminEmail } from '@/lib/admin'
import { getCurrentUser } from '@/lib/auth/server'

export const dynamic = 'force-dynamic'

const recordTypes = ['generation-logs', 'payment-audit', 'conversion-events'] as const
type AdminRecordType = (typeof recordTypes)[number]

type TableColumn = {
  key: string
  label: string
}

type AdminRecordResponse = {
  type: AdminRecordType
  title: string
  subtitle: string
  columns: TableColumn[]
  rows: Record<string, string | number | boolean | null>[]
  notes?: string[]
  pagination?: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

type ProfileRow = {
  id: string
  email: string | null
}

type GenerationRow = {
  id: string
  user_id: string
  status: string
  plan_type: string
  style_count: number | null
  credits_used: number | null
  progress: number | null
  current_step: string | null
  created_at: string
  started_at: string | null
  completed_at: string | null
  updated_at: string | null
  error_message: string | null
}

type CreditPackageRow = {
  id: string
  user_id: string
  plan_type: string
  total_credits: number
  remaining_credits: number
  purchased_at: string
  activated_at: string | null
  expires_at: string | null
  validity_days: number
  stripe_payment_id: string | null
  lemon_order_id: string | null
  paypal_order_id: string | null
  amount_paid: number | string | null
  currency: string | null
  status: string
  created_at: string
}

type ButtonClickLogRow = {
  id: string
  clicked_at: string
  button_type: string
  source: string
  user_id: string | null
  metadata: Record<string, unknown> | null
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    if (!isAdminEmail(user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const url = new URL(request.url)
    const requestedType = url.searchParams.get('type')
    const type = recordTypes.includes(requestedType as AdminRecordType)
      ? requestedType as AdminRecordType
      : null

    if (!type) {
      return NextResponse.json({ error: 'Invalid record type' }, { status: 400 })
    }

    const limit = safeLimit(url.searchParams.get('limit'))
    const page = safePage(url.searchParams.get('page'))
    const pageSize = safePageSize(url.searchParams.get('pageSize') || url.searchParams.get('limit'))
    const query = (url.searchParams.get('query') || '').trim()

    if (type === 'generation-logs') {
      return NextResponse.json(await generationRecords(page, pageSize, query || '', limit))
    }

    if (type === 'payment-audit') {
      return NextResponse.json(await paymentRecords(page, pageSize, query || '', limit))
    }

    return NextResponse.json(await conversionEventRecords(page, pageSize, query || '', limit))
  } catch (error) {
    console.error('[Admin Records] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function generationRecords(page: number, pageSize: number, query: string, fallbackLimit: number): Promise<AdminRecordResponse> {
  const { from, to } = pageRange(page, pageSize || fallbackLimit)
  let recordsQuery = supabaseAdmin
    .from('generations')
    .select('id,user_id,status,plan_type,style_count,credits_used,progress,current_step,created_at,started_at,completed_at,updated_at,error_message', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (query) {
    if (isUuid(query)) {
      recordsQuery = recordsQuery.or(`id.eq.${query},user_id.eq.${query}`)
    } else if (['pending', 'processing', 'completed', 'failed'].includes(query)) {
      recordsQuery = recordsQuery.eq('status', query)
    } else {
      recordsQuery = recordsQuery.ilike('current_step', `%${escapeLike(query)}%`)
    }
  }

  const { data, error, count } = await recordsQuery

  if (error) {
    throw error
  }

  const records = (data || []) as GenerationRow[]
  const profiles = await profilesByUserId(records.map((record) => record.user_id))

  return {
    type: 'generation-logs',
    title: 'Generation Records',
    subtitle: 'Review generation jobs, status, duration, errors, and credit usage.',
    columns: [
      { key: 'createdAt', label: 'Created' },
      { key: 'user', label: 'User' },
      { key: 'generationId', label: 'Generation ID' },
      { key: 'status', label: 'Status' },
      { key: 'plan', label: 'Plan' },
      { key: 'styleCount', label: 'Styles' },
      { key: 'creditsUsed', label: 'Credits' },
      { key: 'progress', label: 'Progress' },
      { key: 'duration', label: 'Duration' },
      { key: 'step', label: 'Step' },
      { key: 'error', label: 'Error' },
    ],
    rows: records.map((record) => ({
      createdAt: formatDateTime(record.created_at),
      user: userLabel(record.user_id, profiles),
      generationId: record.id,
      status: record.status,
      plan: record.plan_type,
      styleCount: record.style_count ?? 0,
      creditsUsed: record.credits_used ?? 0,
      progress: `${record.progress ?? 0}%`,
      duration: formatDuration(record.started_at || record.created_at, record.completed_at || record.updated_at),
      step: record.current_step || '-',
      error: record.error_message || null,
    })),
    notes: [
      'Source: generations table. Use this to investigate job state, duration, and failures.',
    ],
    pagination: makePagination(page, pageSize, count || 0),
  }
}

async function paymentRecords(page: number, pageSize: number, query: string, fallbackLimit: number): Promise<AdminRecordResponse> {
  const { from, to } = pageRange(page, pageSize || fallbackLimit)
  let packageQuery = supabaseAdmin
    .from('credit_packages')
    .select('id,user_id,plan_type,total_credits,remaining_credits,purchased_at,activated_at,expires_at,validity_days,stripe_payment_id,lemon_order_id,paypal_order_id,amount_paid,currency,status,created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (query) {
    if (isUuid(query)) {
      packageQuery = packageQuery.or(`id.eq.${query},user_id.eq.${query},stripe_payment_id.eq.${query},paypal_order_id.eq.${query},lemon_order_id.eq.${query}`)
    } else {
      const profileIds = await userIdsByEmail(query)
      if (profileIds.length > 0) {
        packageQuery = packageQuery.in('user_id', profileIds)
      } else {
        packageQuery = packageQuery.or(`stripe_payment_id.eq.${query},paypal_order_id.eq.${query},lemon_order_id.eq.${query}`)
      }
    }
  }

  const { data, error, count } = await packageQuery

  if (error) {
    throw error
  }

  const records = (data || []) as CreditPackageRow[]
  const profiles = await profilesByUserId(records.map((record) => record.user_id))

  return {
    type: 'payment-audit',
    title: 'Payment Credit Audit',
    subtitle: 'Review purchases, credit packages, balances, expiration, and payment source.',
    columns: [
      { key: 'purchasedAt', label: 'Purchased' },
      { key: 'user', label: 'User' },
      { key: 'packageId', label: 'Package ID' },
      { key: 'provider', label: 'Provider' },
      { key: 'plan', label: 'Plan' },
      { key: 'amount', label: 'Amount' },
      { key: 'status', label: 'Status' },
      { key: 'credits', label: 'Credits' },
      { key: 'validityDays', label: 'Validity' },
      { key: 'activatedAt', label: 'Activated' },
      { key: 'expiresAt', label: 'Expires' },
      { key: 'paymentId', label: 'Payment ID' },
    ],
    rows: records.map((record) => {
      const provider = paymentProvider(record)
      return {
        purchasedAt: formatDateTime(record.purchased_at || record.created_at),
        user: userLabel(record.user_id, profiles),
        userId: record.user_id,
        packageId: record.id,
        id: record.id,
        provider: provider.name,
        plan: record.plan_type,
        plan_type: record.plan_type,
        amount: formatMoney(record.amount_paid, record.currency),
        amount_paid: record.amount_paid ?? '',
        currency: record.currency || 'USD',
        status: record.status,
        total_credits: record.total_credits,
        remaining_credits: record.remaining_credits,
        credits: `${record.remaining_credits}/${record.total_credits}`,
        validityDays: record.validity_days ?? 0,
        validity_days: record.validity_days ?? 0,
        activated_at: record.activated_at || '',
        activatedAt: formatDateTime(record.activated_at),
        expires_at: record.expires_at || '',
        expiresAt: formatDateTime(record.expires_at),
        paymentId: provider.id,
      }
    }),
    notes: [
      'Source: credit_packages table. Use this to audit purchases, package state, balances, and validity.',
    ],
    pagination: makePagination(page, pageSize, count || 0),
  }
}

async function conversionEventRecords(page: number, pageSize: number, query: string, fallbackLimit: number): Promise<AdminRecordResponse> {
  const { from, to } = pageRange(page, pageSize || fallbackLimit)
  let eventsQuery = supabaseAdmin
    .from('button_click_logs')
    .select('id,clicked_at,button_type,source,user_id,metadata', { count: 'exact' })
    .order('clicked_at', { ascending: false })
    .range(from, to)

  if (query) {
    if (isUuid(query)) {
      eventsQuery = eventsQuery.or(`id.eq.${query},user_id.eq.${query}`)
    } else {
      eventsQuery = eventsQuery.or(`button_type.ilike.%${escapeLike(query)}%,source.ilike.%${escapeLike(query)}%`)
    }
  }

  const { data, error, count } = await eventsQuery

  if (error) {
    throw error
  }

  const records = (data || []) as ButtonClickLogRow[]
  const profiles = await profilesByUserId(records.map((record) => record.user_id).filter(Boolean) as string[])

  return {
    type: 'conversion-events',
    title: 'Conversion Event Records',
    subtitle: 'Review page views, CTA clicks, checkout intent, and related events.',
    columns: [
      { key: 'clickedAt', label: 'Time' },
      { key: 'event', label: 'Event' },
      { key: 'source', label: 'Source' },
      { key: 'user', label: 'User' },
      { key: 'metadata', label: 'Metadata' },
      { key: 'eventId', label: 'Event ID' },
    ],
    rows: records.map((record) => ({
      clickedAt: formatDateTime(record.clicked_at),
      event: record.button_type,
      source: record.source,
      user: record.user_id ? userLabel(record.user_id, profiles) : 'anonymous',
      metadata: metadataSummary(record.metadata),
      eventId: record.id,
    })),
    notes: [
      'Source: button_click_logs table. Page views, CTA clicks, and checkout intent are written here.',
    ],
    pagination: makePagination(page, pageSize, count || 0),
  }
}

async function profilesByUserId(userIds: string[]) {
  const ids = [...new Set(userIds.filter(Boolean))]
  const profiles = new Map<string, string>()

  if (ids.length === 0) {
    return profiles
  }

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('id,email')
    .in('id', ids)

  if (error) {
    console.error('[Admin Records] Failed to fetch profiles:', error)
    return profiles
  }

  for (const profile of (data || []) as ProfileRow[]) {
    if (profile.email) {
      profiles.set(profile.id, profile.email)
    }
  }

  return profiles
}

async function userIdsByEmail(query: string) {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .ilike('email', `%${escapeLike(query)}%`)
    .limit(50)

  if (error) {
    console.error('[Admin Records] Failed to search profiles:', error)
    return [] as string[]
  }

  return ((data || []) as { id: string }[]).map((profile) => profile.id)
}

function safeLimit(value: string | null) {
  const parsed = Number.parseInt(value || '100', 10)
  if (Number.isNaN(parsed)) {
    return 100
  }

  return Math.min(200, Math.max(1, parsed))
}

function safePage(value: string | null) {
  const parsed = Number.parseInt(value || '1', 10)
  if (Number.isNaN(parsed)) return 1
  return Math.max(1, parsed)
}

function safePageSize(value: string | null) {
  const parsed = Number.parseInt(value || '20', 10)
  if (Number.isNaN(parsed)) return 20
  return Math.min(100, Math.max(5, parsed))
}

function pageRange(page: number, pageSize: number) {
  const from = (page - 1) * pageSize
  return { from, to: from + pageSize - 1 }
}

function makePagination(page: number, pageSize: number, total: number) {
  return {
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  }
}

function userLabel(userId: string, profiles: Map<string, string>) {
  return profiles.get(userId) || userId
}

function formatDateTime(value: string | null | undefined) {
  if (!value) {
    return '-'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date)
}

function formatDuration(start: string | null | undefined, end: string | null | undefined) {
  if (!start || !end) {
    return '-'
  }

  const startMs = new Date(start).getTime()
  const endMs = new Date(end).getTime()
  if (Number.isNaN(startMs) || Number.isNaN(endMs) || endMs < startMs) {
    return '-'
  }

  const totalSeconds = Math.round((endMs - startMs) / 1000)
  if (totalSeconds < 60) {
    return `${totalSeconds}s`
  }

  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}m ${seconds}s`
}

function paymentProvider(record: CreditPackageRow) {
  if (record.stripe_payment_id) {
    return { name: 'Stripe', id: record.stripe_payment_id }
  }

  if (record.paypal_order_id) {
    return { name: 'PayPal', id: record.paypal_order_id }
  }

  if (record.lemon_order_id) {
    return { name: 'Lemon', id: record.lemon_order_id }
  }

  return { name: 'Unknown', id: '-' }
}

function formatMoney(amount: number | string | null, currency: string | null) {
  if (amount === null || amount === undefined || amount === '') {
    return '-'
  }

  const numericAmount = typeof amount === 'number' ? amount : Number.parseFloat(amount)
  if (Number.isNaN(numericAmount)) {
    return `${amount} ${currency || ''}`.trim()
  }

  return `${numericAmount.toFixed(2)} ${currency || 'USD'}`
}

function metadataSummary(metadata: Record<string, unknown> | null) {
  if (!metadata || Object.keys(metadata).length === 0) {
    return '-'
  }

  return JSON.stringify(metadata)
}

function escapeLike(value: string) {
  return value.replaceAll('%', '\\%').replaceAll('_', '\\_')
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}
