// Credit Package Types
import type { PlanType } from './generation.types'

export type CreditPackageStatus = 'inactive' | 'active' | 'expired' | 'depleted'

export interface CreditPackage {
  id: string
  user_id: string
  
  // 套餐信息
  plan_type: PlanType
  total_credits: number
  remaining_credits: number
  
  // 有效期（从第一次生成开始计算）
  purchased_at: string
  activated_at?: string // 第一次生成时设置
  expires_at?: string // activated_at + validity_days
  validity_days: number
  
  // 支付信息
  stripe_payment_id?: string
  lemon_order_id?: string
  amount_paid?: number
  currency?: string
  
  // 状态
  status: CreditPackageStatus
  
  created_at: string
  updated_at?: string
}

export interface CreateCreditPackageInput {
  user_id: string
  plan_type: PlanType
  stripe_payment_id?: string
  lemon_order_id?: string
  amount_paid?: number
  currency?: string
}

export interface CreditPackageSummary {
  totalRemaining: number
  nearestExpiresAt?: string
  packages: CreditPackage[]
}

export interface ConsumeCreditsResult {
  success: boolean
  packageId?: string
  consumedAmount?: number
  error?: string
}