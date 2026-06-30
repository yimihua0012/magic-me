import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { appConfig } from '@/lib/config'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
    
    return NextResponse.redirect(new URL('/', appConfig.url))
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
