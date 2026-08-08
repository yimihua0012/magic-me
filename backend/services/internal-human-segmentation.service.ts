import crypto from 'crypto'
import JSZip from 'jszip'
import sharp from 'sharp'
import { supabaseAdmin } from '@backend/config/supabase'

type HumanSegmentationStatus = 'processing' | 'completed' | 'failed'
type HumanSegmentationType = 'base' | 'suit'
type CommonSize = 'one-inch' | 'small-two-inch' | 'two-inch'
type CommonBackground = 'white' | 'blue' | 'red'

type HumanSegmentationRow = {
  id: string
  orderid: string
  status: HumanSegmentationStatus
  input_photo: string
  prepared_input_photo: string | null
  request_config: HumanSegmentationRequestConfig
  output_urls: HumanSegmentationOutputs
  zip_url: string | null
  progress: number
  current_step: string | null
  error_message: string | null
  model: string | null
  metadata: Record<string, unknown>
}

type BaseSpec = {
  width: number
  height: number
  backgroundColor: string
}

type ClothingSpec = {
  type: string
  color: string
}

type CommonSpecs = {
  sizes: CommonSize[]
  backgrounds: CommonBackground[]
}

type HumanSegmentationRequestConfig = {
  types: HumanSegmentationType[]
  base: BaseSpec
  clothing?: ClothingSpec
  commonSpecs?: CommonSpecs
}

export type CreateHumanSegmentationInput = {
  imageUrl: string
  orderid: string
  types: HumanSegmentationType[]
  base?: Partial<BaseSpec>
  clothing?: Partial<ClothingSpec>
  commonSpecs?: {
    sizes?: unknown
    backgrounds?: unknown
  }
  metadata?: Record<string, unknown>
}

type StoredFile = {
  filename: string
  publicUrl: string
  data: Buffer
  contentType: string
}

type HumanSegmentationOutputs = {
  base?: PipelineOutput
  suit?: PipelineOutput
}

type PipelineOutput = {
  custom?: string
  common?: Record<string, Record<string, string>>
}

const OUTPUT_BUCKET = 'output-photos'
const LARGE_SIZE = 1024
const SUBJECT_ALPHA_THRESHOLD = 24
const POLL_INTERVAL_MS = 5000
const GENERATION_ATTEMPTS = 3
const DEFAULT_BASE: BaseSpec = { width: 295, height: 413, backgroundColor: '#438edb' }
const PHOTO_SIZES: Record<CommonSize, { width: number; height: number; topMarginRatio: number }> = {
  'one-inch': { width: 295, height: 413, topMarginRatio: 0.08 },
  'small-two-inch': { width: 413, height: 531, topMarginRatio: 0.08 },
  'two-inch': { width: 413, height: 579, topMarginRatio: 0.08 },
}
const BACKGROUNDS: Record<CommonBackground, string> = {
  white: '#ffffff',
  blue: '#438edb',
  red: '#d62828',
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

export class InternalHumanSegmentationService {
  static async createTask(input: CreateHumanSegmentationInput) {
    const imageUrl = input.imageUrl.trim()
    const orderid = input.orderid.trim()
    const requestConfig = this.normalizeRequest(input)

    if (!imageUrl) throw new Error('imageUrl is required')
    if (!orderid) throw new Error('orderid is required')
    this.validateImageReference(imageUrl)

    const { data, error } = await supabaseAdmin
      .from('internal_human_segmentation_tasks')
      .insert({
        orderid,
        status: 'processing',
        input_photo: imageUrl,
        request_config: requestConfig,
        output_urls: {},
        zip_url: null,
        progress: 0,
        current_step: '任务已创建',
        error_message: null,
        model: this.segmentationModelName(),
        metadata: input.metadata || {},
        started_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return this.toResponse(data as HumanSegmentationRow)
  }

  static async getTask(taskId: string): Promise<HumanSegmentationRow | null> {
    const { data, error } = await supabaseAdmin
      .from('internal_human_segmentation_tasks')
      .select('*')
      .eq('id', taskId)
      .maybeSingle()

    if (error) throw new Error(error.message)
    return data as HumanSegmentationRow | null
  }

  static async processTask(taskId: string): Promise<void> {
    const task = await this.getTask(taskId)
    if (!task) throw new Error('Human segmentation task not found')

    const storedFiles: StoredFile[] = []
    const outputs: HumanSegmentationOutputs = {}

    try {
      await this.updateTask(task.id, { status: 'processing', progress: 10, current_step: '正在准备图片...' })
      const preparedInputUrl = await this.prepareInputImage(task.input_photo, task, 'input')
      await this.updateTask(task.id, { prepared_input_photo: preparedInputUrl, progress: 20, current_step: '正在进行人体分割...' })

      if (task.request_config.types.includes('base')) {
        outputs.base = await this.runOutputPipeline({
          task,
          sourceImageUrl: preparedInputUrl,
          storedFiles,
          group: 'base',
          startProgress: 25,
        })
      }

      if (task.request_config.types.includes('suit')) {
        await this.updateTask(task.id, { progress: 50, current_step: '正在生成换装照片...' })
        const generatedPhotoUrl = await this.generateSuitPhoto(task, preparedInputUrl)
        outputs.suit = await this.runOutputPipeline({
          task,
          sourceImageUrl: generatedPhotoUrl,
          storedFiles,
          group: 'suit',
          startProgress: 65,
        })
      }

      let zipUrl: string | null = null
      if (storedFiles.length > 1) {
        await this.updateTask(task.id, { progress: 90, current_step: '正在打包结果...' })
        zipUrl = await this.createAndStoreZip(task, storedFiles)
      }

      await this.updateTask(task.id, {
        status: 'completed',
        progress: 100,
        current_step: '处理完成',
        output_urls: outputs,
        zip_url: zipUrl,
        completed_at: new Date().toISOString(),
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Human segmentation failed'
      await this.updateTask(task.id, {
        status: 'failed',
        progress: 0,
        current_step: '处理失败',
        error_message: message,
      })
      throw error
    }
  }

  static toResponse(task: HumanSegmentationRow) {
    return {
      taskId: task.id,
      orderid: task.orderid,
      status: task.status,
      progress: task.progress || 0,
      currentStep: task.current_step || '处理中',
      outputUrls: task.output_urls || {},
      zipUrl: task.zip_url,
      error: task.error_message,
    }
  }

  private static normalizeRequest(input: CreateHumanSegmentationInput): HumanSegmentationRequestConfig {
    const types = Array.from(new Set(input.types)).filter((type): type is HumanSegmentationType => type === 'base' || type === 'suit')
    if (types.length === 0) throw new Error('types must include base and/or suit')

    const width = Number(input.base?.width || DEFAULT_BASE.width)
    const height = Number(input.base?.height || DEFAULT_BASE.height)
    const backgroundColor = typeof input.base?.backgroundColor === 'string' && this.isHexColor(input.base.backgroundColor)
      ? input.base.backgroundColor
      : DEFAULT_BASE.backgroundColor

    if (!Number.isInteger(width) || width < 64 || width > 4096) throw new Error('base.width must be an integer between 64 and 4096')
    if (!Number.isInteger(height) || height < 64 || height > 4096) throw new Error('base.height must be an integer between 64 and 4096')

    const commonSizes = Array.isArray(input.commonSpecs?.sizes)
      ? input.commonSpecs.sizes.filter((size): size is CommonSize => size === 'one-inch' || size === 'small-two-inch' || size === 'two-inch')
      : []
    const commonBackgrounds = Array.isArray(input.commonSpecs?.backgrounds)
      ? input.commonSpecs.backgrounds.filter((bg): bg is CommonBackground => bg === 'white' || bg === 'blue' || bg === 'red')
      : []

    return {
      types,
      base: { width, height, backgroundColor },
      clothing: types.includes('suit')
        ? {
            type: typeof input.clothing?.type === 'string' && input.clothing.type.trim() ? input.clothing.type.trim() : 'suit',
            color: typeof input.clothing?.color === 'string' && this.isHexColor(input.clothing.color) ? input.clothing.color : '#111827',
          }
        : undefined,
      commonSpecs: commonSizes.length > 0 && commonBackgrounds.length > 0
        ? { sizes: Array.from(new Set(commonSizes)), backgrounds: Array.from(new Set(commonBackgrounds)) }
        : undefined,
    }
  }

  private static async runOutputPipeline(input: {
    task: HumanSegmentationRow
    sourceImageUrl: string
    storedFiles: StoredFile[]
    group: HumanSegmentationType
    startProgress: number
  }): Promise<PipelineOutput> {
    const { task, sourceImageUrl, storedFiles, group } = input
    const output: PipelineOutput = {}

    await this.updateTask(task.id, { progress: input.startProgress, current_step: group === 'base' ? '正在生成透明PNG...' : '正在分割换装照片...' })
    const transparentTemporaryUrl = await this.segmentHuman(sourceImageUrl)
    const transparentImage = await this.downloadImage(transparentTemporaryUrl, 'image/png')

    await this.updateTask(task.id, { progress: input.startProgress + 10, current_step: group === 'base' ? '正在裁剪基础照片...' : '正在裁剪换装照片...' })
    const custom = await this.compositeBackground(transparentImage.data, task.request_config.base.backgroundColor, task.request_config.base.width, task.request_config.base.height, 0.08)
    const customFile = await this.storeBuffer(task, custom, `${group}/base-${task.request_config.base.width}x${task.request_config.base.height}.jpg`, 'image/jpeg')
    storedFiles.push(customFile)
    output.custom = customFile.publicUrl

    if (task.request_config.commonSpecs) {
      output.common = {}
      for (const background of task.request_config.commonSpecs.backgrounds) {
        output.common[background] = {}
        for (const size of task.request_config.commonSpecs.sizes) {
          const spec = PHOTO_SIZES[size]
          const buffer = await this.compositeBackground(transparentImage.data, BACKGROUNDS[background], spec.width, spec.height, spec.topMarginRatio)
          const file = await this.storeBuffer(task, buffer, `${group}/common/${background}-${size}.jpg`, 'image/jpeg')
          storedFiles.push(file)
          output.common[background][size] = file.publicUrl
        }
      }
    }

    return output
  }

  private static async segmentHuman(imageUrl: string): Promise<string> {
    const accessKeyId = process.env.ALIYUN_ACCESS_KEY_ID || process.env.ALIBABA_CLOUD_ACCESS_KEY_ID
    const accessKeySecret = process.env.ALIYUN_ACCESS_KEY_SECRET || process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET
    if (!accessKeyId || !accessKeySecret) throw new Error('ALIYUN_ACCESS_KEY_ID and ALIYUN_ACCESS_KEY_SECRET are required')

    const endpoint = process.env.ALIYUN_HUMAN_SEGMENTATION_ENDPOINT || 'https://imageseg.cn-shanghai.aliyuncs.com'
    const action = process.env.ALIYUN_HUMAN_SEGMENTATION_ACTION || 'SegmentHDBody'
    const version = process.env.ALIYUN_HUMAN_SEGMENTATION_VERSION || '2019-12-30'
    const imageParamName = process.env.ALIYUN_HUMAN_SEGMENTATION_IMAGE_PARAM || 'ImageURL'
    const params: Record<string, string> = {
      Action: action,
      Version: version,
      Format: 'JSON',
      AccessKeyId: accessKeyId,
      SignatureMethod: 'HMAC-SHA1',
      SignatureVersion: '1.0',
      SignatureNonce: crypto.randomUUID(),
      Timestamp: new Date().toISOString(),
      [imageParamName]: imageUrl,
    }
    params.Signature = this.signAliyunRpc(params, accessKeySecret)

    const url = `${endpoint}?${this.canonicalQuery(params)}`
    const response = await fetchWithTimeout(url, {}, 45000)
    const data = await response.json()
    if (!response.ok || data.Code || data.Message?.includes('error')) {
      throw new Error(`Aliyun human segmentation failed: ${data.Message || data.Code || response.status}`)
    }

    const outputUrl = data?.Data?.ImageURL || data?.Data?.ImageUrl || data?.Data?.ResultImageURL || data?.ImageURL || data?.ImageUrl
    if (typeof outputUrl !== 'string' || !outputUrl.trim()) {
      throw new Error('Aliyun human segmentation returned no PNG URL')
    }
    return outputUrl.trim()
  }

  private static async generateSuitPhoto(task: HumanSegmentationRow, imageUrl: string): Promise<string> {
    const replicateApiKey = process.env.REPLICATE_API_KEY
    if (!replicateApiKey) throw new Error('REPLICATE_API_KEY is required for suit processing')

    const modelName = process.env.REPLICATE_MODEL_NAME || 'google/nano-banana-2'
    const prompt = this.buildSuitPrompt(task.request_config.clothing)
    const negativePrompt = 'low quality, blurry, distorted face, changed identity, different person, cartoon, illustration, collage, grid, multiple people, watermark, text, logo, cropped head, missing shoulders, busy background, colored background'

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
                prompt,
                negative_prompt: negativePrompt,
                image_input: [imageUrl],
                aspect_ratio: '1:1',
                output_format: 'jpg',
              },
            }),
          },
          30000,
        )

        const prediction = await response.json()
        if (!response.ok || prediction.error) throw new Error(`Replicate request failed: ${prediction.error || prediction.detail || response.status}`)

        let result = prediction
        let pollCount = 0
        while (result.status !== 'succeeded' && result.status !== 'failed') {
          pollCount += 1
          if (pollCount > 60) throw new Error('Replicate prediction timed out')
          await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS))
          const statusResponse = await fetchWithTimeout(`https://api.replicate.com/v1/predictions/${result.id}`, {
            headers: { 'Authorization': `Bearer ${replicateApiKey}` },
          }, 15000)
          result = await statusResponse.json()
          if (!statusResponse.ok || result.error) throw new Error(`Replicate polling failed: ${result.error || statusResponse.status}`)
        }

        if (result.status === 'failed') throw new Error(`Replicate prediction failed: ${result.error || 'Prediction failed'}`)
        const temporaryUrl = this.extractGeneratedOutputUrl(result.output)
        if (!temporaryUrl) throw new Error('Replicate prediction returned no output URL')

        const image = await this.downloadImage(temporaryUrl, 'image/jpeg')
        const file = await this.storeBuffer(task, image.data, 'suit/generated-suit-photo.jpg', image.contentType)
        return file.publicUrl
      } catch (error) {
        if (attempt >= GENERATION_ATTEMPTS) throw error
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
      }
    }

    throw new Error('Suit generation attempts exhausted')
  }

  private static buildSuitPrompt(clothing?: ClothingSpec): string {
    const clothingType = clothing?.type || 'suit'
    const colorName = this.colorToPromptName(clothing?.color || '#111827')
    return [
      'Create one realistic professional ID photo portrait from the reference image.',
      'Keep the same person, same facial structure, skin tone, age appearance, and natural likeness.',
      `Change the clothing to a clean ${colorName} ${clothingType} with a simple professional shirt.`,
      'Front-facing head and shoulders, both shoulders level, neutral professional expression.',
      'Pure white studio background, even lighting, sharp focus, natural skin texture.',
      'Single full-frame portrait only, not a collage, not a grid, no extra people.',
      '1024x1024 square output suitable for ID photo processing.',
    ].join(' ')
  }

  private static colorToPromptName(hex: string): string {
    const normalized = hex.toLowerCase()
    if (normalized === '#111827' || normalized === '#000000') return 'black'
    if (normalized === '#1e3a8a' || normalized === '#1d4ed8') return 'navy blue'
    if (normalized === '#374151' || normalized === '#4b5563') return 'dark gray'
    if (normalized === '#ffffff') return 'white'
    return normalized
  }

  private static async compositeBackground(transparentBuffer: Buffer, color: string, width: number, height: number, topMarginRatio: number) {
    const fittedSubject = await this.fitSubjectToCanvas(transparentBuffer, width, height, topMarginRatio)
    return await sharp({
      create: {
        width,
        height,
        channels: 3,
        background: color,
      },
    })
      .composite([{ input: fittedSubject.input, left: fittedSubject.left, top: fittedSubject.top }])
      .jpeg({ quality: 95 })
      .toBuffer()
  }

  private static async fitSubjectToCanvas(transparentBuffer: Buffer, canvasWidth: number, canvasHeight: number, topMarginRatio: number) {
    const subject = await this.extractSubjectBounds(transparentBuffer)
    const metadata = await sharp(subject).metadata()
    const sourceWidth = metadata.width || canvasWidth
    const sourceHeight = metadata.height || canvasHeight
    const topMargin = Math.max(0, Math.round(canvasHeight * topMarginRatio))
    const targetHeight = Math.max(1, canvasHeight - topMargin)
    const targetWidth = Math.round(sourceWidth * (targetHeight / sourceHeight))
    let resized = await sharp(subject).resize(targetWidth, targetHeight, { fit: 'contain' }).png().toBuffer()
    let outputWidth = targetWidth

    if (targetWidth > canvasWidth) {
      const cropLeft = Math.max(0, Math.floor((targetWidth - canvasWidth) / 2))
      resized = await sharp(resized).extract({ left: cropLeft, top: 0, width: canvasWidth, height: targetHeight }).png().toBuffer()
      outputWidth = canvasWidth
    }

    return {
      input: resized,
      left: Math.max(0, Math.round((canvasWidth - outputWidth) / 2)),
      top: Math.max(0, canvasHeight - targetHeight),
    }
  }

  private static async extractSubjectBounds(transparentBuffer: Buffer) {
    const { data, info } = await sharp(transparentBuffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
    let left = info.width
    let top = info.height
    let right = -1
    let bottom = -1

    for (let y = 0; y < info.height; y += 1) {
      for (let x = 0; x < info.width; x += 1) {
        const alpha = data[(y * info.width + x) * info.channels + 3]
        if (alpha < SUBJECT_ALPHA_THRESHOLD) continue
        if (x < left) left = x
        if (x > right) right = x
        if (y < top) top = y
        if (y > bottom) bottom = y
      }
    }

    if (right < left || bottom < top) return await sharp(transparentBuffer).ensureAlpha().png().toBuffer()
    const padding = 2
    return await sharp(transparentBuffer)
      .ensureAlpha()
      .extract({
        left: Math.max(0, left - padding),
        top: Math.max(0, top - padding),
        width: Math.min(info.width - 1, right + padding) - Math.max(0, left - padding) + 1,
        height: Math.min(info.height - 1, bottom + padding) - Math.max(0, top - padding) + 1,
      })
      .png()
      .toBuffer()
  }

  private static async prepareInputImage(imageUrl: string, task: HumanSegmentationRow, filename: string): Promise<string> {
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl
    const image = this.loadDataUrlImage(imageUrl, 'image/png')
    const extension = this.extensionForContentType(image.contentType)
    const file = await this.storeBuffer(task, image.data, `inputs/${filename}.${extension}`, image.contentType)
    return file.publicUrl
  }

  private static async downloadImage(imageUrl: string, fallbackContentType: string): Promise<{ contentType: string; data: Buffer }> {
    if (imageUrl.startsWith('data:')) return this.loadDataUrlImage(imageUrl, fallbackContentType)
    const response = await fetchWithTimeout(imageUrl, {}, 30000)
    if (!response.ok) throw new Error(`Failed to download image: ${response.status}`)
    const contentType = response.headers.get('content-type') || fallbackContentType
    if (!contentType.startsWith('image/')) throw new Error(`Downloaded file is not an image: ${contentType}`)
    return { contentType, data: Buffer.from(await response.arrayBuffer()) }
  }

  private static async createAndStoreZip(task: HumanSegmentationRow, files: StoredFile[]) {
    const zip = new JSZip()
    files.forEach(file => zip.file(file.filename, file.data))
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })
    const file = await this.storeBuffer(task, zipBuffer, 'package/human-segmentation-results.zip', 'application/zip')
    return file.publicUrl
  }

  private static async storeBuffer(task: HumanSegmentationRow, data: Buffer, filename: string, contentType: string): Promise<StoredFile> {
    const objectPath = ['internal-human-segmentation', this.safeStorageSegment(task.orderid), this.safeStorageSegment(task.id), filename].join('/')
    const { error } = await supabaseAdmin.storage.from(OUTPUT_BUCKET).upload(objectPath, data, { contentType, upsert: true })
    if (error) throw new Error(`Failed to upload processed file ${objectPath}: ${error.message}`)
    const { data: publicData } = supabaseAdmin.storage.from(OUTPUT_BUCKET).getPublicUrl(objectPath)
    return { filename, publicUrl: publicData.publicUrl, data, contentType }
  }

  private static async updateTask(taskId: string, updates: Record<string, unknown>) {
    const { error } = await supabaseAdmin
      .from('internal_human_segmentation_tasks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', taskId)
    if (error) throw new Error(error.message)
  }

  private static signAliyunRpc(params: Record<string, string>, accessKeySecret: string): string {
    const canonicalizedQuery = this.canonicalQuery(params)
    const stringToSign = `GET&%2F&${this.percentEncode(canonicalizedQuery)}`
    return crypto.createHmac('sha1', `${accessKeySecret}&`).update(stringToSign).digest('base64')
  }

  private static canonicalQuery(params: Record<string, string>): string {
    return Object.keys(params)
      .sort()
      .map(key => `${this.percentEncode(key)}=${this.percentEncode(params[key])}`)
      .join('&')
  }

  private static percentEncode(value: string): string {
    return encodeURIComponent(value)
      .replace(/\+/g, '%20')
      .replace(/\*/g, '%2A')
      .replace(/%7E/g, '~')
  }

  private static extractGeneratedOutputUrl(output: unknown): string | null {
    if (typeof output === 'string') return output
    if (Array.isArray(output)) {
      for (const item of output) {
        if (typeof item === 'string') return item
        if (item && typeof item === 'object' && typeof (item as { url?: unknown }).url === 'string') return (item as { url: string }).url
      }
    }
    if (output && typeof output === 'object' && typeof (output as { url?: unknown }).url === 'string') return (output as { url: string }).url
    return null
  }

  private static loadDataUrlImage(dataUrl: string, fallbackContentType: string): { contentType: string; data: Buffer } {
    const match = dataUrl.match(/^data:([^;,]+)?(;base64)?,(.*)$/)
    if (!match) throw new Error('Invalid data URL image')
    const contentType = match[1] || fallbackContentType
    if (!contentType.startsWith('image/')) throw new Error(`Data URL is not an image: ${contentType}`)
    const payload = match[3] || ''
    const data = match[2] ? Buffer.from(payload, 'base64') : Buffer.from(decodeURIComponent(payload), 'utf8')
    return { contentType, data }
  }

  private static validateImageReference(imageUrl: string): void {
    if (imageUrl.startsWith('data:image/')) return
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return
    throw new Error('imageUrl must be an http(s) URL or a data:image/... base64 URL')
  }

  private static extensionForContentType(contentType: string): string {
    const normalized = contentType.split(';')[0].trim().toLowerCase()
    if (normalized === 'image/jpeg') return 'jpg'
    if (normalized === 'image/webp') return 'webp'
    return 'png'
  }

  private static isHexColor(value: string): boolean {
    return /^#[0-9a-fA-F]{6}$/.test(value.trim())
  }

  private static safeStorageSegment(value: string): string {
    return value.replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'unknown'
  }

  private static segmentationModelName(): string {
    return process.env.ALIYUN_HUMAN_SEGMENTATION_ACTION || 'SegmentHDBody'
  }
}
