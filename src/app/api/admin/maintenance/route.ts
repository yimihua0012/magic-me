import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@backend/config/supabase'
import { isAdminEmail } from '@/lib/admin'
import { getCurrentUser } from '@/lib/auth/server'

export const dynamic = 'force-dynamic'

const maintenanceTypes = ['styles', 'users', 'generations', 'orders'] as const
type MaintenanceType = (typeof maintenanceTypes)[number]

type ProfileRow = {
  id: string
  email: string | null
  full_name: string | null
  created_at: string | null
  last_login_at: string | null
}

type CreditPackageRow = {
  id: string
  user_id: string
  plan_type: string
  total_credits: number
  remaining_credits: number
  status: string
  purchased_at: string
  activated_at: string | null
  expires_at: string | null
  stripe_payment_id: string | null
  lemon_order_id: string | null
  paypal_order_id: string | null
  amount_paid: number | string | null
  currency: string | null
  validity_days?: number | null
  created_at: string
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
  completed_at: string | null
  error_message: string | null
}

type Pagination = {
  page: number
  pageSize: number
  total: number
  totalPages: number
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
    const type = maintenanceTypes.includes(requestedType as MaintenanceType)
      ? requestedType as MaintenanceType
      : null
    const query = (url.searchParams.get('query') || '').trim()
    const page = safePage(url.searchParams.get('page'))
    const pageSize = safePageSize(url.searchParams.get('pageSize'))

    if (!type) {
      return NextResponse.json({ error: 'Invalid maintenance type' }, { status: 400 })
    }

    if (type === 'styles') return NextResponse.json(await styleMaintenance())
    if (type === 'users') return NextResponse.json(await userCreditMaintenance(query, page, pageSize))
    if (type === 'generations') return NextResponse.json(await generationMaintenance(query, page, pageSize))
    return NextResponse.json(await orderMaintenance(query, page, pageSize))
  } catch (error) {
    console.error('[Admin Maintenance] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function styleMaintenance() {
  const { data, error } = await supabaseAdmin
    .from('headshot_styles')
    .select('id,name,category,prompt,negative,is_active,category_order,style_order,selection_count,last_selected_at,localized_names,localized_category_labels,updated_at')
    .order('category_order', { ascending: true })
    .order('style_order', { ascending: true })

  if (error) throw error

  return {
    type: 'styles',
    title: 'Style Maintenance',
    subtitle: 'Edit style names, prompts, ordering, localization JSON, and active status.',
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'category', label: 'Category' },
      { key: 'is_active', label: 'Active' },
      { key: 'category_order', label: 'Cat Order' },
      { key: 'style_order', label: 'Style Order' },
      { key: 'selection_count', label: 'Selections' },
      { key: 'last_selected_at', label: 'Last Selected' },
      { key: 'prompt', label: 'Prompt' },
      { key: 'negative', label: 'Negative' },
    ],
    rows: (data || []).map((row) => ({
      ...row,
      localized_names: JSON.stringify(row.localized_names || {}),
      localized_category_labels: JSON.stringify(row.localized_category_labels || {}),
      last_selected_at: formatDateTime(row.last_selected_at),
    })),
  }
}

async function userCreditMaintenance(query: string, page: number, pageSize: number) {
  const { from, to } = pageRange(page, pageSize)
  let profileQuery = supabaseAdmin
    .from('profiles')
    .select('id,email,full_name,plan_type,email_verified,created_at,last_login_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (query) {
    if (isUuid(query)) {
      profileQuery = profileQuery.or(`email.ilike.%${escapeLike(query)}%,id.eq.${query}`)
    } else {
      profileQuery = profileQuery.ilike('email', `%${escapeLike(query)}%`)
    }
  }

  const { data, error, count } = await profileQuery
  if (error) throw error

  const profiles = (data || []) as (ProfileRow & { plan_type?: string | null; email_verified?: boolean | null })[]
  const packages = await packagesForUsers(profiles.map((profile) => profile.id))
  const pagination = makePagination(page, pageSize, count || 0)

  return {
    type: 'users',
    title: 'User Credits',
    subtitle: 'Search users and review their credit package state and remaining balance.',
    columns: [
      { key: 'email', label: 'Email' },
      { key: 'userId', label: 'User ID' },
      { key: 'name', label: 'Name' },
      { key: 'planType', label: 'Plan' },
      { key: 'emailVerified', label: 'Verified' },
      { key: 'remainingCredits', label: 'Remaining' },
      { key: 'totalCredits', label: 'Total' },
      { key: 'packages', label: 'Packages' },
      { key: 'activePackages', label: 'Active' },
      { key: 'createdAt', label: 'Created' },
      { key: 'lastLoginAt', label: 'Last Login' },
    ],
    rows: profiles.map((profile) => {
      const userPackages = packages.filter((pkg) => pkg.user_id === profile.id)
      return {
        email: profile.email || '-',
        userId: profile.id,
        id: profile.id,
        name: profile.full_name || '-',
        full_name: profile.full_name || '',
        planType: profile.plan_type || '-',
        email_verified: Boolean(profile.email_verified),
        emailVerified: profile.email_verified ? 'yes' : 'no',
        remainingCredits: userPackages.reduce((sum, pkg) => sum + (pkg.remaining_credits || 0), 0),
        totalCredits: userPackages.reduce((sum, pkg) => sum + (pkg.total_credits || 0), 0),
        packages: userPackages.length,
        activePackages: userPackages.filter((pkg) => pkg.status === 'active' || pkg.status === 'inactive').length,
        createdAt: formatDateTime(profile.created_at),
        lastLoginAt: formatDateTime(profile.last_login_at),
      }
    }),
    pagination,
  }
}

async function generationMaintenance(query: string, page: number, pageSize: number) {
  const { from, to } = pageRange(page, pageSize)
  let generationQuery = supabaseAdmin
    .from('generations')
    .select('id,user_id,status,plan_type,style_count,credits_used,progress,current_step,created_at,completed_at,error_message', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (query) {
    if (isUuid(query)) {
      generationQuery = generationQuery.or(`id.eq.${query},user_id.eq.${query}`)
    } else if (['processing', 'completed', 'failed'].includes(query)) {
      generationQuery = generationQuery.eq('status', query)
    } else {
      generationQuery = generationQuery.ilike('current_step', `%${escapeLike(query)}%`)
    }
  }

  const { data, error, count } = await generationQuery
  if (error) throw error

  const records = (data || []) as GenerationRow[]
  const profiles = await profilesByUserId(records.map((record) => record.user_id))
  const pagination = makePagination(page, pageSize, count || 0)

  return {
    type: 'generations',
    title: 'Generation Tasks',
    subtitle: 'Review generation tasks, progress, errors, and credit usage.',
    columns: [
      { key: 'createdAt', label: 'Created' },
      { key: 'generationId', label: 'Generation ID' },
      { key: 'user', label: 'User' },
      { key: 'status', label: 'Status' },
      { key: 'progress', label: 'Progress' },
      { key: 'plan', label: 'Plan' },
      { key: 'styles', label: 'Styles' },
      { key: 'creditsUsed', label: 'Credits' },
      { key: 'step', label: 'Step' },
      { key: 'error', label: 'Error' },
    ],
    rows: records.map((record) => ({
      createdAt: formatDateTime(record.created_at),
      generationId: record.id,
      user: profiles.get(record.user_id) || record.user_id,
      status: record.status,
      progress: `${record.progress ?? 0}%`,
      plan: record.plan_type,
      styles: record.style_count ?? 0,
      creditsUsed: record.credits_used ?? 0,
      step: record.current_step || '-',
      error: record.error_message || '-',
    })),
    pagination,
  }
}

async function orderMaintenance(query: string, page: number, pageSize: number) {
  const { from, to } = pageRange(page, pageSize)
  let packageQuery = supabaseAdmin
    .from('credit_packages')
    .select('id,user_id,plan_type,total_credits,remaining_credits,status,purchased_at,activated_at,expires_at,validity_days,stripe_payment_id,lemon_order_id,paypal_order_id,amount_paid,currency,created_at', { count: 'exact' })
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
  if (error) throw error

  const records = (data || []) as CreditPackageRow[]
  const profiles = await profilesByUserId(records.map((record) => record.user_id))
  const pagination = makePagination(page, pageSize, count || 0)

  return {
    type: 'orders',
    title: 'Orders Payments',
    subtitle: 'Review payment-linked credit packages and provider references.',
    columns: [
      { key: 'purchasedAt', label: 'Purchased' },
      { key: 'user', label: 'User' },
      { key: 'packageId', label: 'Package ID' },
      { key: 'provider', label: 'Provider' },
      { key: 'paymentId', label: 'Payment ID' },
      { key: 'plan', label: 'Plan' },
      { key: 'amount', label: 'Amount' },
      { key: 'status', label: 'Status' },
      { key: 'credits', label: 'Credits' },
      { key: 'validityDays', label: 'Validity' },
      { key: 'expiresAt', label: 'Expires' },
    ],
    rows: records.map((record) => {
      const provider = paymentProvider(record)
      return {
        purchasedAt: formatDateTime(record.purchased_at || record.created_at),
        user: profiles.get(record.user_id) || record.user_id,
        userId: record.user_id,
        packageId: record.id,
        id: record.id,
        provider: provider.name,
        paymentId: provider.id,
        plan: record.plan_type,
        plan_type: record.plan_type,
        amount: formatMoney(record.amount_paid, record.currency),
        amount_paid: record.amount_paid ?? '',
        currency: record.currency || 'USD',
        status: record.status,
        total_credits: record.total_credits,
        remaining_credits: record.remaining_credits,
        credits: `${record.remaining_credits}/${record.total_credits}`,
        validityDays: record.validity_days ?? '-',
        validity_days: record.validity_days ?? 0,
        activated_at: record.activated_at || '',
        expires_at: record.expires_at || '',
        expiresAt: formatDateTime(record.expires_at),
      }
    }),
    pagination,
  }
}

async function packagesForUsers(userIds: string[]) {
  const ids = [...new Set(userIds.filter(Boolean))]
  if (ids.length === 0) return [] as CreditPackageRow[]

  const { data, error } = await supabaseAdmin
    .from('credit_packages')
    .select('id,user_id,plan_type,total_credits,remaining_credits,status,purchased_at,activated_at,expires_at,stripe_payment_id,lemon_order_id,paypal_order_id,amount_paid,currency,created_at')
    .in('user_id', ids)

  if (error) {
    console.error('[Admin Maintenance] Failed to fetch credit packages:', error)
    return [] as CreditPackageRow[]
  }

  return (data || []) as CreditPackageRow[]
}

async function userIdsByEmail(query: string) {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .ilike('email', `%${escapeLike(query)}%`)
    .limit(50)

  if (error) {
    console.error('[Admin Maintenance] Failed to search profiles:', error)
    return [] as string[]
  }

  return ((data || []) as { id: string }[]).map((profile) => profile.id)
}

async function profilesByUserId(userIds: string[]) {
  const ids = [...new Set(userIds.filter(Boolean))]
  const profiles = new Map<string, string>()

  if (ids.length === 0) return profiles

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('id,email')
    .in('id', ids)

  if (error) {
    console.error('[Admin Maintenance] Failed to fetch profiles:', error)
    return profiles
  }

  ;((data || []) as { id: string; email: string | null }[]).forEach((profile) => {
    if (profile.email) profiles.set(profile.id, profile.email)
  })

  return profiles
}

function paymentProvider(record: CreditPackageRow) {
  if (record.stripe_payment_id) return { name: 'Stripe', id: record.stripe_payment_id }
  if (record.paypal_order_id) return { name: 'PayPal', id: record.paypal_order_id }
  if (record.lemon_order_id) return { name: 'Lemon', id: record.lemon_order_id }
  return { name: 'Manual/Unknown', id: '-' }
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

function escapeLike(value: string) {
  return value.replaceAll('%', '\\%').replaceAll('_', '\\_')
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
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
