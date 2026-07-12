import { supabaseAdmin } from '@backend/config/supabase'
import { BackgroundRemovalService } from './background-removal.service'

type InternalBackgroundRemovalStatus = 'processing' | 'completed' | 'failed'

type InternalBackgroundRemovalRow = {
  id: string
  status: InternalBackgroundRemovalStatus
  input_photo: string
  prepared_input_photo: string | null
  output_photo: string | null
  progress: number
  current_step: string | null
  client_task_id: string | null
  error_message: string | null
  model: string | null
  metrics: Record<string, unknown> | null
  metadata: Record<string, unknown> | null
}

export type CreateInternalBackgroundRemovalInput = {
  imageUrl: string
  clientTaskId?: string
  metadata?: Record<string, unknown>
}

type InternalBackgroundRemovalResponse = {
  id: string
  status: InternalBackgroundRemovalStatus
  progress: number
  currentStep: string
  outputUrl: string | null
  reused?: boolean
}

type StoredImage = {
  path: string
  publicUrl: string | null
}

const OUTPUT_PHOTOS_BUCKET = 'output-photos'

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 30000): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timeoutId)
  }
}

export class InternalBackgroundRemovalService {
  static async createTask(input: CreateInternalBackgroundRemovalInput): Promise<InternalBackgroundRemovalResponse> {
    const imageUrl = input.imageUrl.trim()
    this.validateInputImageReference(imageUrl)

    if (input.clientTaskId) {
      const existing = await this.findByClientTaskId(input.clientTaskId)
      if (existing) return this.toResponse(existing, true)
    }

    const { data, error } = await supabaseAdmin
      .from('internal_background_removals')
      .insert({
        status: 'processing',
        input_photo: imageUrl,
        progress: 0,
        current_step: 'Initializing internal background removal...',
        client_task_id: input.clientTaskId || null,
        model: BackgroundRemovalService.modelName,
        metadata: input.metadata || {},
        started_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return this.toResponse(data as InternalBackgroundRemovalRow)
  }

  static async getTask(taskId: string): Promise<InternalBackgroundRemovalRow | null> {
    const { data, error } = await supabaseAdmin
      .from('internal_background_removals')
      .select('*')
      .eq('id', taskId)
      .maybeSingle()

    if (error) throw error
    return data as InternalBackgroundRemovalRow | null
  }

  static async processTask(taskId: string): Promise<void> {
    const task = await this.getTask(taskId)
    if (!task) throw new Error('Internal background removal task not found')

    await this.updateTask(taskId, {
      status: 'processing',
      progress: 10,
      current_step: 'Preparing image for background removal...',
      started_at: new Date().toISOString(),
    })

    try {
      const preparedInputUrl = await this.prepareInputPhoto(task)
      await this.updateTask(taskId, {
        prepared_input_photo: preparedInputUrl,
        progress: 30,
        current_step: 'Removing background and generating transparent PNG...',
      })

      const removalResult = await BackgroundRemovalService.removeBackground(preparedInputUrl, `internal-background-removal:${task.id}`)
      const outputUrl = await this.persistOutputPng(removalResult.outputUrl, task)

      await this.updateTask(taskId, {
        status: 'completed',
        progress: 100,
        current_step: 'Transparent PNG is ready.',
        output_photo: outputUrl,
        metrics: removalResult.metrics || {},
        completed_at: new Date().toISOString(),
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal background removal failed'
      await this.updateTask(taskId, {
        status: 'failed',
        progress: 0,
        current_step: 'Internal background removal failed.',
        error_message: message,
      })
      throw error
    }
  }

  static toResponse(task: InternalBackgroundRemovalRow, reused = false): InternalBackgroundRemovalResponse {
    return {
      id: task.id,
      status: task.status,
      progress: task.progress || 0,
      currentStep: task.current_step || 'Processing internal background removal...',
      outputUrl: task.output_photo || null,
      reused,
    }
  }

  private static async findByClientTaskId(clientTaskId: string): Promise<InternalBackgroundRemovalRow | null> {
    const { data, error } = await supabaseAdmin
      .from('internal_background_removals')
      .select('*')
      .eq('client_task_id', clientTaskId)
      .maybeSingle()

    if (error) throw error
    return data as InternalBackgroundRemovalRow | null
  }

  private static async updateTask(taskId: string, updates: Record<string, unknown>): Promise<void> {
    const { error } = await supabaseAdmin
      .from('internal_background_removals')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', taskId)

    if (error) throw error
  }

  private static validateInputImageReference(imageUrl: string): void {
    if (imageUrl.startsWith('data:image/')) return
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return
    throw new Error('imageUrl must be an http(s) URL or a data:image/... base64 URL')
  }

  private static async prepareInputPhoto(task: InternalBackgroundRemovalRow): Promise<string> {
    this.validateInputImageReference(task.input_photo)

    if (task.input_photo.startsWith('http://') || task.input_photo.startsWith('https://')) {
      return task.input_photo
    }

    const image = this.loadDataUrlImage(task.input_photo, 'image/png')
    const extension = this.extensionForContentType(image.contentType)
    const objectPath = [
      'internal-background-removals',
      this.safeStorageSegment(task.id),
      `input.${extension}`,
    ].join('/')

    const storedImage = await this.storeImage(task.input_photo, image, {
      bucket: OUTPUT_PHOTOS_BUCKET,
      path: objectPath,
      public: true,
    })

    if (!storedImage.publicUrl) throw new Error('Failed to create public URL for internal background removal input')
    return storedImage.publicUrl
  }

  private static async persistOutputPng(temporaryUrl: string, task: InternalBackgroundRemovalRow): Promise<string> {
    const image = await this.loadImageFromUrl(temporaryUrl, 'image/png')
    const objectPath = [
      'internal-background-removals',
      this.safeStorageSegment(task.id),
      'transparent.png',
    ].join('/')

    const storedImage = await this.storeImage(temporaryUrl, image, {
      bucket: OUTPUT_PHOTOS_BUCKET,
      path: objectPath,
      public: true,
    })

    if (!storedImage.publicUrl) throw new Error('Failed to create public URL for transparent PNG output')
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
    if (normalized === 'image/jpeg') return 'jpg'
    if (normalized === 'image/webp') return 'webp'
    return 'png'
  }

  private static safeStorageSegment(value: string): string {
    return value.replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'unknown'
  }
}
