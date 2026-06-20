import { createClient } from '@supabase/supabase-js'
import { config } from './index'

// Admin client with service role key (bypasses RLS)
export const supabaseAdmin = createClient(
  config.supabase.url,
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
  config.supabase.url,
  config.supabase.anonKey
)

export { config }
