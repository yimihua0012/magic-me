import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@backend/config/supabase'
import { isAdminEmail } from '@/lib/admin'
import { getCurrentUser } from '@/lib/auth/server'
import { getStyleTemplatePrompt } from '@/lib/style-template-prompts'
import { PHOTO_TOOL_STYLE_CONFIGS } from '@/lib/photo-tool-styles'

export const dynamic = 'force-dynamic'

const bucket = 'style-templates'
const POLL_INTERVAL_MS = 5000
const MAX_POLLS = 90
const GENERATION_ATTEMPTS = 3

export async function POST(request: Request) {
  const auth = await requireAdmin(request)
  if (auth) return auth

  const body = await request.json().catch(() => null)
  const styleId = typeof body?.style_id === 'string' ? body.style_id.trim() : ''
  if (!styleId) {
    return NextResponse.json({ error: 'Style id is required.' }, { status: 400 })
  }

  const known = await findStyle(styleId)
  if (known.error) {
    return NextResponse.json({ error: 'Failed to load styles.' }, { status: 500 })
  }
  if (!known.style) {
    return NextResponse.json({ error: 'Unknown style id.' }, { status: 400 })
  }

  const replicateApiKey = process.env.REPLICATE_API_KEY
  if (!replicateApiKey) {
    return NextResponse.json({ error: 'REPLICATE_API_KEY is not configured.' }, { status: 500 })
  }

  const config = getStyleTemplatePrompt(known.style.id, known.style.category)
  const modelName = process.env.REPLICATE_MODEL_NAME || 'google/nano-banana-2'

  let outputUrl: string | null = null
  let lastError: string | null = null

  for (let attempt = 1; attempt <= GENERATION_ATTEMPTS; attempt += 1) {
    try {
      outputUrl = await generateTemplateImage(replicateApiKey, modelName, config.prompt, config.negative)
      break
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Template generation failed'
      console.error(`[Admin Style Templates] Generate attempt ${attempt} failed for ${styleId}:`, error)
      if (attempt < GENERATION_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000))
      }
    }
  }

  if (!outputUrl) {
    return NextResponse.json({ error: lastError || 'Failed to generate template image.' }, { status: 500 })
  }

  const image = await fetchImage(outputUrl)
  if (!image) {
    return NextResponse.json({ error: 'Failed to download generated image.' }, { status: 500 })
  }

  const bucketError = await ensureBucket()
  if (bucketError) return bucketError

  const { data: existing } = await supabaseAdmin
    .from('style_templates')
    .select('storage_path')
    .eq('style_id', styleId)
    .maybeSingle()

  const id = crypto.randomUUID()
  const extension = image.contentType.includes('png') ? 'png' : 'jpg'
  const storagePath = `${new Date().toISOString().slice(0, 10)}/${id}.${extension}`

  const upload = await supabaseAdmin.storage.from(bucket).upload(storagePath, image.data, {
    contentType: image.contentType,
    cacheControl: '31536000',
    upsert: false,
  })

  if (upload.error) {
    console.error('[Admin Style Templates] Upload error:', upload.error)
    return NextResponse.json({ error: 'Failed to upload generated image.' }, { status: 500 })
  }

  const publicUrl = supabaseAdmin.storage.from(bucket).getPublicUrl(storagePath).data.publicUrl

  const { error: upsertError } = await supabaseAdmin.from('style_templates').upsert(
    {
      style_id: styleId,
      image_url: publicUrl,
      storage_path: storagePath,
      alt: styleId,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'style_id' }
  )

  if (upsertError) {
    await supabaseAdmin.storage.from(bucket).remove([storagePath]).catch(() => {})
    console.error('[Admin Style Templates] Upsert error:', upsertError)
    return NextResponse.json({ error: 'Failed to save generated style template.' }, { status: 500 })
  }

  if (existing?.storage_path && existing.storage_path !== storagePath) {
    await supabaseAdmin.storage.from(bucket).remove([existing.storage_path]).catch(() => {})
  }

  return NextResponse.json({
    style: {
      id: styleId,
      has_template: true,
      image_url: publicUrl,
      storage_path: storagePath,
    },
  })
}

async function generateTemplateImage(
  apiKey: string,
  modelName: string,
  prompt: string,
  negative: string
): Promise<string> {
  const response = await fetchWithTimeout(
    `https://api.replicate.com/v1/models/${modelName}/predictions`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Prefer: 'wait',
      },
      body: JSON.stringify({
        input: {
          prompt,
          negative_prompt: negative,
          aspect_ratio: '1:1',
          output_format: 'jpg',
        },
      }),
    },
    30000
  )

  const prediction = await response.json().catch(() => ({}))
  if (!response.ok || prediction.error) {
    throw new Error(`Replicate request failed: ${prediction.error || prediction.detail || response.status}`)
  }

  let result = prediction
  let pollCount = 0
  while (result.status !== 'succeeded' && result.status !== 'failed') {
    pollCount += 1
    if (pollCount > MAX_POLLS) throw new Error('Replicate prediction timed out')

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))
    const statusResponse = await fetchWithTimeout(
      `https://api.replicate.com/v1/predictions/${result.id}`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
      },
      15000
    )
    result = await statusResponse.json().catch(() => ({}))
    if (!statusResponse.ok || result.error) {
      throw new Error(`Replicate polling failed: ${result.error || statusResponse.status}`)
    }
  }

  if (result.status === 'failed') {
    throw new Error(`Replicate prediction failed: ${result.error || 'Prediction failed'}`)
  }

  const outputUrl = extractReplicateOutputUrl(result.output)
  if (!outputUrl) throw new Error('Replicate prediction returned no output URL')

  return outputUrl
}

async function fetchImage(url: string): Promise<{ contentType: string; data: ArrayBuffer } | null> {
  try {
    const response = await fetchWithTimeout(url, {}, 30000)
    if (!response.ok) return null
    const contentType = response.headers.get('content-type') || 'image/jpeg'
    if (!contentType.startsWith('image/')) return null
    return { contentType, data: await response.arrayBuffer() }
  } catch {
    return null
  }
}

function extractReplicateOutputUrl(output: unknown): string | null {
  if (typeof output === 'string') return output
  if (Array.isArray(output)) {
    for (const item of output) {
      if (typeof item === 'string') return item
      if (item && typeof item === 'object' && typeof (item as { url?: unknown }).url === 'string') {
        return (item as { url: string }).url
      }
    }
  }
  if (output && typeof output === 'object' && typeof (output as { url?: unknown }).url === 'string') {
    return (output as { url: string }).url
  }
  return null
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

async function findStyle(styleId: string): Promise<{ style: { id: string; category: string } | null; error: unknown }> {
  const { data, error } = await supabaseAdmin
    .from('headshot_styles')
    .select('id,category')
    .eq('is_active', true)
    .eq('id', styleId)
    .maybeSingle()

  if (data) return { style: { id: data.id, category: data.category }, error: null }
  if (error) return { style: null, error }

  const photoTool = PHOTO_TOOL_STYLE_CONFIGS.find((style) => style.id === styleId)
  if (photoTool) return { style: { id: photoTool.id, category: photoTool.category }, error: null }

  return { style: null, error: null }
}

async function requireAdmin(request: Request) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  if (!isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return null
}

async function ensureBucket() {
  const { data: existing, error: checkError } = await supabaseAdmin.storage.getBucket(bucket)
  if (existing) return null

  if (checkError && String(checkError?.message || checkError).toLowerCase().includes('not found')) {
    const { error: createError } = await supabaseAdmin.storage.createBucket(bucket, { public: true })
    if (createError) {
      console.error('[Admin Style Templates] Bucket create error:', createError)
      return NextResponse.json({ error: 'Bucket is not ready.' }, { status: 500 })
    }
    return null
  }

  if (checkError) {
    console.error('[Admin Style Templates] Bucket check error:', checkError)
  }
  return null
}