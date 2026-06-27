import { createClient } from '@supabase/supabase-js'
import { getSupabaseUrl } from './url'

export const supabase = createClient(
  getSupabaseUrl(),
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
