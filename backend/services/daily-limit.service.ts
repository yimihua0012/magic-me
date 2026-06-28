import { supabaseAdmin } from '@backend/config/supabase'

type DailyLimitScope = 'generation' | 'credit_package'

interface DailyLimitConfig {
  scope: DailyLimitScope
  table: 'generations' | 'credit_packages'
  timestampColumn: 'created_at' | 'purchased_at'
  defaultLimit: number
  envName: string
}

interface DailyLimitStatus {
  limit: number
  used: number
  remaining: number
  resetAt: string
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

const LIMITS: Record<DailyLimitScope, DailyLimitConfig> = {
  generation: {
    scope: 'generation',
    table: 'generations',
    timestampColumn: 'created_at',
    defaultLimit: 20,
    envName: 'DAILY_GENERATION_LIMIT_PER_USER',
  },
  credit_package: {
    scope: 'credit_package',
    table: 'credit_packages',
    timestampColumn: 'purchased_at',
    defaultLimit: 10,
    envName: 'DAILY_CREDIT_PACKAGE_LIMIT_PER_USER',
  },
}

export class DailyLimitError extends Error {
  readonly scope: DailyLimitScope
  readonly limit: number
  readonly used: number
  readonly resetAt: string

  constructor(scope: DailyLimitScope, status: DailyLimitStatus) {
    super(
      scope === 'generation'
        ? `Daily generation limit reached (${status.used}/${status.limit}).`
        : `Daily credit package limit reached (${status.used}/${status.limit}).`
    )
    this.name = 'DailyLimitError'
    this.scope = scope
    this.limit = status.limit
    this.used = status.used
    this.resetAt = status.resetAt
  }
}

export function isDailyLimitError(error: unknown): error is DailyLimitError {
  return error instanceof DailyLimitError || (
    Boolean(error) &&
    typeof error === 'object' &&
    (error as { name?: string }).name === 'DailyLimitError'
  )
}

function configuredLimit(config: DailyLimitConfig) {
  const raw = process.env[config.envName]

  if (raw === undefined || raw.trim() === '') {
    return config.defaultLimit
  }

  const parsed = Number.parseInt(raw, 10)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : config.defaultLimit
}

function currentUtcDayWindow(now = new Date()) {
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const resetAt = new Date(start.getTime() + MS_PER_DAY)

  return {
    startAt: start.toISOString(),
    resetAt: resetAt.toISOString(),
  }
}

export class DailyLimitService {
  static async getStatus(scope: DailyLimitScope, userId: string): Promise<DailyLimitStatus> {
    const config = LIMITS[scope]
    const limit = configuredLimit(config)
    const { startAt, resetAt } = currentUtcDayWindow()

    if (limit === 0) {
      return {
        limit,
        used: 0,
        remaining: Number.MAX_SAFE_INTEGER,
        resetAt,
      }
    }

    const { count, error } = await supabaseAdmin
      .from(config.table)
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte(config.timestampColumn, startAt)

    if (error) {
      console.error(`[DailyLimit] Failed to count ${config.scope} usage:`, error)
      throw error
    }

    const used = count || 0

    return {
      limit,
      used,
      remaining: Math.max(0, limit - used),
      resetAt,
    }
  }

  static async enforce(scope: DailyLimitScope, userId: string): Promise<DailyLimitStatus> {
    const status = await this.getStatus(scope, userId)

    if (status.limit > 0 && status.used >= status.limit) {
      throw new DailyLimitError(scope, status)
    }

    return status
  }

  static enforceGeneration(userId: string) {
    return this.enforce('generation', userId)
  }

  static enforceCreditPackage(userId: string) {
    return this.enforce('credit_package', userId)
  }
}
