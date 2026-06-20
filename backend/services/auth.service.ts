import { supabaseAdmin } from '@backend/config/supabase'
import { config } from '@backend/config'
import { userRepository } from '@backend/db/repositories'
import { User } from '@backend/types'

export class AuthService {
  async signUp(email: string, password: string, metadata?: { full_name?: string }): Promise<User> {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: metadata,
    })

    if (error) {
      throw new Error(`Signup failed: ${error.message}`)
    }

    if (!data.user) {
      throw new Error('Failed to create user')
    }

    const profile = await userRepository.findById(data.user.id)
    if (!profile) {
      throw new Error('Failed to create user profile')
    }

    return profile
  }

  async signIn(email: string, password: string): Promise<User> {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers()

    if (error) {
      throw new Error(`Failed to list users: ${error.message}`)
    }

    const user = data.users.find(u => u.email === email)
    
    if (!user) {
      throw new Error('Invalid credentials')
    }

    const { data: signInData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      throw new Error('Invalid credentials')
    }

    await userRepository.updateLastLogin(user.id)

    const profile = await userRepository.findById(user.id)
    if (!profile) {
      throw new Error('User profile not found')
    }

    return profile
  }

  async signOut(): Promise<void> {
    // Client-side sign out handled by Supabase client
  }

  async getUser(userId: string): Promise<User | null> {
    return userRepository.findById(userId)
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return userRepository.findByEmail(email)
  }

  async updateStripeCustomerId(userId: string, stripeCustomerId: string): Promise<void> {
    await userRepository.updateStripeCustomerId(userId, stripeCustomerId)
  }

  async deleteUser(userId: string): Promise<void> {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
    if (error) {
      throw new Error(`Failed to delete user: ${error.message}`)
    }
  }
}

export const authService = new AuthService()
