import JSZip from 'jszip'
import sharp, { type OverlayOptions } from 'sharp'
import { supabaseAdmin } from '@backend/config/supabase'
import { BackgroundRemovalService } from './background-removal.service'

type ProcessType = 'idphoto' | 'portrait'
type ProcessStatus = 'processing' | 'completed' | 'failed'

type ProcessRow = {
  id: string
  openid: string
  orderid: string
  type: ProcessType
  source_task_id: string | null
  suit_color: string | null
  input_urls: string[]
  status: ProcessStatus
  progress: number
  current_step: string | null
  preview_urls: string[]
  id_photo_urls: Record<string, unknown>
  layout_urls: Record<string, unknown>
  zip_url: string | null
  error_message: string | null
  metadata: Record<string, unknown>
}

export type CreatePhotoProcessInput = {
  openid: string
  orderid: string
  type: ProcessType
  taskId?: string
  suitColor?: string
  outputUrls: string[]
  metadata?: Record<string, unknown>
}

type StoredFile = {
  path: string
  publicUrl: string
  filename: string
  data: Buffer
  contentType: string
}

type ProcessOutput = {
  outputUrls: string[]
  idPhotoUrls: Record<string, Record<string, string>>
  layoutUrls: Record<string, Record<string, string>>
  portraitUrls?: Record<string, string>
  zipUrl: string
}

const OUTPUT_BUCKET = 'output-photos'
const DPI = 300
const LARGE_SIZE = 1024
const SUBJECT_ALPHA_THRESHOLD = 24
const PAPER_4X6 = { width: 1800, height: 1200 }
const PRINT_LAYOUT_GAP = 24
const BACKGROUNDS = {
  white: { label: 'white', color: '#ffffff' },
  blue: { label: 'blue', color: '#438edb' },
  red: { label: 'red', color: '#d62828' },
} as const
const PHOTO_SIZES = {
  oneInch: { label: 'one-inch', width: 295, height: 413, topMarginRatio: 0.08 },
  smallTwoInch: { label: 'small-two-inch', width: 413, height: 531, topMarginRatio: 0.08 },
  twoInch: { label: 'two-inch', width: 413, height: 579, topMarginRatio: 0.08 },
} as const
type PhotoSizeSpec = typeof PHOTO_SIZES[keyof typeof PHOTO_SIZES]

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 30000): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timeoutId)
  }
}

export class PhotoProcessResultService {
  static async createTask(input: CreatePhotoProcessInput) {
    const openid = input.openid.trim()
    const orderid = input.orderid.trim()
    const outputUrls = input.outputUrls.map(url => url.trim()).filter(Boolean)

    if (!openid) throw new Error('openid is required')
    if (!orderid) throw new Error('orderid is required')
    if (input.type !== 'idphoto' && input.type !== 'portrait') throw new Error('type must be idphoto or portrait')
    if (outputUrls.length === 0) throw new Error('outputUrls is required')
    outputUrls.forEach((url) => this.validateImageReference(url))

    const { data, error } = await supabaseAdmin
      .from('photo_process_results')
      .upsert({
        openid,
        orderid,
        type: input.type,
        source_task_id: input.taskId || null,
        suit_color: input.suitColor || null,
        input_urls: outputUrls,
        status: 'processing',
        progress: 0,
        current_step: '后处理任务已创建，等待处理...',
        preview_urls: [],
        id_photo_urls: {},
        layout_urls: {},
        zip_url: null,
        error_message: null,
        metadata: input.metadata || {},
        started_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'orderid,type' })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return this.toResponse(data as ProcessRow)
  }

  static async getTask(taskId: string): Promise<ProcessRow | null> {
    const { data, error } = await supabaseAdmin
      .from('photo_process_results')
      .select('*')
      .eq('id', taskId)
      .maybeSingle()

    if (error) throw new Error(error.message)
    return data as ProcessRow | null
  }

  static async processTask(taskId: string): Promise<void> {
    const task = await this.getTask(taskId)
    if (!task) throw new Error('Photo process task not found')

    try {
      await this.updateTask(taskId, { status: 'processing', progress: 10, current_step: '正在准备1024白底图...' })
      const output = await this.buildOutputs(task)
      await this.updateTask(taskId, {
        status: 'completed',
        progress: 100,
        current_step: '裁剪、换底、排版、打包已完成。',
        preview_urls: output.outputUrls,
        id_photo_urls: output.idPhotoUrls,
        layout_urls: output.layoutUrls,
        zip_url: output.zipUrl,
        completed_at: new Date().toISOString(),
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : '后处理失败'
      await this.updateTask(taskId, {
        status: 'failed',
        progress: 0,
        current_step: '后处理失败。',
        error_message: message,
      })
      throw error
    }
  }

  static toResponse(task: ProcessRow) {
    return {
      taskId: task.id,
      status: task.status,
      progress: task.progress,
      currentStep: task.current_step,
      outputUrls: this.collectOutputUrls(task),
      zipUrl: task.zip_url,
      error: task.error_message,
    }
  }

  private static async buildOutputs(task: ProcessRow): Promise<ProcessOutput> {
    const storedFiles: StoredFile[] = []
    const idPhotoUrls: Record<string, Record<string, string>> = {}
    const layoutUrls: Record<string, Record<string, string>> = {}
    const avatarWhiteUrl = task.input_urls[0]
    const transparentUrl = await this.createTransparentPng(avatarWhiteUrl, task)

    await this.updateTask(task.id, { progress: 35, current_step: '正在生成白底、蓝底、红底大图和小图...' })
    const transparentImage = await this.downloadImage(transparentUrl)
    const transparentSizeBuffers: Record<string, Buffer> = {}
    const largeTransparent = await this.createTransparentCanvas(transparentImage.data, LARGE_SIZE, LARGE_SIZE, {
      topMarginRatio: 0.08,
    })
    const largeTransparentFile = await this.storeBuffer(task, largeTransparent, 'transparent/large-transparent.png', 'image/png')
    storedFiles.push(largeTransparentFile)
    idPhotoUrls.transparent = { large: largeTransparentFile.publicUrl }

    for (const spec of Object.values(PHOTO_SIZES)) {
      const transparentSize = await this.createTransparentCanvas(transparentImage.data, spec.width, spec.height, {
        topMarginRatio: spec.topMarginRatio,
      })
      transparentSizeBuffers[spec.label] = transparentSize
      const file = await this.storeBuffer(task, transparentSize, `transparent/${spec.label}-transparent.png`, 'image/png')
      storedFiles.push(file)
      idPhotoUrls.transparent[spec.label] = file.publicUrl
    }

    for (const [backgroundKey, background] of Object.entries(BACKGROUNDS)) {
      idPhotoUrls[backgroundKey] = {}
      layoutUrls[backgroundKey] = {}
      const largeBuffer = await this.compositeBackground(transparentImage.data, background.color, LARGE_SIZE, LARGE_SIZE, {
        topMarginRatio: 0.08,
      })
      const largeFile = await this.storeBuffer(task, largeBuffer, `${background.label}/large-${background.label}.jpg`, 'image/jpeg')
      storedFiles.push(largeFile)
      idPhotoUrls[backgroundKey].large = largeFile.publicUrl

      for (const spec of Object.values(PHOTO_SIZES)) {
        const resized = await this.compositePreparedTransparent(transparentSizeBuffers[spec.label], background.color)
        const file = await this.storeBuffer(task, resized, `${background.label}/${spec.label}-${background.label}.jpg`, 'image/jpeg')
        storedFiles.push(file)
        idPhotoUrls[backgroundKey][spec.label] = file.publicUrl

        const layout = await this.createPrintLayout(transparentSizeBuffers[spec.label], background.color, spec)
        const layoutFile = await this.storeBuffer(task, layout, `${background.label}/layout-4x6-${spec.label}-${background.label}.jpg`, 'image/jpeg')
        storedFiles.push(layoutFile)
        layoutUrls[backgroundKey][spec.label] = layoutFile.publicUrl
      }
    }

    let portraitUrls: Record<string, string> | undefined
    if (task.type === 'portrait') {
      portraitUrls = await this.addPortraitExtras(task, storedFiles)
      idPhotoUrls.portrait = portraitUrls
    }

    await this.updateTask(task.id, { progress: 85, current_step: '正在打包ZIP文件...' })
    const zipUrl = await this.createAndStoreZip(task, storedFiles)
    return {
      outputUrls: [
        idPhotoUrls.white.large,
        idPhotoUrls.blue.large,
        idPhotoUrls.red.large,
        portraitUrls?.['front-upper-body'],
        portraitUrls?.['side-shoulder-upper-body'],
      ].filter((url): url is string => typeof url === 'string' && url.trim().length > 0),
      idPhotoUrls,
      layoutUrls,
      portraitUrls,
      zipUrl,
    }
  }

  private static async createTransparentPng(imageUrl: string, task: ProcessRow) {
    this.validateImageReference(imageUrl)
    const preparedUrl = await this.prepareInputImage(imageUrl, task, 'source-white.jpg')
    await this.updateTask(task.id, { progress: 20, current_step: '正在移除背景并生成透明PNG...' })
    const result = await BackgroundRemovalService.removeBackground(preparedUrl, `photo-process:${task.id}`)
    return result.outputUrl
  }

  private static async prepareInputImage(imageUrl: string, task: ProcessRow, filename: string) {
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl
    const image = this.loadDataUrlImage(imageUrl, 'image/jpeg')
    const extension = this.extensionForContentType(image.contentType)
    const file = await this.storeBuffer(task, image.data, `inputs/${filename.replace(/\.[^.]+$/, '')}.${extension}`, image.contentType)
    return file.publicUrl
  }

  private static async compositeBackground(
    transparentBuffer: Buffer,
    color: string,
    width: number,
    height: number,
    options: { topMarginRatio: number }
  ) {
    const fittedSubject = await this.fitSubjectToIdCanvas(transparentBuffer, width, height, options)
    return await sharp({
      create: {
        width,
        height,
        channels: 3,
        background: color,
      },
    })
      .composite([{
        input: fittedSubject.input,
        left: fittedSubject.left,
        top: fittedSubject.top,
      }])
      .jpeg({ quality: 95 })
      .toBuffer()
  }

  private static async createTransparentCanvas(
    transparentBuffer: Buffer,
    width: number,
    height: number,
    options: { topMarginRatio: number }
  ) {
    const fittedSubject = await this.fitSubjectToIdCanvas(transparentBuffer, width, height, options)
    return await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([{
        input: fittedSubject.input,
        left: fittedSubject.left,
        top: fittedSubject.top,
      }])
      .png()
      .toBuffer()
  }

  private static async compositePreparedTransparent(transparentCanvas: Buffer, color: string) {
    const metadata = await sharp(transparentCanvas).metadata()
    const width = metadata.width || LARGE_SIZE
    const height = metadata.height || LARGE_SIZE

    return await sharp({
      create: {
        width,
        height,
        channels: 3,
        background: color,
      },
    })
      .composite([{ input: transparentCanvas, left: 0, top: 0 }])
      .jpeg({ quality: 95 })
      .toBuffer()
  }

  private static async createPrintLayout(transparentCanvas: Buffer, color: string, spec: PhotoSizeSpec) {
    const photo = await this.compositePreparedTransparent(transparentCanvas, color)
    const columns = Math.max(1, Math.floor((PAPER_4X6.width + PRINT_LAYOUT_GAP) / (spec.width + PRINT_LAYOUT_GAP)))
    const rows = Math.max(1, Math.floor((PAPER_4X6.height + PRINT_LAYOUT_GAP) / (spec.height + PRINT_LAYOUT_GAP)))
    const occupiedWidth = columns * spec.width + (columns - 1) * PRINT_LAYOUT_GAP
    const occupiedHeight = rows * spec.height + (rows - 1) * PRINT_LAYOUT_GAP
    const startX = Math.floor((PAPER_4X6.width - occupiedWidth) / 2)
    const startY = Math.floor((PAPER_4X6.height - occupiedHeight) / 2)
    const composites: OverlayOptions[] = []

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        composites.push({
          input: photo,
          left: startX + column * (spec.width + PRINT_LAYOUT_GAP),
          top: startY + row * (spec.height + PRINT_LAYOUT_GAP),
        })
      }
    }

    return await sharp({
      create: {
        width: PAPER_4X6.width,
        height: PAPER_4X6.height,
        channels: 3,
        background: '#ffffff',
      },
    })
      .composite(composites)
      .jpeg({ quality: 95 })
      .toBuffer()
  }

  private static async fitSubjectToIdCanvas(
    transparentBuffer: Buffer,
    canvasWidth: number,
    canvasHeight: number,
    options: { topMarginRatio: number }
  ) {
    const subject = await this.extractSignificantSubject(transparentBuffer)
    const metadata = await sharp(subject).metadata()
    const sourceWidth = metadata.width || canvasWidth
    const sourceHeight = metadata.height || canvasHeight
    const topMargin = Math.max(0, Math.round(canvasHeight * options.topMarginRatio))
    const targetHeight = Math.max(1, canvasHeight - topMargin)
    const targetWidth = Math.round(sourceWidth * (targetHeight / sourceHeight))
    let resized = await sharp(subject)
      .resize(targetWidth, targetHeight, { fit: 'contain' })
      .png()
      .toBuffer()

    let outputWidth = targetWidth
    if (targetWidth > canvasWidth) {
      const cropLeft = Math.max(0, Math.floor((targetWidth - canvasWidth) / 2))
      resized = await sharp(resized)
        .extract({ left: cropLeft, top: 0, width: canvasWidth, height: targetHeight })
        .png()
        .toBuffer()
      outputWidth = canvasWidth
    }

    const left = Math.max(0, Math.round((canvasWidth - outputWidth) / 2))
    const top = Math.max(0, canvasHeight - targetHeight)

    return {
      input: resized,
      left,
      top,
    }
  }

  private static async extractSignificantSubject(transparentBuffer: Buffer) {
    const image = sharp(transparentBuffer).ensureAlpha()
    const { data, info } = await image
      .raw()
      .toBuffer({ resolveWithObject: true })

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

    if (right < left || bottom < top) {
      return await sharp(transparentBuffer).ensureAlpha().png().toBuffer()
    }

    const padding = 2
    const cropLeft = Math.max(0, left - padding)
    const cropTop = Math.max(0, top - padding)
    const cropRight = Math.min(info.width - 1, right + padding)
    const cropBottom = Math.min(info.height - 1, bottom + padding)

    return await sharp(transparentBuffer)
      .ensureAlpha()
      .extract({
        left: cropLeft,
        top: cropTop,
        width: cropRight - cropLeft + 1,
        height: cropBottom - cropTop + 1,
      })
      .png()
      .toBuffer()
  }

  private static async addPortraitExtras(task: ProcessRow, storedFiles: StoredFile[]) {
    const portraitUrls: Record<string, string> = {}
    const extraUrls = task.input_urls.slice(1)
    for (let index = 0; index < extraUrls.length; index += 1) {
      const imageUrl = extraUrls[index]
      this.validateImageReference(imageUrl)
      const image = imageUrl.startsWith('data:')
        ? this.loadDataUrlImage(imageUrl, 'image/jpeg')
        : await this.downloadImage(imageUrl)
      const normalized = await sharp(image.data)
        .resize(1200, 1800, { fit: 'cover', position: 'centre' })
        .jpeg({ quality: 94 })
        .toBuffer()
      const label = index === 0 ? 'front-upper-body' : 'side-shoulder-upper-body'
      const file = await this.storeBuffer(task, normalized, `portrait/${label}.jpg`, 'image/jpeg')
      storedFiles.push(file)
      portraitUrls[label] = file.publicUrl
    }
    return portraitUrls
  }

  private static collectOutputUrls(task: ProcessRow) {
    const idPhotoUrls = (task.id_photo_urls || {}) as Record<string, Record<string, string>>
    const portraitUrls = (idPhotoUrls.portrait || {}) as Record<string, string>

    return [
      idPhotoUrls.white?.large,
      idPhotoUrls.blue?.large,
      idPhotoUrls.red?.large,
      portraitUrls['front-upper-body'],
      portraitUrls['side-shoulder-upper-body'],
    ].filter((url): url is string => typeof url === 'string' && url.trim().length > 0)
  }

  private static async createAndStoreZip(task: ProcessRow, files: StoredFile[]) {
    const zip = new JSZip()
    files.forEach((file) => zip.file(file.filename, file.data))
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })
    const file = await this.storeBuffer(task, zipBuffer, 'package/all-results.zip', 'application/zip')
    return file.publicUrl
  }

  private static async updateTask(taskId: string, updates: Record<string, unknown>) {
    const { error } = await supabaseAdmin
      .from('photo_process_results')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', taskId)
    if (error) throw new Error(error.message)
  }

  private static async storeBuffer(task: ProcessRow, data: Buffer, filename: string, contentType: string): Promise<StoredFile> {
    const objectPath = [
      'photo-process-results',
      this.safeStorageSegment(task.orderid),
      this.safeStorageSegment(task.id),
      filename,
    ].join('/')

    const { error } = await supabaseAdmin.storage
      .from(OUTPUT_BUCKET)
      .upload(objectPath, data, {
        contentType,
        upsert: true,
      })

    if (error) {
      throw new Error(`Failed to upload processed file ${objectPath} (${contentType}, ${data.length} bytes): ${JSON.stringify(error)}`)
    }
    const { data: publicData } = supabaseAdmin.storage.from(OUTPUT_BUCKET).getPublicUrl(objectPath)
    return {
      path: objectPath,
      publicUrl: publicData.publicUrl,
      filename,
      data,
      contentType,
    }
  }

  private static async downloadImage(imageUrl: string): Promise<{ contentType: string; data: Buffer }> {
    const response = await fetchWithTimeout(imageUrl, {}, 30000)
    if (!response.ok) throw new Error(`Failed to download image: ${response.status}`)
    const contentType = response.headers.get('content-type') || 'image/jpeg'
    if (!contentType.startsWith('image/')) throw new Error(`Downloaded file is not an image: ${contentType}`)
    return {
      contentType,
      data: Buffer.from(await response.arrayBuffer()),
    }
  }

  private static validateImageReference(imageUrl: string) {
    if (imageUrl.startsWith('data:image/')) return
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return
    throw new Error('image URL must be an http(s) URL or a data:image/... base64 URL')
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

  private static extensionForContentType(contentType: string) {
    const normalized = contentType.split(';')[0].trim().toLowerCase()
    if (normalized === 'image/png') return 'png'
    if (normalized === 'image/webp') return 'webp'
    return 'jpg'
  }

  private static safeStorageSegment(value: string) {
    return value.replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'unknown'
  }
}
