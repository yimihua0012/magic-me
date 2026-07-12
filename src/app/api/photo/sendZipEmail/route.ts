import { NextResponse } from 'next/server'
import { emailService } from '@backend/services'
import { isValidEmail } from '@backend/utils/validation'

export const dynamic = 'force-dynamic'

type SendZipEmailBody = {
  email?: unknown
  zipUrl?: unknown
  filename?: unknown
  orderid?: unknown
}

function isAuthorized(request: Request) {
  const configuredToken = process.env.INTERNAL_PHOTO_GENERATION_API_KEY?.trim()
  if (!configuredToken) {
    return { ok: false, status: 503, error: 'Photo email API is not configured' }
  }

  const authHeader = request.headers.get('authorization') || ''
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice('Bearer '.length).trim() : ''
  const headerToken = request.headers.get('x-internal-api-key')?.trim() || ''
  const token = bearerToken || headerToken

  if (token !== configuredToken) {
    return { ok: false, status: 401, error: 'Unauthorized' }
  }

  return { ok: true, status: 200, error: null }
}

function isHttpUrl(value: string) {
  return value.startsWith('https://') || value.startsWith('http://')
}

export async function POST(request: Request) {
  const auth = isAuthorized(request)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const body = await request.json() as SendZipEmailBody
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const zipUrl = typeof body.zipUrl === 'string' ? body.zipUrl.trim() : ''

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'A valid email is required' }, { status: 400 })
    }

    if (!zipUrl || !isHttpUrl(zipUrl)) {
      return NextResponse.json({ error: 'A valid zipUrl is required' }, { status: 400 })
    }

    await emailService.sendZipAttachmentEmail({
      email,
      zipUrl,
      filename: typeof body.filename === 'string' && body.filename.trim() ? body.filename.trim() : undefined,
      orderid: typeof body.orderid === 'string' && body.orderid.trim() ? body.orderid.trim() : undefined,
    })

    return NextResponse.json({
      status: 'sent',
      email,
    })
  } catch (error) {
    console.error('[SendZipEmail] Error:', error)
    const message = error instanceof Error ? error.message : 'Failed to send ZIP email'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
