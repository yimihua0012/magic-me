import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@backend/config/supabase'
import type { CreditPackage } from '@backend/types'
import { getBearerUser } from '@/lib/auth/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const user = await getBearerUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const now = new Date().toISOString()
    const { data, error } = await supabaseAdmin
      .from('credit_packages')
      .select('id,user_id,plan_type,total_credits,remaining_credits,purchased_at,activated_at,expires_at,validity_days,status,created_at,updated_at')
      .eq('user_id', user.id)
      .in('status', ['inactive', 'active'])
      .gt('remaining_credits', 0)
      .or(`status.eq.inactive,and(status.eq.active,expires_at.gt.${now})`)
      .order('expires_at', { ascending: true, nullsFirst: true })

    if (error) {
      console.error('[Credits] Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch credits' }, { status: 500 })
    }

    const packages = (data || []) as CreditPackage[]
    const totalRemaining = packages.reduce((sum, pkg) => sum + pkg.remaining_credits, 0)
    const nearestExpiresAt = packages
      .filter((pkg) => pkg.status === 'active' && pkg.expires_at)
      .sort((a, b) => new Date(a.expires_at!).getTime() - new Date(b.expires_at!).getTime())[0]?.expires_at

    return NextResponse.json(
      {
        availableCredits: totalRemaining,
        nearestExpiresAt: nearestExpiresAt || null,
        packages,
      },
      {
        headers: {
          'Cache-Control': 'private, max-age=10, stale-while-revalidate=30',
        },
      }
    )
  } catch (error) {
    console.error('[Credits] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
