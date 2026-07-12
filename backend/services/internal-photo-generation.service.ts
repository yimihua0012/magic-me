import { supabaseAdmin } from '@backend/config/supabase'

type InternalTaskStatus = 'processing' | 'completed' | 'failed'

type InternalPhotoGenerationRow = {
  id: string
  status: InternalTaskStatus
  style_id: string | null
  style_name: string | null
  prompt: string
  negative_prompt: string | null
  input_photos: string[]
  output_photos: string[]
  progress: number
  current_step: string | null
  client_generation_id: string | null
  error_message: string | null
  metadata: Record<string, unknown> | null
}

export type CreateInternalPhotoGenerationInput = {
  prompt: string
  imageUrls: string[]
  styleId?: string
  styleName?: string
  negativePrompt?: string
  clientGenerationId?: string
  metadata?: Record<string, unknown>
}

type InternalPhotoGenerationResponse = {
  id: string
  status: InternalTaskStatus
  progress: number
  currentStep: string
  outputUrls: string[]
  reused?: boolean
}

type StoredImage = {
  path: string
  publicUrl: string | null
}

const OUTPUT_PHOTOS_BUCKET = 'output-photos'
const MAX_INPUT_PHOTOS = 3
const POLL_INTERVAL_MS = 5000
const GENERATION_ATTEMPTS = 3

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 30000): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timeoutId)
  }
}

export class InternalPhotoGenerationService {
  static async createTask(input: CreateInternalPhotoGenerationInput): Promise<InternalPhotoGenerationResponse> {
    const prompt = input.prompt.trim()
    const imageUrls = input.imageUrls.map(url => url.trim()).filter(Boolean).slice(0, MAX_INPUT_PHOTOS)

    if (!prompt) throw new Error('prompt is required')
    if (imageUrls.length === 0) throw new Error('At least one image URL is required')

    if (input.clientGenerationId) {
      const existing = await this.findByClientGenerationId(input.clientGenerationId)
      if (existing) return this.toResponse(existing, true)
    }

    const { data, error } = await supabaseAdmin
      .from('internal_photo_generations')
      .insert({
        status: 'processing',
        style_id: input.styleId || null,
        style_name: input.styleName || null,
        prompt,
        negative_prompt: input.negativePrompt || null,
        input_photos: imageUrls,
        output_photos: [],
        progress: 0,
        current_step: 'Initializing internal photo generation...',
        client_generation_id: input.clientGenerationId || null,
        metadata: input.metadata || {},
        started_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return this.toResponse(data as InternalPhotoGenerationRow)
  }

  static async getTask(taskId: string): Promise<InternalPhotoGenerationRow | null> {
    const { data, error } = await supabaseAdmin
      .from('internal_photo_generations')
      .select('*')
      .eq('id', taskId)
      .maybeSingle()

    if (error) throw error
    return data as InternalPhotoGenerationRow | null
  }

  static async processTask(taskId: string): Promise<void> {
    const task = await this.getTask(taskId)
    if (!task) throw new Error('Internal photo generation task not found')

    await this.updateTask(taskId, {
      status: 'processing',
      progress: 10,
      current_step: 'Generating photo from prompt...',
      started_at: new Date().toISOString(),
    })

    try {
      const outputUrl = await this.generateWithReplicate(task)
      await this.updateTask(taskId, {
        status: 'completed',
        progress: 100,
        current_step: 'Internal photo generation completed.',
        output_photos: [outputUrl],
        completed_at: new Date().toISOString(),
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal photo generation failed'
      await this.updateTask(taskId, {
        status: 'failed',
        progress: 0,
        current_step: 'Internal photo generation failed.',
        error_message: message,
      })
      throw error
    }
  }

  static toResponse(task: InternalPhotoGenerationRow, reused = false): InternalPhotoGenerationResponse {
    return {
      id: task.id,
      status: task.status,
      progress: task.progress || 0,
      currentStep: task.current_step || 'Processing internal photo generation...',
      outputUrls: task.output_photos || [],
      reused,
    }
  }

  private static async findByClientGenerationId(clientGenerationId: string): Promise<InternalPhotoGenerationRow | null> {
    const { data, error } = await supabaseAdmin
      .from('internal_photo_generations')
      .select('*')
      .eq('client_generation_id', clientGenerationId)
      .maybeSingle()

    if (error) throw error
    return data as InternalPhotoGenerationRow | null
  }

  private static async updateTask(taskId: string, updates: Record<string, unknown>): Promise<void> {
    const { error } = await supabaseAdmin
      .from('internal_photo_generations')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', taskId)

    if (error) throw error
  }

  private static async generateWithReplicate(task: InternalPhotoGenerationRow): Promise<string> {
    const replicateApiKey = process.env.REPLICATE_API_KEY
    if (!replicateApiKey) throw new Error('REPLICATE_API_KEY is required')

    const modelName = process.env.REPLICATE_MODEL_NAME || 'google/nano-banana-2'
    for (let attempt = 1; attempt <= GENERATION_ATTEMPTS; attempt += 1) {
      try {
        const response = await fetchWithTimeout(
          `https://api.replicate.com/v1/models/${modelName}/predictions`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${replicateApiKey}`,
              'Content-Type': 'application/json',
              'Prefer': 'wait',
            },
            body: JSON.stringify({
              input: {
                prompt: task.prompt,
                ...(task.negative_prompt ? { negative_prompt: task.negative_prompt } : {}),
                image_input: task.input_photos.slice(0, MAX_INPUT_PHOTOS),
                aspect_ratio: '1:1',
                output_format: 'jpg',
              },
            }),
          },
          30000,
        )

        const prediction = await response.json()
        if (!response.ok || prediction.error) {
          throw new Error(`Replicate request failed: ${prediction.error || prediction.detail || response.status}`)
        }

        let result = prediction
        let pollCount = 0
        while (result.status !== 'succeeded' && result.status !== 'failed') {
          pollCount += 1
          if (pollCount > 60) throw new Error('Replicate prediction timed out')

          await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS))
          const statusResponse = await fetchWithTimeout(
            `https://api.replicate.com/v1/predictions/${result.id}`,
            {
              headers: { 'Authorization': `Bearer ${replicateApiKey}` },
            },
            15000,
          )

          result = await statusResponse.json()
          if (!statusResponse.ok || result.error) {
            throw new Error(`Replicate polling failed: ${result.error || statusResponse.status}`)
          }
        }

        if (result.status === 'failed') {
          throw new Error(`Replicate prediction failed: ${result.error || 'Prediction failed'}`)
        }

        const temporaryOutputUrl = this.extractReplicateOutputUrl(result.output)
        if (!temporaryOutputUrl) {
          throw new Error('Replicate prediction returned no output URL')
        }

        return await this.persistOutputPhoto(temporaryOutputUrl, task)
      } catch (error) {
        if (attempt >= GENERATION_ATTEMPTS) throw error
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
      }
    }

    throw new Error('Internal photo generation attempts exhausted')
  }

  private static extractReplicateOutputUrl(output: unknown): string | null {
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

  private static async persistOutputPhoto(temporaryUrl: string, task: InternalPhotoGenerationRow): Promise<string> {
    const image = await this.loadImageFromUrl(temporaryUrl, 'image/jpeg')
    const extension = this.extensionForContentType(image.contentType)
    const safeStyleId = this.safeStorageSegment(task.style_id || task.style_name || 'internal')
    const objectPath = [
      'internal-photo-generations',
      this.safeStorageSegment(task.id),
      `${safeStyleId}.${extension}`,
    ].join('/')

    const storedImage = await this.storeImage(temporaryUrl, image, {
      bucket: OUTPUT_PHOTOS_BUCKET,
      path: objectPath,
      public: true,
    })

    if (!storedImage.publicUrl) throw new Error('Failed to create public URL for internal output image')
    return storedImage.publicUrl
  }

  private static async loadImageFromUrl(imageUrl: string, fallbackContentType: string): Promise<{ contentType: string; data: ArrayBuffer }> {
    if (imageUrl.startsWith('data:')) return this.loadDataUrlImage(imageUrl, fallbackContentType)

    const response = await fetchWithTimeout(imageUrl, {}, 30000)
    if (!response.ok) throw new Error(`Failed to download image: ${response.status}`)

    const contentType = response.headers.get('content-type') || fallbackContentType
    if (!contentType.startsWith('image/')) throw new Error(`Downloaded file is not an image: ${contentType}`)

    return {
      contentType,
      data: await response.arrayBuffer(),
    }
  }

  private static loadDataUrlImage(dataUrl: string, fallbackContentType: string): { contentType: string; data: ArrayBuffer } {
    const match = dataUrl.match(/^data:([^;,]+)?(;base64)?,(.*)$/)
    if (!match) throw new Error('Invalid data URL image')

    const contentType = match[1] || fallbackContentType
    if (!contentType.startsWith('image/')) throw new Error(`Data URL is not an image: ${contentType}`)

    const payload = match[3] || ''
    const bytes = match[2]
      ? Buffer.from(payload, 'base64')
      : Buffer.from(decodeURIComponent(payload), 'utf8')

    return {
      contentType,
      data: bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
    }
  }

  private static async storeImage(
    sourceUrl: string,
    image: { contentType: string; data: ArrayBuffer },
    options: { bucket: string; path: string; public: boolean }
  ): Promise<StoredImage> {
    const { error } = await supabaseAdmin.storage
      .from(options.bucket)
      .upload(options.path, image.data, {
        contentType: image.contentType,
        upsert: true,
        metadata: {
          source: sourceUrl.startsWith('data:') ? 'data-url' : sourceUrl,
        },
      })

    if (error) throw new Error(`Failed to upload image to ${options.bucket}: ${error.message}`)
    if (!options.public) return { path: options.path, publicUrl: null }

    const { data } = supabaseAdmin.storage
      .from(options.bucket)
      .getPublicUrl(options.path)

    return { path: options.path, publicUrl: data.publicUrl || null }
  }

  private static extensionForContentType(contentType: string): string {
    const normalized = contentType.split(';')[0].trim().toLowerCase()
    if (normalized === 'image/png') return 'png'
    if (normalized === 'image/webp') return 'webp'
    return 'jpg'
  }

  private static safeStorageSegment(value: string): string {
    return value.replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'unknown'
  }
}
