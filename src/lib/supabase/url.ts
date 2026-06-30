const FALLBACK_SUPABASE_URL = 'https://oyjtcajkjrlvtttnbhdq.supabase.co'

export function getSupabaseUrl() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL

  try {
    const url = new URL(rawUrl)
    if (url.hostname.endsWith('.supabase.co') || url.hostname.endsWith('.supabase.in')) {
      return url.toString().replace(/\/$/, '')
    }
  } catch {
  }

  console.warn('[Supabase] NEXT_PUBLIC_SUPABASE_URL is not a Supabase project URL. Falling back to project URL.')
  return FALLBACK_SUPABASE_URL
}
