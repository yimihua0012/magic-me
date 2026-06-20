import { supabaseAdmin } from '../../config/supabase'
import { User, Profile, CreateProfileInput, UpdateProfileInput } from '../types'

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) return null
    return data as User
  }

  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !data) return null
    return data as User
  }

  async create(input: CreateProfileInput): Promise<User> {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .insert(input)
      .select()
      .single()

    if (error) throw new Error(`Failed to create user: ${error.message}`)
    return data as User
  }

  async update(id: string, input: UpdateProfileInput): Promise<User> {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(input)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(`Failed to update user: ${error.message}`)
    return data as User
  }

  async updateStripeCustomerId(id: string, stripeCustomerId: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ stripe_customer_id: stripeCustomerId })
      .eq('id', id)

    if (error) throw new Error(`Failed to update stripe customer: ${error.message}`)
  }

  async updateLastLogin(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', id)

    if (error) console.error('Failed to update last login:', error)
  }
}

export const userRepository = new UserRepository()
