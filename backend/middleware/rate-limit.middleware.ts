import { NextRequest, NextResponse } from 'next/server'
import { RateLimitError } from '../utils/errors'
import { logger } from '../utils/logger'

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
}

const rateLimits: Map<string, { count: number; resetTime: number }> = new Map()

export function rateLimit(config: RateLimitConfig) {
  return async (req: NextRequest): Promise<void> => {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const key = `rate_limit:${ip}`
    const now = Date.now()

    let entry = rateLimits.get(key)

    if (!entry || now > entry.resetTime) {
      entry = {
        count: 0,
        resetTime: now + config.windowMs,
      }
      rateLimits.set(key, entry)
    }

    entry.count++

    if (entry.count > config.maxRequests) {
      logger.warn('Rate limit exceeded', { ip, count: entry.count })
      throw new RateLimitError(
        'Too many requests, please try again later',
        Math.ceil((entry.resetTime - now) / 1000)
      )
    }

    // Cleanup old entries
    if (rateLimits.size > 10000) {
      for (const [k, v] of rateLimits.entries()) {
        if (now > v.resetTime) {
          rateLimits.delete(k)
        }
      }
    }
  }
}

// Preset rate limits
export const limits = {
  // 100 requests per minute per IP
  standard: rateLimit({
    windowMs: 60 * 1000,
    maxRequests: 100,
  }),

  // 10 requests per minute per IP (for sensitive operations)
  strict: rateLimit({
    windowMs: 60 * 1000,
    maxRequests: 10,
  }),

  // 5 requests per hour per IP (for auth operations)
  auth: rateLimit({
    windowMs: 60 * 60 * 1000,
    maxRequests: 5,
  }),
}
