import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import crypto from 'crypto'
import { config } from '@backend/config'
import { emailService } from '@backend/services'

export const dynamic = 'force-dynamic'

type UnknownRecord = Record<string, unknown>

function asRecord(value: unknown): UnknownRecord {
  return value && typeof value === 'object' ? value as UnknownRecord : {}
}

function firstString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim()
    }

    if (Array.isArray(value)) {
      const joined = value
        .map((item) => {
          if (typeof item === 'string') return item
          const record = asRecord(item)
          return record.email || record.address || record.text || record.name
        })
        .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
        .join(', ')

      if (joined) return joined
    }

    const record = asRecord(value)
    const nested = record.email || record.address || record.text || record.name
    if (typeof nested === 'string' && nested.trim()) {
      return nested.trim()
    }
  }

  return undefined
}

function getInboundEmailPayload(body: UnknownRecord) {
  const data = asRecord(body.data)
  const email = asRecord(body.email)
  const payload = asRecord(body.payload)
  return Object.keys(email).length > 0
    ? email
    : Object.keys(data).length > 0
      ? data
      : Object.keys(payload).length > 0
        ? payload
        : body
}

function verifySvixSignature(rawBody: string, headersList: Headers) {
  const secret = config.email.resendInboundWebhookSecret
  if (!secret) {
    console.error('[Resend Inbound] RESEND_INBOUND_WEBHOOK_SECRET is not configured')
    return false
  }

  const id = headersList.get('svix-id')
  const timestamp = headersList.get('svix-timestamp')
  const signature = headersList.get('svix-signature')

  if (!id || !timestamp || !signature) {
    console.error('[Resend Inbound] Missing Svix signature headers')
    return false
  }

  const timestampMs = Number(timestamp) * 1000
  const toleranceMs = 5 * 60 * 1000
  if (!Number.isFinite(timestampMs) || Math.abs(Date.now() - timestampMs) > toleranceMs) {
    console.error('[Resend Inbound] Svix timestamp is outside the allowed tolerance')
    return false
  }

  const secretBytes = Buffer.from(secret.replace(/^whsec_/, ''), 'base64')
  const signedContent = `${id}.${timestamp}.${rawBody}`
  const expectedSignature = crypto
    .createHmac('sha256', secretBytes)
    .update(signedContent)
    .digest('base64')

  return signature
    .split(' ')
    .some((part) => {
      const [, signatureValue] = part.split(',')
      if (!signatureValue) return false

      const expected = Buffer.from(expectedSignature)
      const actual = Buffer.from(signatureValue)
      return expected.length === actual.length && crypto.timingSafeEqual(expected, actual)
    })
}

export async function POST(request: Request) {
  try {
    const headersList = await headers()
    const rawBody = await request.text()

    if (!verifySvixSignature(rawBody, headersList)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = asRecord(JSON.parse(rawBody))
    const eventType = firstString(body.type)
    if (eventType && eventType !== 'email.received') {
      return NextResponse.json({ received: true, forwarded: false, ignored: eventType })
    }

    const inbound = getInboundEmailPayload(body)
    const headersPayload = asRecord(inbound.headers)
    const html = firstString(inbound.html, inbound.htmlBody, inbound.bodyHtml)
    const text = firstString(inbound.text, inbound.textBody, inbound.bodyText, inbound.body)
    const receivedAt = firstString(inbound.createdAt, inbound.created_at, inbound.receivedAt, inbound.received_at)

    await emailService.forwardInboundEmail({
      from: firstString(inbound.from, inbound.sender, headersPayload.from),
      to: firstString(inbound.to, inbound.recipients, headersPayload.to),
      cc: firstString(inbound.cc, headersPayload.cc),
      replyTo: firstString(inbound.replyTo, inbound.reply_to, headersPayload['reply-to']),
      subject: firstString(inbound.subject, headersPayload.subject),
      text,
      html,
      receivedAt,
      messageId: firstString(inbound.messageId, inbound.message_id, headersPayload['message-id']),
    })

    return NextResponse.json({ received: true, forwarded: true })
  } catch (error) {
    console.error('[Resend Inbound] Failed to forward inbound email:', error)
    return NextResponse.json({ error: 'Failed to forward inbound email' }, { status: 500 })
  }
}
