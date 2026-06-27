import { createClient } from '@supabase/supabase-js'
import { config } from './index'
import { getSupabaseUrl } from '../../src/lib/supabase/url'

// Admin client with service role key (bypasses RLS)
export const supabaseAdmin = createClient(
  getSupabaseUrl(),
  config.supabase.serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

// Client for browser use
export const supabaseClient = createClient(
  getSupabaseUrl(),
  config.supabase.anonKey
)

export { config }
