export function getSupabaseUrl() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  try {
    if (!rawUrl) {
      throw new Error('Missing project URL')
    }

    const url = new URL(rawUrl)
    if (url.protocol === 'https:' || url.protocol === 'http:') {
      return url.toString().replace(/\/$/, '')
    }
  } catch {
  }

  throw new Error('Authentication configuration is unavailable.')
}
