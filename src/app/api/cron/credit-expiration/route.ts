import { NextResponse } from 'next/server'
import { CreditPackageService } from '@backend/services'
import { emailService } from '@backend/services/email.service'
import { userRepository } from '@backend/db/repositories'
import { supabaseAdmin } from '@backend/config/supabase'

export const dynamic = 'force-dynamic'

// Vercel Cron 配置：每天早上 9 点执行
export async function GET(request: Request) {
  // 验证 cron secret（防止未授权访问）
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  console.log('[Cron] Starting credit package expiration check...')

  try {
    const now = new Date()
    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)

    // 1. 检查即将过期的包（3天内）
    const { data: expiringSoon, error: expiringError } = await supabaseAdmin
      .from('credit_packages')
      .select('*')
      .eq('status', 'active')
      .gt('expires_at', now.toISOString())
      .lt('expires_at', threeDaysLater.toISOString())

    if (expiringError) {
      console.error('[Cron] Error fetching expiring packages:', expiringError)
    } else if (expiringSoon && expiringSoon.length > 0) {
      console.log(`[Cron] Found ${expiringSoon.length} packages expiring soon`)

      for (const pkg of expiringSoon) {
        try {
          const user = await userRepository.findById(pkg.user_id)
          if (user?.email) {
            const daysRemaining = Math.ceil(
              (new Date(pkg.expires_at).getTime() - now.getTime()) / (24 * 60 * 60 * 1000)
            )

            await emailService.sendExpirationReminderEmail({
              email: user.email,
              name: user.full_name || undefined,
              remainingCredits: pkg.remaining_credits,
              expiresAt: pkg.expires_at,
              daysRemaining,
            })

            console.log(`[Cron] Sent expiration reminder to ${user.email}`)
          }
        } catch (err) {
          console.error(`[Cron] Error sending reminder for package ${pkg.id}:`, err)
        }
      }
    }

    // 2. 检查已过期的包
    const { data: expiredPackages, error: expiredError } = await supabaseAdmin
      .from('credit_packages')
      .select('id, user_id')
      .eq('status', 'active')
      .lt('expires_at', now.toISOString())

    if (expiredError) {
      console.error('[Cron] Error fetching expired packages:', expiredError)
    } else if (expiredPackages && expiredPackages.length > 0) {
      const ids = expiredPackages.map(p => p.id)
      
      // 更新状态为 expired
      const { error: updateError } = await supabaseAdmin
        .from('credit_packages')
        .update({ status: 'expired' })
        .in('id', ids)

      if (updateError) {
        console.error('[Cron] Error updating expired packages:', updateError)
      } else {
        console.log(`[Cron] Marked ${ids.length} packages as expired`)
      }

      // 发送过期通知邮件
      for (const pkg of expiredPackages) {
        try {
          const user = await userRepository.findById(pkg.user_id)
          const packageData = expiringSoon?.find(p => p.id === pkg.id) || pkg

          if (user?.email) {
            await emailService.sendExpiredEmail({
              email: user.email,
              name: user.full_name || undefined,
              remainingCredits: packageData.remaining_credits,
              expiresAt: packageData.expires_at,
              daysRemaining: 0,
            })

            console.log(`[Cron] Sent expiration notice to ${user.email}`)
          }
        } catch (err) {
          console.error(`[Cron] Error sending expiration notice for package ${pkg.id}:`, err)
        }
      }
    }

    console.log('[Cron] Credit package expiration check completed')
    return NextResponse.json({
      success: true,
      expiringSoonCount: expiringSoon?.length || 0,
      expiredCount: expiredPackages?.length || 0,
    })
  } catch (error) {
    console.error('[Cron] Error in expiration check:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
