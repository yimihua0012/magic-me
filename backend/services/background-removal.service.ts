import { supabaseAdmin } from '@backend/config/supabase'

const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY || ''
const REMOVE_BG_ENDPOINT = 'https://api.remove.bg/v1.0/removebg'
const OUTPUT_PHOTOS_BUCKET = 'output-photos'

export interface BackgroundRemovalResult {
  outputUrl: string
  durationMs: number
  metrics?: {
    predict_time?: number
    total_time?: number
  }
}

export class BackgroundRemovalService {
  static get modelName() {
    return 'remove.bg'
  }

  static async removeBackground(imageUrl: string, sourceId = 'remove-background'): Promise<BackgroundRemovalResult> {
    if (!REMOVE_BG_API_KEY) {
      throw new Error('REMOVE_BG_API_KEY is required for background removal')
    }

    const startedAt = Date.now()
    const input = await this.resolveInputImage(imageUrl)

    const formData = new FormData()
    formData.append('image_file', new Blob([new Uint8Array(input.data)], { type: input.contentType }))

    const response = await fetchWithTimeout(
      REMOVE_BG_ENDPOINT,
      {
        method: 'POST',
        headers: {
          'X-Api-Key': REMOVE_BG_API_KEY,
        },
        body: formData,
      },
      60000,
    )

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      throw new Error(`Background removal failed for ${sourceId}: ${extractRemoveBgError(response.status, errorText)}`)
    }

    const contentType = response.headers.get('content-type') || 'image/png'
    const pngBuffer = Buffer.from(await response.arrayBuffer())
    const outputUrl = await this.persistOutputPng(pngBuffer, sourceId)

    return {
      outputUrl,
      durationMs: Date.now() - startedAt,
    }
  }

  private static async resolveInputImage(imageUrl: string): Promise<{ contentType: string; data: Buffer }> {
    if (imageUrl.startsWith('data:')) {
      const match = imageUrl.match(/^data:([^;,]+)?(;base64)?,(.*)$/)
      if (!match) throw new Error('Invalid data URL image')
      const contentType = match[1] || 'image/png'
      if (!contentType.startsWith('image/')) throw new Error(`Data URL is not an image: ${contentType}`)
      const payload = match[3] || ''
      const data = match[2]
        ? Buffer.from(payload, 'base64')
        : Buffer.from(decodeURIComponent(payload), 'utf8')
      return { contentType, data }
    }

    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      const response = await fetchWithTimeout(imageUrl, {}, 30000)
      if (!response.ok) throw new Error(`Failed to download image: ${response.status}`)
      const contentType = response.headers.get('content-type') || 'image/png'
      if (!contentType.startsWith('image/')) throw new Error(`Downloaded file is not an image: ${contentType}`)
      return {
        contentType,
        data: Buffer.from(await response.arrayBuffer()),
      }
    }

    throw new Error('imageUrl must be an http(s) URL or a data:image/... base64 URL')
  }

  private static async persistOutputPng(pngBuffer: Buffer, sourceId: string): Promise<string> {
    const objectPath = [
      'remove-background',
      this.safeStorageSegment(sourceId),
      `${Date.now()}.png`,
    ].join('/')

    const { error } = await supabaseAdmin.storage
      .from(OUTPUT_PHOTOS_BUCKET)
      .upload(objectPath, pngBuffer, {
        contentType: 'image/png',
        upsert: true,
        metadata: {
          source: 'remove.bg',
          originalSourceId: sourceId,
        },
      })

    if (error) throw new Error(`Failed to upload transparent PNG to ${OUTPUT_PHOTOS_BUCKET}: ${error.message}`)

    const { data } = supabaseAdmin.storage
      .from(OUTPUT_PHOTOS_BUCKET)
      .getPublicUrl(objectPath)

    return data.publicUrl || ''
  }

  private static safeStorageSegment(value: string): string {
    return value.replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'unknown'
  }
}

function extractRemoveBgError(status: number, responseText: string): string {
  try {
    const parsed = JSON.parse(responseText)
    if (Array.isArray(parsed.errors) && parsed.errors.length > 0) {
      const first = parsed.errors[0]
      return (typeof first?.title === 'string' ? first.title : '')
        + (typeof first?.detail === 'string' && first?.detail ? `: ${first.detail}` : '')
    }
    if (typeof parsed?.errors?.[0] === 'string') return parsed.errors[0]
  } catch {
    // Fall through to status-only message
  }

  if (status === 403) return 'remove.bg API key is invalid or has hit its credit limit'
  if (status === 429) return 'remove.bg rate limit exceeded'
  return `remove.bg responded with status ${status}`
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 30000): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timeoutId)
  }
}