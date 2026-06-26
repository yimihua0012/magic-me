import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@backend/config/supabase'
import { headers } from 'next/headers'
import { CreditPackageService } from '@backend/services'

export const dynamic = 'force-dynamic'

async function getCurrentUser() {
  const headersList = await headers()
  const authHeader = headersList.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    try {
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
      if (!error && user) {
        return user
      }
    } catch (e) {
      console.error('[Credits] Error verifying bearer token:', e)
    }
  }
  return null
}

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // 使用 CreditPackageService 获取用户信用包信息
    const summary = await CreditPackageService.getTotalRemaining(user.id)

    return NextResponse.json({
      availableCredits: summary.totalRemaining,
      nearestExpiresAt: summary.nearestExpiresAt,
      packages: summary.packages,
    })
  } catch (error) {
    console.error('[Credits] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
