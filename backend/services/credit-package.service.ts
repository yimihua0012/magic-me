import { supabaseAdmin } from '@backend/config/supabase'
import { PLANS } from '@backend/config/plans'
import {
  CreditPackage,
  CreditPackageStatus,
  CreditPackageSummary,
  CreateCreditPackageInput,
  ConsumeCreditsResult,
  PlanType,
} from '@backend/types'
import { emailService } from './email.service'
import { userRepository } from '@backend/db/repositories'

// 内存存储作为数据库降级方案
declare global {
  // eslint-disable-next-line no-var
  var mockCreditPackages: Map<string, CreditPackage> | undefined
}

if (!global.mockCreditPackages) {
  global.mockCreditPackages = new Map<string, CreditPackage>()
}

const mockCreditPackages = global.mockCreditPackages

export class CreditPackageService {
  /**
   * 创建信用包（支付成功后调用）
   */
  static async createPackage(input: CreateCreditPackageInput): Promise<CreditPackage> {
    const plan = PLANS[input.plan_type as keyof typeof PLANS]
    if (!plan) {
      throw new Error(`Invalid plan type: ${input.plan_type}`)
    }

    const packageData: Partial<CreditPackage> = {
      user_id: input.user_id,
      plan_type: input.plan_type,
      total_credits: plan.credits,
      remaining_credits: plan.credits,
      validity_days: plan.validityDays,
      stripe_payment_id: input.stripe_payment_id,
      lemon_order_id: input.lemon_order_id,
      amount_paid: input.amount_paid || plan.price,
      currency: input.currency || 'USD',
      status: 'inactive', // 未激活，有效期未开始
      purchased_at: new Date().toISOString(),
    }

    const { data, error } = await supabaseAdmin
      .from('credit_packages')
      .insert(packageData)
      .select()
      .single()

    if (error) {
      console.log(`[CreditPackage] Database insert error: ${error.message}, falling back to memory`)
      const fallbackId = `pkg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      const fallbackPackage: CreditPackage = {
        id: fallbackId,
        user_id: input.user_id,
        plan_type: input.plan_type,
        total_credits: plan.credits,
        remaining_credits: plan.credits,
        validity_days: plan.validityDays,
        stripe_payment_id: input.stripe_payment_id,
        lemon_order_id: input.lemon_order_id,
        amount_paid: input.amount_paid || plan.price,
        currency: input.currency || 'USD',
        status: 'inactive',
        purchased_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      }
      mockCreditPackages.set(fallbackId, fallbackPackage)
      return fallbackPackage
    }

    console.log(`[CreditPackage] Created package: ${data.id}, credits: ${plan.credits}, validity: ${plan.validityDays} days`)
    return data as CreditPackage
  }

  /**
   * 获取用户所有有效的信用包（未过期且有剩余次数）
   */
  static async getAvailablePackages(userId: string): Promise<CreditPackage[]> {
    // 先检查并标记过期的包
    await this.checkAndExpirePackages(userId)

    const { data, error } = await supabaseAdmin
      .from('credit_packages')
      .select('*')
      .eq('user_id', userId)
      .in('status', ['inactive', 'active'])
      .gt('remaining_credits', 0)
      .order('expires_at', { ascending: true, nullsFirst: true }) // 未激活的排前面（expires_at 为 null）

    if (error) {
      console.error('[CreditPackage] Error fetching available packages:', error)
      // 从内存获取
      const packages = Array.from(mockCreditPackages.values())
        .filter(p => p.user_id === userId && 
          (p.status === 'inactive' || p.status === 'active') && 
          p.remaining_credits > 0)
      return packages
    }

    return data as CreditPackage[]
  }

  /**
   * 获取总剩余次数和最近到期时间
   */
  static async getTotalRemaining(userId: string): Promise<CreditPackageSummary> {
    const packages = await this.getAvailablePackages(userId)

    const totalRemaining = packages.reduce((sum, p) => sum + p.remaining_credits, 0)

    // 找最近的到期时间（已激活的包）
    const activePackages = packages.filter(p => p.status === 'active' && p.expires_at)
    const nearestExpiresAt = activePackages.length > 0
      ? activePackages.sort((a, b) => 
          new Date(a.expires_at!).getTime() - new Date(b.expires_at!).getTime()
        )[0].expires_at
      : undefined

    return {
      totalRemaining,
      nearestExpiresAt,
      packages,
    }
  }

  /**
   * 激活信用包（第一次生成时调用）
   * 设置 activated_at 和 expires_at，并发送邮件通知
   */
  static async activatePackage(packageId: string): Promise<CreditPackage> {
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('credit_packages')
      .select('*')
      .eq('id', packageId)
      .single()

    if (fetchError || !existing) {
      // 检查内存
      const mockPackage = mockCreditPackages.get(packageId)
      if (mockPackage && mockPackage.status === 'inactive') {
        const now = new Date()
        const expiresAt = new Date(now.getTime() + mockPackage.validity_days * 24 * 60 * 60 * 1000)
        mockPackage.status = 'active'
        mockPackage.activated_at = now.toISOString()
        mockPackage.expires_at = expiresAt.toISOString()
        mockPackage.updated_at = now.toISOString()
        
        // 发送激活邮件
        this.sendActivationEmail(mockPackage).catch(err => {
          console.error('[CreditPackage] Failed to send activation email:', err)
        })
        
        return mockPackage
      }
      throw new Error('Package not found')
    }

    if (existing.status !== 'inactive') {
      return existing as CreditPackage
    }

    const now = new Date()
    const expiresAt = new Date(now.getTime() + existing.validity_days * 24 * 60 * 60 * 1000)

    const { data, error } = await supabaseAdmin
      .from('credit_packages')
      .update({
        status: 'active',
        activated_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
      })
      .eq('id', packageId)
      .select()
      .single()

    if (error) {
      throw error
    }

    const activatedPackage = data as CreditPackage
    console.log(`[CreditPackage] Activated package: ${packageId}, expires_at: ${expiresAt.toISOString()}`)

    // 发送激活邮件
    this.sendActivationEmail(activatedPackage).catch(err => {
      console.error('[CreditPackage] Failed to send activation email:', err)
    })

    return activatedPackage
  }

  /**
   * 发送信用包激活邮件
   */
  private static async sendActivationEmail(pkg: CreditPackage): Promise<void> {
    try {
      const user = await userRepository.findById(pkg.user_id)
      if (!user?.email) {
        console.log(`[CreditPackage] No email found for user ${pkg.user_id}, skipping activation email`)
        return
      }

      await emailService.sendPaymentConfirmationEmail({
        email: user.email,
        name: user.full_name || undefined,
        planType: pkg.plan_type,
        totalCredits: pkg.total_credits,
        validityDays: pkg.validity_days,
        amountPaid: pkg.amount_paid,
      })

      console.log(`[CreditPackage] Activation email sent to ${user.email}`)
    } catch (err) {
      console.error('[CreditPackage] Error sending activation email:', err)
    }
  }

  /**
   * 核销次数（FIFO，优先用最早到期的）
   * @param amount 要核销的次数（等于选择的风格数量）
   */
  static async consumeCredits(userId: string, amount: number): Promise<ConsumeCreditsResult> {
    if (amount <= 0) {
      return { success: false, error: 'Invalid amount' }
    }

    // 检查并标记过期的包
    await this.checkAndExpirePackages(userId)

    // 获取可用包，按优先级排序：
    // 1. 已激活且最早到期的
    // 2. 未激活的（使用时会自动激活）
    const packages = await this.getAvailablePackages(userId)

    // 排序：active + expires_at 排前面，inactive 排后面
    const sortedPackages = packages.sort((a, b) => {
      // active 排在 inactive 前面
      if (a.status === 'active' && b.status === 'inactive') return -1
      if (a.status === 'inactive' && b.status === 'active') return 1
      
      // 都是 active，按 expires_at 升序（早到期排前面）
      if (a.status === 'active' && b.status === 'active' && a.expires_at && b.expires_at) {
        return new Date(a.expires_at).getTime() - new Date(b.expires_at).getTime()
      }
      
      // 都是 inactive，按 purchased_at 升序（早购买排前面）
      if (a.status === 'inactive' && b.status === 'inactive') {
        return new Date(a.purchased_at).getTime() - new Date(b.purchased_at).getTime()
      }
      
      return 0
    })

    // 检查总剩余次数
    const totalRemaining = sortedPackages.reduce((sum, p) => sum + p.remaining_credits, 0)
    if (totalRemaining < amount) {
      return { success: false, error: 'Insufficient credits' }
    }

    // FIFO 核销
    let remainingToConsume = amount
    const consumedFrom: { packageId: string; amount: number }[] = []

    for (const pkg of sortedPackages) {
      if (remainingToConsume <= 0) break

      // 如果包未激活，先激活
      if (pkg.status === 'inactive') {
        await this.activatePackage(pkg.id)
        pkg.status = 'active'
      }

      const consumeFromThis = Math.min(pkg.remaining_credits, remainingToConsume)
      
      const { error } = await supabaseAdmin
        .from('credit_packages')
        .update({
          remaining_credits: pkg.remaining_credits - consumeFromThis,
          status: pkg.remaining_credits - consumeFromThis === 0 ? 'depleted' : 'active',
        })
        .eq('id', pkg.id)

      if (error) {
        console.error(`[CreditPackage] Error consuming from package ${pkg.id}:`, error)
        // 降级到内存
        pkg.remaining_credits -= consumeFromThis
        pkg.status = pkg.remaining_credits === 0 ? 'depleted' : 'active'
        pkg.updated_at = new Date().toISOString()
        mockCreditPackages.set(pkg.id, pkg)
      }

      consumedFrom.push({ packageId: pkg.id, amount: consumeFromThis })
      remainingToConsume -= consumeFromThis

      console.log(`[CreditPackage] Consumed ${consumeFromThis} from package ${pkg.id}`)
    }

    return {
      success: true,
      packageId: consumedFrom[0]?.packageId, // 返回主要使用的包 ID
      consumedAmount: amount,
    }
  }

  /**
   * 回退次数（生成失败时调用）
   */
  static async refundCredits(packageId: string, amount: number): Promise<void> {
    if (amount <= 0) return

    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('credit_packages')
      .select('*')
      .eq('id', packageId)
      .single()

    if (fetchError || !existing) {
      // 检查内存
      const mockPackage = mockCreditPackages.get(packageId)
      if (mockPackage) {
        mockPackage.remaining_credits += amount
        if (mockPackage.remaining_credits > mockPackage.total_credits) {
          mockPackage.remaining_credits = mockPackage.total_credits
        }
        if (mockPackage.status === 'depleted') {
          mockPackage.status = 'active'
        }
        mockPackage.updated_at = new Date().toISOString()
        return
      }
      throw new Error('Package not found')
    }

    const newRemaining = Math.min(existing.remaining_credits + amount, existing.total_credits)
    const newStatus = existing.status === 'depleted' ? 'active' : existing.status

    const { error } = await supabaseAdmin
      .from('credit_packages')
      .update({
        remaining_credits: newRemaining,
        status: newStatus,
      })
      .eq('id', packageId)

    if (error) {
      console.error(`[CreditPackage] Error refunding to package ${packageId}:`, error)
      throw error
    }

    console.log(`[CreditPackage] Refunded ${amount} to package ${packageId}`)
  }

  /**
   * 检查并标记过期的包
   */
  static async checkAndExpirePackages(userId: string): Promise<void> {
    const now = new Date()

    const { data: expiredPackages, error } = await supabaseAdmin
      .from('credit_packages')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'active')
      .lt('expires_at', now.toISOString())

    if (error) {
      console.error('[CreditPackage] Error checking expired packages:', error)
      return
    }

    if (expiredPackages && expiredPackages.length > 0) {
      const ids = expiredPackages.map(p => p.id)
      
      const { error: updateError } = await supabaseAdmin
        .from('credit_packages')
        .update({ status: 'expired' })
        .in('id', ids)

      if (updateError) {
        console.error('[CreditPackage] Error marking packages as expired:', updateError)
      } else {
        console.log(`[CreditPackage] Marked ${ids.length} packages as expired`)
      }
    }

    // 同时检查内存
    mockCreditPackages.forEach((pkg) => {
      if (pkg.user_id === userId && 
        pkg.status === 'active' && 
        pkg.expires_at && 
        new Date(pkg.expires_at) < now) {
        pkg.status = 'expired'
        pkg.updated_at = now.toISOString()
      }
    })
  }

  /**
   * 获取用户所有信用包（包括已过期和已用完的）
   */
  static async getUserPackages(userId: string): Promise<CreditPackage[]> {
    const { data, error } = await supabaseAdmin
      .from('credit_packages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[CreditPackage] Error fetching user packages:', error)
      return Array.from(mockCreditPackages.values()).filter(p => p.user_id === userId)
    }

    return data as CreditPackage[]
  }

  /**
   * 检查用户是否有足够的次数
   */
  static async hasEnoughCredits(userId: string, amount: number): Promise<boolean> {
    const summary = await this.getTotalRemaining(userId)
    return summary.totalRemaining >= amount
  }
}