export interface User {
  id: string
  email: string
  full_name?: string
}

export interface Generation {
  id: string
  user_id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  plan_type: 'basic' | 'pro'
  style_count: number
  input_photos: string[]
  output_photos?: string[]
  stripe_payment_id?: string
  created_at: string
  completed_at?: string
}

export interface PricingPlan {
  id: string
  name: string
  price: number
  style_count: number
  resolution: string
  features: string[]
  highlighted?: boolean
}
