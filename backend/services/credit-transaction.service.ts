import { supabaseAdmin } from '@backend/config/supabase'

export type CreditTransactionType =
  | 'credit_added'
  | 'credit_used'
  | 'credit_refunded'
  | 'credit_expired'
  | 'manual_adjustment'
  | 'package_renewed'

export type CreditTransactionInput = {
  userId: string
  creditPackageId?: string | null
  generationId?: string | null
  transactionType: CreditTransactionType
  amountDelta: number
  balanceAfter?: number | null
  packageRemainingAfter?: number | null
  description?: string
  source?: string
  sourceKey?: string | null
  metadata?: Record<string, unknown>
  occurredAt?: string
}

export type CreditTransactionRow = {
  id: string
  user_id: string
  credit_package_id: string | null
  generation_id: string | null
  transaction_type: CreditTransactionType
  amount_delta: number
  balance_after: number | null
  package_remaining_after: number | null
  description: string | null
  source: string
  source_key: string | null
  metadata: Record<string, unknown> | null
  occurred_at: string
  created_at: string
}

type ListOptions = {
  query?: string
  page: number
  pageSize: number
}

export class CreditTransactionService {
  static async record(input: CreditTransactionInput): Promise<void> {
    if (!input.userId || !Number.isInteger(input.amountDelta)) return

    const payload = {
      user_id: input.userId,
      credit_package_id: input.creditPackageId || null,
      generation_id: input.generationId || null,
      transaction_type: input.transactionType,
      amount_delta: input.amountDelta,
      balance_after: input.balanceAfter ?? null,
      package_remaining_after: input.packageRemainingAfter ?? null,
      description: input.description || null,
      source: input.source || 'system',
      source_key: input.sourceKey || null,
      metadata: input.metadata || {},
      occurred_at: input.occurredAt || new Date().toISOString(),
    }

    const request = input.sourceKey
      ? supabaseAdmin
        .from('credit_transactions')
        .upsert(payload, { onConflict: 'source_key', ignoreDuplicates: true })
      : supabaseAdmin
        .from('credit_transactions')
        .insert(payload)

    const { error } = await request

    if (error) {
      if (isMissingTableError(error)) {
        console.warn('[CreditTransaction] credit_transactions table is not available yet.')
        return
      }

      console.error('[CreditTransaction] Failed to record transaction:', error)
    }
  }

  static async listForUser(userId: string, options: ListOptions) {
    const { from, to } = pageRange(options.page, options.pageSize)
    let query = supabaseAdmin
      .from('credit_transactions')
      .select('id,user_id,credit_package_id,generation_id,transaction_type,amount_delta,balance_after,package_remaining_after,description,source,source_key,metadata,occurred_at,created_at', { count: 'exact' })
      .eq('user_id', userId)
      .order('occurred_at', { ascending: false })
      .range(from, to)

    const search = options.query?.trim()
    if (search) {
      if (isUuid(search)) {
        query = query.or(`id.eq.${search},credit_package_id.eq.${search},generation_id.eq.${search}`)
      } else {
        const escaped = escapeLike(search)
        query = query.or(`transaction_type.ilike.%${escaped}%,description.ilike.%${escaped}%,source.ilike.%${escaped}%`)
      }
    }

    const { data, error, count } = await query
    if (error) {
      if (isMissingTableError(error)) {
        return { rows: null, count: 0, missingTable: true }
      }

      throw error
    }

    return {
      rows: (data || []) as CreditTransactionRow[],
      count: count || 0,
      missingTable: false,
    }
  }
}

function pageRange(page: number, pageSize: number) {
  const from = (page - 1) * pageSize
  return { from, to: from + pageSize - 1 }
}

function escapeLike(value: string) {
  return value.replaceAll('%', '\\%').replaceAll('_', '\\_')
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

function isMissingTableError(error: { code?: string; message?: string }) {
  return error.code === '42P01' || Boolean(error.message?.includes('credit_transactions'))
}
