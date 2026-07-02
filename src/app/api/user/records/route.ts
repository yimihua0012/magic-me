import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@backend/config/supabase'
import { CreditTransactionService, type CreditTransactionRow } from '@backend/services/credit-transaction.service'
import { getCurrentUser } from '@/lib/auth/server'

export const dynamic = 'force-dynamic'

const recordTypes = ['ledger', 'orders', 'generations', 'packages'] as const
type UserRecordType = (typeof recordTypes)[number]

type TableColumn = {
  key: string
  label: string
}

type Pagination = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

type UserRecordResponse = {
  type: UserRecordType
  title: string
  subtitle: string
  columns: TableColumn[]
  rows: Record<string, string | number | null>[]
  pagination: Pagination
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
  updated_at: string | null
}

type GenerationRow = {
  id: string
  status: string
  plan_type: string
  style_count: number | null
  credits_used: number | null
  progress: number | null
  current_step: string | null
  created_at: string
  completed_at: string | null
  updated_at: string | null
  error_message: string | null
}

type LedgerRow = {
  eventAtRaw: string
  eventAt: string
  type: string
  description: string
  delta: string
  status: string
  reference: string
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const url = new URL(request.url)
    const requestedType = url.searchParams.get('type')
    const type = recordTypes.includes(requestedType as UserRecordType)
      ? requestedType as UserRecordType
      : 'ledger'
    const query = (url.searchParams.get('query') || '').trim()
    const page = safePage(url.searchParams.get('page'))
    const pageSize = safePageSize(url.searchParams.get('pageSize'))

    if (type === 'orders') return NextResponse.json(await orderRecords(user.id, query, page, pageSize))
    if (type === 'generations') return NextResponse.json(await generationRecords(user.id, query, page, pageSize))
    if (type === 'packages') return NextResponse.json(await packageRecords(user.id, query, page, pageSize))
    return NextResponse.json(await ledgerRecords(user.id, query, page, pageSize))
  } catch (error) {
    console.error('[User Records] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function ledgerRecords(userId: string, query: string, page: number, pageSize: number): Promise<UserRecordResponse> {
  const transactions = await CreditTransactionService.listForUser(userId, { query, page, pageSize })
  if (!transactions.missingTable && transactions.rows) {
    return {
      type: 'ledger',
      title: 'Credit Ledger',
      subtitle: 'A read-only timeline of credit additions, usage, refunds, expirations, and admin adjustments.',
      columns: [
        { key: 'eventAt', label: 'Time' },
        { key: 'type', label: 'Type' },
        { key: 'description', label: 'Description' },
        { key: 'delta', label: 'Credits' },
        { key: 'source', label: 'Source' },
        { key: 'reference', label: 'Reference' },
      ],
      rows: transactions.rows.map(transactionRow),
      pagination: makePagination(page, pageSize, transactions.count),
    }
  }

  const [{ data: packages, error: packageError }, { data: generations, error: generationError }] = await Promise.all([
    supabaseAdmin
      .from('credit_packages')
      .select('id,user_id,plan_type,total_credits,remaining_credits,purchased_at,activated_at,expires_at,validity_days,stripe_payment_id,lemon_order_id,paypal_order_id,amount_paid,currency,status,created_at,updated_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(300),
    supabaseAdmin
      .from('generations')
      .select('id,status,plan_type,style_count,credits_used,progress,current_step,created_at,completed_at,updated_at,error_message')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(300),
  ])

  if (packageError || generationError) throw packageError || generationError

  const rows: LedgerRow[] = []

  for (const pkg of (packages || []) as CreditPackageRow[]) {
    rows.push({
      eventAtRaw: pkg.purchased_at || pkg.created_at,
      eventAt: formatDateTime(pkg.purchased_at || pkg.created_at),
      type: 'Credit Added',
      description: `${titleCase(pkg.plan_type)} package`,
      delta: `+${pkg.total_credits}`,
      status: pkg.status,
      reference: pkg.id,
    })

    if (pkg.status === 'expired' && pkg.remaining_credits > 0 && pkg.expires_at) {
      rows.push({
        eventAtRaw: pkg.expires_at,
        eventAt: formatDateTime(pkg.expires_at),
        type: 'Credit Expired',
        description: `${titleCase(pkg.plan_type)} package expired`,
        delta: `-${pkg.remaining_credits}`,
        status: pkg.status,
        reference: pkg.id,
      })
    }
  }

  for (const generation of (generations || []) as GenerationRow[]) {
    const credits = generation.credits_used ?? generation.style_count ?? 0
    rows.push({
      eventAtRaw: generation.completed_at || generation.updated_at || generation.created_at,
      eventAt: formatDateTime(generation.completed_at || generation.updated_at || generation.created_at),
      type: 'Generation Used',
      description: `${generation.style_count ?? 0} styles generated`,
      delta: credits > 0 ? `-${credits}` : '0',
      status: generation.status,
      reference: generation.id,
    })
  }

  const filteredRows = filterRows(rows, query, ['type', 'description', 'status', 'reference'])
    .sort((a, b) => new Date(b.eventAtRaw).getTime() - new Date(a.eventAtRaw).getTime())

  const pagedRows = slicePage(filteredRows, page, pageSize)

  return {
    type: 'ledger',
    title: 'Credit Ledger',
    subtitle: 'A read-only timeline of credit additions, usage, and expirations.',
    columns: [
      { key: 'eventAt', label: 'Time' },
      { key: 'type', label: 'Type' },
      { key: 'description', label: 'Description' },
      { key: 'delta', label: 'Credits' },
      { key: 'status', label: 'Status' },
      { key: 'reference', label: 'Reference' },
    ],
    rows: pagedRows.map(({ eventAtRaw: _eventAtRaw, ...row }) => row),
    pagination: makePagination(page, pageSize, filteredRows.length),
  }
}

function transactionRow(record: CreditTransactionRow) {
  return {
    eventAt: formatDateTime(record.occurred_at),
    type: transactionTypeLabel(record.transaction_type),
    description: record.description || '-',
    delta: record.amount_delta > 0 ? `+${record.amount_delta}` : String(record.amount_delta),
    source: record.source,
    reference: record.generation_id || record.credit_package_id || record.id,
  }
}

function transactionTypeLabel(value: string) {
  return value
    .replace(/^credit_/, 'Credit ')
    .replace('package_', 'Package ')
    .replace('manual_', 'Manual ')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

async function orderRecords(userId: string, query: string, page: number, pageSize: number): Promise<UserRecordResponse> {
  const { from, to } = pageRange(page, pageSize)
  let packageQuery = supabaseAdmin
    .from('credit_packages')
    .select('id,user_id,plan_type,total_credits,remaining_credits,purchased_at,activated_at,expires_at,validity_days,stripe_payment_id,lemon_order_id,paypal_order_id,amount_paid,currency,status,created_at,updated_at', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (query) {
    packageQuery = packageQuery.eq('id', query)
  }

  const { data, error, count } = await packageQuery
  if (error) throw error

  return {
    type: 'orders',
    title: 'Order Records',
    subtitle: 'Payments and manual credit packages attached to your account.',
    columns: [
      { key: 'purchasedAt', label: 'Purchased' },
      { key: 'plan', label: 'Plan' },
      { key: 'amount', label: 'Amount' },
      { key: 'provider', label: 'Provider' },
      { key: 'status', label: 'Status' },
      { key: 'credits', label: 'Credits' },
      { key: 'expiresAt', label: 'Expires' },
    ],
    rows: ((data || []) as CreditPackageRow[]).map((record) => {
      const provider = paymentProvider(record)
      return {
        purchasedAt: formatDateTime(record.purchased_at || record.created_at),
        plan: titleCase(record.plan_type),
        amount: formatMoney(record.amount_paid, record.currency),
        provider: provider.name,
        status: record.status,
        credits: `${record.remaining_credits}/${record.total_credits}`,
        expiresAt: formatDateTime(record.expires_at),
      }
    }),
    pagination: makePagination(page, pageSize, count || 0),
  }
}

async function generationRecords(userId: string, query: string, page: number, pageSize: number): Promise<UserRecordResponse> {
  const { from, to } = pageRange(page, pageSize)
  let generationQuery = supabaseAdmin
    .from('generations')
    .select('id,status,plan_type,style_count,credits_used,progress,current_step,created_at,completed_at,updated_at,error_message', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (query) {
    if (isUuid(query)) {
      generationQuery = generationQuery.eq('id', query)
    } else if (['pending', 'processing', 'completed', 'failed'].includes(query.toLowerCase())) {
      generationQuery = generationQuery.eq('status', query.toLowerCase())
    } else {
      generationQuery = generationQuery.ilike('current_step', `%${escapeLike(query)}%`)
    }
  }

  const { data, error, count } = await generationQuery
  if (error) throw error

  return {
    type: 'generations',
    title: 'Generation Records',
    subtitle: 'Every generation task, status, credit use, and result reference.',
    columns: [
      { key: 'createdAt', label: 'Created' },
      { key: 'generationId', label: 'Generation ID' },
      { key: 'status', label: 'Status' },
      { key: 'progress', label: 'Progress' },
      { key: 'styles', label: 'Styles' },
      { key: 'creditsUsed', label: 'Credits' },
      { key: 'step', label: 'Step' },
      { key: 'completedAt', label: 'Completed' },
      { key: 'error', label: 'Error' },
    ],
    rows: ((data || []) as GenerationRow[]).map((record) => ({
      createdAt: formatDateTime(record.created_at),
      generationId: record.id,
      status: record.status,
      progress: `${record.progress ?? 0}%`,
      styles: record.style_count ?? 0,
      creditsUsed: record.credits_used ?? 0,
      step: record.current_step || '-',
      completedAt: formatDateTime(record.completed_at),
      error: record.error_message || '-',
    })),
    pagination: makePagination(page, pageSize, count || 0),
  }
}

async function packageRecords(userId: string, query: string, page: number, pageSize: number): Promise<UserRecordResponse> {
  const { from, to } = pageRange(page, pageSize)
  let packageQuery = supabaseAdmin
    .from('credit_packages')
    .select('id,user_id,plan_type,total_credits,remaining_credits,purchased_at,activated_at,expires_at,validity_days,stripe_payment_id,lemon_order_id,paypal_order_id,amount_paid,currency,status,created_at,updated_at', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (query) {
    if (isUuid(query)) {
      packageQuery = packageQuery.eq('id', query)
    } else {
      packageQuery = packageQuery.eq('status', query.toLowerCase())
    }
  }

  const { data, error, count } = await packageQuery
  if (error) throw error

  return {
    type: 'packages',
    title: 'Credit Packages',
    subtitle: 'All credit packages, including active, inactive, expired, and depleted packages.',
    columns: [
      { key: 'createdAt', label: 'Created' },
      { key: 'packageId', label: 'Package ID' },
      { key: 'plan', label: 'Plan' },
      { key: 'status', label: 'Status' },
      { key: 'remaining', label: 'Remaining' },
      { key: 'total', label: 'Total' },
      { key: 'validityDays', label: 'Validity' },
      { key: 'activatedAt', label: 'Activated' },
      { key: 'expiresAt', label: 'Expires' },
    ],
    rows: ((data || []) as CreditPackageRow[]).map((record) => ({
      createdAt: formatDateTime(record.created_at),
      packageId: record.id,
      plan: titleCase(record.plan_type),
      status: record.status,
      remaining: record.remaining_credits,
      total: record.total_credits,
      validityDays: record.validity_days,
      activatedAt: formatDateTime(record.activated_at),
      expiresAt: formatDateTime(record.expires_at),
    })),
    pagination: makePagination(page, pageSize, count || 0),
  }
}

function filterRows<T extends Record<string, string>>(rows: T[], query: string, fields: (keyof T)[]) {
  if (!query) return rows
  const normalizedQuery = query.toLowerCase()
  return rows.filter((row) => fields.some((field) => String(row[field] || '').toLowerCase().includes(normalizedQuery)))
}

function slicePage<T>(rows: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize
  return rows.slice(start, start + pageSize)
}

function paymentProvider(record: CreditPackageRow) {
  if (record.stripe_payment_id) return { name: 'Stripe', id: record.stripe_payment_id }
  if (record.paypal_order_id) return { name: 'PayPal', id: record.paypal_order_id }
  if (record.lemon_order_id) return { name: 'Lemon', id: record.lemon_order_id }
  return { name: 'Manual/Unknown', id: record.id }
}

function formatMoney(amount: number | string | null, currency: string | null) {
  if (amount === null || amount === undefined || amount === '') return '-'
  const numericAmount = typeof amount === 'number' ? amount : Number.parseFloat(amount)
  if (Number.isNaN(numericAmount)) return `${amount} ${currency || ''}`.trim()
  return `${numericAmount.toFixed(2)} ${currency || 'USD'}`
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
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

function titleCase(value: string) {
  return value.replace(/(^|[-_\s])([a-z])/g, (_match, prefix: string, letter: string) => `${prefix}${letter.toUpperCase()}`)
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

function makePagination(page: number, pageSize: number, total: number): Pagination {
  return {
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  }
}

function escapeLike(value: string) {
  return value.replaceAll('%', '\\%').replaceAll('_', '\\_')
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}
