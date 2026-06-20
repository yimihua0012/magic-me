// User Types
export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  stripe_customer_id?: string
  stripe_session_id?: string
  plan_type: 'basic' | 'pro' | 'enterprise'
  email_verified: boolean
  last_login_at?: string
  created_at: string
  updated_at: string
}

export type Profile = User

export interface CreateProfileInput {
  id: string
  email: string
  full_name?: string
}

export interface UpdateProfileInput {
  full_name?: string
  avatar_url?: string
  stripe_customer_id?: string
  plan_type?: 'basic' | 'pro' | 'enterprise'
  email_verified?: boolean
  last_login_at?: string
}
