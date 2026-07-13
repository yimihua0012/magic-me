import { supabaseAdmin } from '@backend/config/supabase'
type InternalTaskStatus = 'processing' | 'completed' | 'failed'
type ProductType = 'idphoto' | 'portrait'

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
  productType?: ProductType
  generationPrompts?: Partial<Record<'idphoto' | 'portraitWhite' | 'portraitFront' | 'portraitSide', string>>
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

type GenerationSpec = {
  label: string
  prompt: string
  aspectRatio: '1:1' | '2:3'
  outputFormat: 'jpg' | 'png'
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
    const productType = input.productType === 'portrait' ? 'portrait' : 'idphoto'
    const generationPrompts = this.normalizeGenerationPrompts(input.generationPrompts)

    if (!prompt) throw new Error('prompt is required')
    if (imageUrls.length === 0) throw new Error('At least one image URL is required')
    imageUrls.forEach((url) => this.validateInputImageReference(url))

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
        current_step: '任务已创建',
        client_generation_id: input.clientGenerationId || null,
        metadata: { ...(input.metadata || {}), productType, generationPrompts },
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
      current_step: '生成中',
      started_at: new Date().toISOString(),
    })

    try {
      const preparedInputPhotos = await this.prepareInputPhotosForReplicate(task)
      const preparedTask = { ...task, input_photos: preparedInputPhotos }
      await this.updateTask(taskId, {
        input_photos: preparedInputPhotos,
        progress: 20,
        current_step: '准备图片',
      })

      const productType = this.getProductType(preparedTask.metadata)
      const outputUrls = await this.generateProductImages(preparedTask, productType)

      await this.updateTask(taskId, {
        status: 'completed',
        progress: 100,
        current_step: '生成完成',
        output_photos: outputUrls,
        metadata: {
          ...(task.metadata || {}),
          generatedOutputUrls: outputUrls,
        },
        completed_at: new Date().toISOString(),
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : '生成失败'
      await this.updateTask(taskId, {
        status: 'failed',
        progress: 0,
        current_step: '生成失败',
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
      currentStep: task.current_step || '处理中',
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

  private static getProductType(metadata: Record<string, unknown> | null): ProductType {
    return metadata?.productType === 'portrait' ? 'portrait' : 'idphoto'
  }

  private static normalizeGenerationPrompts(value: CreateInternalPhotoGenerationInput['generationPrompts']) {
    if (!value) return {}
    return Object.fromEntries(
      Object.entries(value)
        .filter((entry): entry is [string, string] => typeof entry[1] === 'string' && entry[1].trim().length > 0)
        .map(([key, prompt]) => [key, prompt.trim()])
    )
  }

  private static getGenerationPrompt(task: InternalPhotoGenerationRow, key: string) {
    const prompts = task.metadata?.generationPrompts
    if (prompts && typeof prompts === 'object' && !Array.isArray(prompts)) {
      const prompt = (prompts as Record<string, unknown>)[key]
      if (typeof prompt === 'string' && prompt.trim()) return prompt.trim()
    }
    return task.prompt.trim()
  }

  private static validateInputImageReference(imageUrl: string): void {
    if (imageUrl.startsWith('data:image/')) return
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return
    throw new Error('imageUrl must be an http(s) URL or a data:image/... base64 URL')
  }

  private static async prepareInputPhotosForReplicate(task: InternalPhotoGenerationRow): Promise<string[]> {
    const preparedPhotos: string[] = []

    for (let index = 0; index < task.input_photos.length; index += 1) {
      const imageUrl = task.input_photos[index]
      this.validateInputImageReference(imageUrl)

      if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        preparedPhotos.push(imageUrl)
        continue
      }

      const image = await this.loadDataUrlImage(imageUrl, 'image/jpeg')
      const extension = this.extensionForContentType(image.contentType)
      const objectPath = [
        'internal-photo-generations',
        this.safeStorageSegment(task.id),
        `input-${String(index + 1).padStart(2, '0')}.${extension}`,
      ].join('/')

      const storedImage = await this.storeImage(imageUrl, image, {
        bucket: OUTPUT_PHOTOS_BUCKET,
        path: objectPath,
        public: true,
      })

      if (!storedImage.publicUrl) {
        throw new Error('Failed to create public URL for internal input image')
      }

      preparedPhotos.push(storedImage.publicUrl)
    }

    return preparedPhotos
  }

  private static buildGenerationSpecs(task: InternalPhotoGenerationRow, productType: ProductType): GenerationSpec[] {
    if (productType === 'idphoto') {
      return [{
        label: 'idphoto-white-1024',
        prompt: this.getGenerationPrompt(task, 'idphoto'),
        aspectRatio: '1:1',
        outputFormat: 'jpg',
      }]
    }

    return [
      {
        label: 'portrait-white-1024',
        prompt: this.getGenerationPrompt(task, 'portraitWhite'),
        aspectRatio: '1:1',
        outputFormat: 'jpg',
      },
      {
        label: 'portrait-front-upper-body-1200x1800',
        prompt: this.getGenerationPrompt(task, 'portraitFront'),
        aspectRatio: '2:3',
        outputFormat: 'jpg',
      },
      {
        label: 'portrait-side-shoulder-upper-body-1200x1800',
        prompt: this.getGenerationPrompt(task, 'portraitSide'),
        aspectRatio: '2:3',
        outputFormat: 'jpg',
      },
    ]
  }

  private static async generateProductImages(task: InternalPhotoGenerationRow, productType: ProductType): Promise<string[]> {
    const specs = this.buildGenerationSpecs(task, productType)
    const outputUrls: string[] = []

    for (let index = 0; index < specs.length; index += 1) {
      await this.updateTask(task.id, {
        progress: 25 + Math.round((index / specs.length) * 30),
        current_step: this.generationStepLabel(specs[index].label),
      })
      outputUrls.push(await this.generateWithReplicate(task, specs[index]))
    }

    return outputUrls
  }

  private static async generateWithReplicate(task: InternalPhotoGenerationRow, spec: GenerationSpec): Promise<string> {
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
                prompt: spec.prompt,
                ...(task.negative_prompt ? { negative_prompt: task.negative_prompt } : {}),
                image_input: task.input_photos.slice(0, MAX_INPUT_PHOTOS),
                aspect_ratio: spec.aspectRatio,
                output_format: spec.outputFormat,
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

        return await this.persistOutputPhoto(temporaryOutputUrl, task, spec.label)
      } catch (error) {
        if (attempt >= GENERATION_ATTEMPTS) throw error
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
      }
    }

    throw new Error('Internal photo generation attempts exhausted')
  }

  private static generationStepLabel(label: string) {
    if (label === 'idphoto-white-1024') return '生成图片'
    if (label === 'portrait-white-1024') return '生成第1张'
    if (label === 'portrait-front-upper-body-1200x1800') return '生成第2张'
    if (label === 'portrait-side-shoulder-upper-body-1200x1800') return '生成第3张'
    return '生成图片'
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

  private static async persistOutputPhoto(temporaryUrl: string, task: InternalPhotoGenerationRow, label: string): Promise<string> {
    const image = await this.loadImageFromUrl(temporaryUrl, 'image/jpeg')
    const extension = this.extensionForContentType(image.contentType)
    const safeStyleId = this.safeStorageSegment(label || task.style_id || task.style_name || 'internal')
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
