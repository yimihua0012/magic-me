import { supabaseAdmin } from '@backend/config/supabase'
import { Generation, GenerationStatus, StyleConfig } from '@backend/types'
import { CreditPackageService } from './credit-package.service'
import { emailService } from './email.service'
import { userRepository } from '@backend/db/repositories'

// 内存存储作为数据库降级方案（使用全局变量确保跨请求共享）
declare global {
  // eslint-disable-next-line no-var
  var mockGenerations: Map<string, Generation> | undefined
}

// 初始化全局内存存储
if (!global.mockGenerations) {
  global.mockGenerations = new Map<string, Generation>()
}

const mockGenerations = global.mockGenerations
const allowMemoryFallback = false
const generationDebugEnabled = process.env.GENERATION_DEBUG === 'true'
const INPUT_PHOTOS_BUCKET = 'input-photos'
const OUTPUT_PHOTOS_BUCKET = 'output-photos'

function logGenerationDebug(...args: unknown[]): void {
  if (generationDebugEnabled) {
    console.log(...args)
  }
}

interface OutputPhotoStorageContext {
  userId: string
  generationId: string
  folderName: string
  index: number
}

interface StoredImage {
  path: string
  publicUrl: string | null
}

// 内存缓存 - 用于减少频繁的数据库查询（前端轮询优化）
interface CacheEntry {
  data: Generation
  expiresAt: number
}

const generationCache = new Map<string, CacheEntry>()
const CACHE_TTL_MS = 3000 // 3秒缓存，状态查询频繁但变化不快

function getCachedGeneration(id: string): Generation | null {
  const entry = generationCache.get(id)
  if (entry && Date.now() < entry.expiresAt) {
    return entry.data
  }
  generationCache.delete(id)
  return null
}

function setCachedGeneration(id: string, data: Generation): void {
  generationCache.set(id, { data, expiresAt: Date.now() + CACHE_TTL_MS })
}

const STYLE_CONFIGS: Record<string, StyleConfig> = {
  linkedin_professional: {
    id: 'linkedin_professional',
    name: 'LinkedIn Professional',
    category: 'professional',
    prompt: 'professional corporate headshot, linkedin profile photo, business suit, studio lighting, clean white background, confident friendly smile, canon dslr, 85mm lens',
    negative: 'casual clothes, outdoor, messy hair, dark shadows, blurry, low quality, distorted face, bad anatomy, multiple people'
  },
  corporate_office: {
    id: 'corporate_office',
    name: 'Corporate Office',
    category: 'professional',
    prompt: 'corporate business portrait, modern office background, business attire, professional lighting, confident pose, high-end corporate photography',
    negative: 'casual, messy, unprofessional, dark, blurry, distorted face'
  },
  business_casual: {
    id: 'business_casual',
    name: 'Business Casual',
    category: 'professional',
    prompt: 'business casual portrait, smart casual attire, relaxed professional look, modern startup vibe, natural lighting, friendly expression',
    negative: 'formal suit, overly corporate, stiff pose, dark, blurry'
  },
  executive_portrait: {
    id: 'executive_portrait',
    name: 'Executive Portrait',
    category: 'professional',
    prompt: 'executive headshot, c-level executive, confident powerful pose, luxury office background, dramatic lighting, high-end professional photography',
    negative: 'casual, young, inexperienced, messy, unprofessional, blurry'
  },
  doctor_whitecoat: {
    id: 'doctor_whitecoat',
    name: 'Doctor Whitecoat',
    category: 'professional',
    prompt: 'medical professional portrait, white coat, stethoscope, clean clinical background, trustworthy expression, healthcare professional',
    negative: 'casual clothes, messy, unprofessional, dark, distorted face'
  },
  modern_tech: {
    id: 'modern_tech',
    name: 'Modern Tech',
    category: 'professional',
    prompt: 'tech professional portrait, modern tech office, casual tech attire, startup environment, natural lighting, friendly smile',
    negative: 'formal suit, corporate, outdated, dark, blurry'
  },
  creative_agency: {
    id: 'creative_agency',
    name: 'Creative Agency',
    category: 'professional',
    prompt: 'creative professional portrait, modern creative agency, trendy stylish outfit, artistic background, vibrant colors, confident creative look',
    negative: 'corporate suit, boring, dull, dark, blurry'
  },
  oil_painting: {
    id: 'oil_painting',
    name: 'Oil Painting',
    category: 'artistic',
    prompt: 'classical oil painting portrait, van gogh style, thick brushstrokes, impasto technique, artistic, textured canvas, museum quality fine art',
    negative: 'photograph, digital art, smooth, 3d render, photography, modern, pixel perfect, clean lines'
  },
  watercolor_art: {
    id: 'watercolor_art',
    name: 'Watercolor Art',
    category: 'artistic',
    prompt: 'watercolor portrait painting, soft watercolor wash, delicate brushwork, artistic, elegant, fine art, gallery quality',
    negative: 'photograph, digital art, sharp lines, 3d render, modern, pixel perfect'
  },
  anime_illustration: {
    id: 'anime_illustration',
    name: 'Anime Illustration',
    category: 'artistic',
    prompt: 'studio ghibli anime portrait, soft watercolor background, gentle expression, hand drawn animation style, beautiful illustration, pastel colors, whimsical',
    negative: 'realistic, 3d, photograph, dark, scary, horror, mature, photorealistic'
  },
  cyberpunk_neon: {
    id: 'cyberpunk_neon',
    name: 'Cyberpunk Neon',
    category: 'artistic',
    prompt: 'cyberpunk portrait, neon lights, futuristic city background, tech wear, holographic elements, night, high contrast, edgy, blade runner aesthetic',
    negative: 'daylight, natural, rural, vintage, historical, bright sunny, countryside'
  },
  pixel_art_retro: {
    id: 'pixel_art_retro',
    name: 'Pixel Art Retro',
    category: 'artistic',
    prompt: 'retro pixel art portrait, 16-bit video game style, nostalgic, colorful pixels, retro gaming aesthetic, 80s 90s style',
    negative: 'photograph, modern, realistic, 3d, high resolution, smooth'
  },
  pop_art_comic: {
    id: 'pop_art_comic',
    name: 'Pop Art Comic',
    category: 'artistic',
    prompt: 'pop art portrait, andy warhol style, bold colors, comic book aesthetic, vibrant, graphic design, art museum quality',
    negative: 'photograph, realistic, dark, dull, muted colors, boring'
  },
  coffee_shop: {
    id: 'coffee_shop',
    name: 'Coffee Shop',
    category: 'lifestyle',
    prompt: 'cozy coffee shop portrait, warm atmosphere, casual outfit, relaxed smile, soft natural lighting, urban café background',
    negative: 'formal, corporate, dark, cold, harsh lighting, studio'
  },
  beach_golden_hour: {
    id: 'beach_golden_hour',
    name: 'Beach Golden Hour',
    category: 'lifestyle',
    prompt: 'beach portrait, golden hour sunset, ocean waves background, linen white shirt, warm lighting, relaxed natural smile, shallow depth of field, 8k',
    negative: 'studio, formal suit, winter, snow, dark, indoor, harsh lighting, overcast'
  },
  autumn_park: {
    id: 'autumn_park',
    name: 'Autumn Park',
    category: 'lifestyle',
    prompt: 'autumn park portrait, fallen leaves, warm orange tones, cozy sweater, gentle smile, golden autumn light, peaceful atmosphere',
    negative: 'summer, beach, bright sun, harsh lighting, cold winter, studio'
  },
  city_street: {
    id: 'city_street',
    name: 'City Street',
    category: 'lifestyle',
    prompt: 'urban street portrait, city background, stylish casual outfit, street photography style, candid natural pose, modern city vibe',
    negative: 'studio, formal, boring background, dark, blurry'
  },
  library_study: {
    id: 'library_study',
    name: 'Library Study',
    category: 'lifestyle',
    prompt: 'library portrait, bookshelf background, intellectual look, cozy sweater, gentle expression, warm lighting, studious atmosphere',
    negative: 'casual, party, bright neon, modern tech, dark, blurry'
  },
  garden_spring: {
    id: 'garden_spring',
    name: 'Garden Spring',
    category: 'lifestyle',
    prompt: 'spring garden portrait, cherry blossoms, floral background, pastel colors, soft dress, gentle smile, fresh spring atmosphere',
    negative: 'winter, dark, cold, formal suit, studio, harsh lighting'
  },
  spring_blossom: {
    id: 'spring_blossom',
    name: 'Spring Blossom',
    category: 'seasonal',
    prompt: 'spring portrait, cherry blossoms, pink flowers, soft pastel colors, gentle lighting, fresh spring atmosphere, floral background',
    negative: 'winter, dark, cold, harsh lighting, autumn, summer heat'
  },
  summer_sunshine: {
    id: 'summer_sunshine',
    name: 'Summer Sunshine',
    category: 'seasonal',
    prompt: 'summer portrait, bright sunshine, warm golden tones, casual summer outfit, beach or park setting, happy smile, vibrant energy',
    negative: 'winter, cold, dark, studio, formal, overcast'
  },
  autumn_foliage: {
    id: 'autumn_foliage',
    name: 'Autumn Foliage',
    category: 'seasonal',
    prompt: 'autumn portrait, golden autumn leaves, warm orange red tones, cozy sweater, gentle smile, fall atmosphere',
    negative: 'summer, beach, bright sun, winter snow, studio'
  },
  winter_snow: {
    id: 'winter_snow',
    name: 'Winter Snow',
    category: 'seasonal',
    prompt: 'winter portrait, gentle snowfall, cozy winter coat, rosy cheeks, soft magical lighting, snowflakes, warm smile, fairytale atmosphere',
    negative: 'summer, beach, hot, sweating, bright sun, tropical, shorts, sand'
  },
  black_white_classic: {
    id: 'black_white_classic',
    name: 'Black & White Classic',
    category: 'classic',
    prompt: 'timeless black and white portrait, high contrast, film noir style, dramatic shadows, classic hollywood, leica monochrome, fine art photography',
    negative: 'color, neon, modern digital effects, filters, overexposed, flat lighting'
  },
  vintage_film: {
    id: 'vintage_film',
    name: 'Vintage Film',
    category: 'classic',
    prompt: 'vintage film portrait, film grain texture, retro colors, nostalgic feel, 1950s 1960s style, warm tones, classic photography',
    negative: 'modern digital, high tech, neon, futuristic, clean digital art'
  },
  rembrandt_lighting: {
    id: 'rembrandt_lighting',
    name: 'Rembrandt Lighting',
    category: 'classic',
    prompt: 'rembrandt lighting portrait, dramatic chiaroscuro, classical painting style, theatrical lighting, fine art portrait, museum quality',
    negative: 'flat lighting, bright even lighting, modern digital, casual, boring'
  },
  soft_glamour: {
    id: 'soft_glamour',
    name: 'Soft Glamour',
    category: 'classic',
    prompt: 'soft glamour portrait, soft diffused lighting, elegant pose, glamorous look, professional makeup, high-end beauty photography',
    negative: 'harsh lighting, casual, unprofessional, dark, blurry, distorted'
  },
  superhero_style: {
    id: 'superhero_style',
    name: 'Superhero',
    category: 'creative',
    prompt: 'superhero movie poster portrait, marvel style, dramatic lighting, dynamic pose, cape, heroic, cinematic, epic, professional cosplay quality',
    negative: 'casual, everyday, normal clothes, boring, dull, ordinary background'
  },
  royal_portrait: {
    id: 'royal_portrait',
    name: 'Royal Portrait',
    category: 'creative',
    prompt: 'royal portrait painting, classical renaissance style, regal attire, crown, luxurious background, oil painting texture, museum masterpiece',
    negative: 'modern, casual, everyday, boring, plain background, digital art'
  },
  astronaut_space: {
    id: 'astronaut_space',
    name: 'Astronaut Space',
    category: 'creative',
    prompt: 'astronaut portrait, space background, stars galaxies, space suit, helmet, sci-fi aesthetic, cinematic, epic space exploration',
    negative: 'earth, normal clothes, casual, boring, plain background, dark'
  }
}

let cachedDbStyles: StyleConfig[] | null = null
let cachedDbStylesAt = 0
const STYLE_CACHE_MS = 60_000

async function loadDbStyles(): Promise<StyleConfig[] | null> {
  if (cachedDbStyles && Date.now() - cachedDbStylesAt < STYLE_CACHE_MS) {
    return cachedDbStyles
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('headshot_styles')
      .select('id,name,category,prompt,negative,is_active')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error || !data || data.length === 0) {
      return null
    }

    cachedDbStyles = data as StyleConfig[]
    cachedDbStylesAt = Date.now()
    return cachedDbStyles
  } catch (error) {
    console.error('[GenerationService] Failed to load DB styles:', error)
    return null
  }
}

async function getStyleMap(): Promise<Record<string, StyleConfig>> {
  const dbStyles = await loadDbStyles()
  const styles = dbStyles?.length ? dbStyles : Object.values(STYLE_CONFIGS)
  return Object.fromEntries(styles.map(style => [style.id, style]))
}

async function incrementStyleStats(styleIds: string[]): Promise<void> {
  const uniqueStyleIds = [...new Set(styleIds)].filter(Boolean)
  if (uniqueStyleIds.length === 0) return

  const now = new Date().toISOString()
  await Promise.all(uniqueStyleIds.map(async (styleId) => {
    const { data: existing } = await supabaseAdmin
      .from('headshot_styles')
      .select('selection_count')
      .eq('id', styleId)
      .maybeSingle()

    const nextCount = (existing?.selection_count || 0) + 1
    await supabaseAdmin
      .from('headshot_styles')
      .update({
        selection_count: nextCount,
        last_selected_at: now,
      })
      .eq('id', styleId)
  }))
}

// 带超时的 fetch 包装
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 30000): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, { ...options, signal: controller.signal })
    return response
  } finally {
    clearTimeout(timeoutId)
  }
}

const QUALITY_SUFFIX = 'professional headshot, upper-body portrait, clean background, natural skin texture, realistic lighting, sharp focus, crisp eyes, high detail, 4K resolution, ultra high definition, premium studio photography, LinkedIn-ready'
const DEFAULT_NEGATIVE = 'worst quality, low quality, low resolution, blurry, pixelated, jpeg artifacts, distorted face, extra fingers, fused fingers, bad anatomy, ugly, deformed, disfigured, watermark, text, logo, multiple people, side profile, cropped face, changed identity, altered face shape, distorted facial proportions, over-smoothed skin, plastic surgery look, childlike face'
const MAX_INPUT_PHOTOS = 3
const GENERATION_ATTEMPTS = 3
const POLL_INTERVAL_MS = 5000

function generationStepForProgress(progress: number): string {
  if (progress >= 95) return 'Preparing your finished headshots...'
  if (progress >= 80) return 'Polishing lighting, detail, and skin tones...'
  if (progress >= 60) return 'Rendering your selected portrait styles...'
  if (progress >= 35) return 'Matching your reference photos to each style...'
  if (progress >= 15) return 'Analyzing your reference photos...'
  return 'Preparing your generation...'
}

export interface CreateGenerationRequest {
  userId: string
  faceImageUrl?: string
  faceImageUrls?: string[]
  styleIds?: string[]
  clientGenerationId?: string
}

export interface GenerationResponse {
  id: string
  status: GenerationStatus
  progress: number
  currentStep: string
  outputUrls: string[]
  reused?: boolean
}

export class GenerationService {
  private static normalizeInputPhotos(input: CreateGenerationRequest): string[] {
    const photos = Array.isArray(input.faceImageUrls)
      ? input.faceImageUrls
      : input.faceImageUrl
        ? [input.faceImageUrl]
        : []

    const normalized = photos
      .filter((photo): photo is string => typeof photo === 'string')
      .map(photo => photo.trim())
      .filter(Boolean)
      .slice(0, MAX_INPUT_PHOTOS)

    if (normalized.length === 0) {
      throw new Error('At least one input photo is required')
    }

    return normalized
  }

  private static async getGenerationByClientId(userId: string, clientGenerationId: string): Promise<Generation | null> {
    const { data, error } = await supabaseAdmin
      .from('generations')
      .select('*')
      .eq('user_id', userId)
      .contains('metadata', { clientGenerationId })
      .maybeSingle()

    if (error) {
      console.error('[GenerationService] Error checking idempotent generation:', error)
      throw error
    }

    return data as Generation | null
  }

  static async findByClientGenerationId(userId: string, clientGenerationId: string): Promise<Generation | null> {
    return this.getGenerationByClientId(userId, clientGenerationId)
  }

  private static toGenerationResponse(generation: Generation, reused = false): GenerationResponse {
    return {
      id: generation.id,
      status: generation.status,
      progress: generation.progress || 0,
      currentStep: generation.current_step || 'Rendering your portrait styles...',
      outputUrls: generation.output_photos || [],
      reused,
    }
  }

  static async getPendingGeneration(userId: string): Promise<Generation | null> {
    logGenerationDebug(`[GenerationService] getPendingGeneration for user: ${userId}`)
    
    const { data, error } = await supabaseAdmin
      .from('generations')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('[GenerationService] Error getting pending generation:', error)
      return null
    }

    return data as Generation | null
  }

  static async activateGeneration(generationId: string, faceImageUrl: string, styleIds?: string[]): Promise<GenerationResponse> {
    logGenerationDebug(`[GenerationService] activateGeneration called - id: ${generationId}`)
    
    const { data: existing } = await supabaseAdmin
      .from('generations')
      .select('*')
      .eq('id', generationId)
      .single()

    if (!existing) {
      throw new Error('Generation not found')
    }

    const inputPhotos = this.normalizeInputPhotos({ userId: existing.user_id, faceImageUrl })

    const styles = styleIds?.length 
      ? styleIds.slice(0, existing.style_count || 30)
      : Object.keys(STYLE_CONFIGS).slice(0, existing.style_count || 30)

    const updateData: Partial<Generation> = {
      status: 'processing',
      progress: 0,
      current_step: 'Initializing...',
      input_photos: inputPhotos,
      output_photos: [],
      started_at: new Date().toISOString(),
    }

    const { data, error } = await supabaseAdmin
      .from('generations')
      .update(updateData)
      .eq('id', generationId)
      .select()
      .single()

    if (error) {
      console.error('[GenerationService] Error activating generation:', error)
      throw error
    }

    logGenerationDebug(`[GenerationService] Activated generation: ${generationId}, styles: ${styles.length}`)
    setCachedGeneration(generationId, data as Generation)

    return {
      id: generationId,
      status: 'processing',
      progress: 0,
      currentStep: 'Initializing...',
      outputUrls: []
    }
  }

  static async createAndActivateGeneration(input: CreateGenerationRequest): Promise<GenerationResponse> {
    logGenerationDebug(`[GenerationService] createAndActivateGeneration called - userId: ${input.userId}`)
    const { userId, styleIds, clientGenerationId } = input
    const inputPhotos = this.normalizeInputPhotos(input)
    const availableStyles = await getStyleMap()
    const styles = styleIds?.length
      ? styleIds.filter(id => availableStyles[id]).slice(0, 120)
      : Object.keys(availableStyles).slice(0, 30)
    const styleCount = styles.length
    logGenerationDebug(`[GenerationService] Creating generation with ${styleCount} styles`)

    if (clientGenerationId) {
      const existing = await this.getGenerationByClientId(userId, clientGenerationId)
      if (existing) {
        const existingGeneration = existing as Generation
        logGenerationDebug(`[GenerationService] Reusing existing generation for clientGenerationId: ${clientGenerationId}`)
        setCachedGeneration(existingGeneration.id, existingGeneration)
        return this.toGenerationResponse(existingGeneration, true)
      }
    }

    // 预扣信用次数
    const consumeResult = await CreditPackageService.consumeCredits(userId, styleCount)
    if (!consumeResult.success || !consumeResult.packageId) {
      console.error(`[GenerationService] Failed to consume credits: ${consumeResult.error}`)
      throw new Error(consumeResult.error || 'Failed to consume credits')
    }

    await incrementStyleStats(styles)

    const generationData: Partial<Generation> = {
      user_id: userId,
      plan_type: 'basic',
      style_count: styleCount,
      input_photos: inputPhotos,
      output_photos: [],
      status: 'processing',
      progress: 0,
      current_step: 'Initializing...',
      started_at: new Date().toISOString(),
      credit_package_id: consumeResult.packageId,
      credits_used: styleCount,
      metadata: {
        consumedCredits: consumeResult.consumedFrom || [],
        styleIds: styles,
        clientGenerationId,
      },
    }

    const { data, error } = await supabaseAdmin
      .from('generations')
      .insert(generationData)
      .select()
      .single()

    if (error) {
      if (clientGenerationId) {
        const existing = await this.getGenerationByClientId(userId, clientGenerationId)
        if (existing) {
          await Promise.all((consumeResult.consumedFrom || []).map(({ packageId, amount }) =>
            CreditPackageService.refundCredits(packageId, amount)
          ))
          logGenerationDebug(`[GenerationService] Refunded duplicate retry and reused generation: ${existing.id}`)
          setCachedGeneration(existing.id, existing)
          return this.toGenerationResponse(existing, true)
        }
      }

      if (!allowMemoryFallback) {
        await Promise.all((consumeResult.consumedFrom || []).map(({ packageId, amount }) =>
          CreditPackageService.refundCredits(packageId, amount)
        ))
        throw error
      }

      logGenerationDebug(`[GenerationService] Database insert error: ${error.message || error}, falling back to memory`)
      // 内存降级
      const fallbackId = `gen_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      mockGenerations.set(fallbackId, {
        id: fallbackId,
        user_id: userId,
        plan_type: 'basic',
        style_count: styleCount,
        input_photos: inputPhotos,
        output_photos: [],
        status: 'processing',
        progress: 0,
        current_step: 'Initializing...',
        started_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        credit_package_id: consumeResult.packageId,
        credits_used: styleCount,
        metadata: {
          consumedCredits: consumeResult.consumedFrom || [],
          styleIds: styles,
          clientGenerationId,
        },
      })
      logGenerationDebug(`[GenerationService] Successfully stored in memory: ${fallbackId}`)
      setCachedGeneration(fallbackId, mockGenerations.get(fallbackId)!)
      return {
        id: fallbackId,
        status: 'processing',
        progress: 0,
        currentStep: 'Initializing...',
        outputUrls: []
      }
    }

    const generationId = data.id
    logGenerationDebug(`[GenerationService] Successfully stored in database: ${generationId}`)
    setCachedGeneration(generationId, data as Generation)

    return {
      id: generationId,
      status: 'processing',
      progress: 0,
      currentStep: 'Initializing...',
      outputUrls: []
    }
  }

  static async createGeneration(input: CreateGenerationRequest): Promise<GenerationResponse> {
    logGenerationDebug(`[GenerationService] createGeneration called - userId: ${input.userId}, inputPhotoCount: ${this.normalizeInputPhotos(input).length}`)
    const { userId, styleIds } = input
    const inputPhotos = this.normalizeInputPhotos(input)
    const availableStyles = await getStyleMap()
    const styles = styleIds?.length
      ? styleIds.filter(id => availableStyles[id]).slice(0, 120)
      : Object.keys(availableStyles).slice(0, 30)
    logGenerationDebug(`[GenerationService] Creating generation with ${styles.length} styles`)
    
    const generationData: Partial<Generation> = {
      user_id: userId,
      plan_type: 'basic',
      style_count: styles.length,
      input_photos: inputPhotos,
      output_photos: [],
      status: 'processing',
      progress: 0,
      current_step: 'Initializing...',
    }

    const { data, error } = await supabaseAdmin
      .from('generations')
      .insert(generationData)
      .select()
      .single()

    if (error) {
      if (!allowMemoryFallback) {
        throw error
      }

      logGenerationDebug(`[GenerationService] Database insert error: ${error.message || error}, falling back to memory`)
      const fallbackId = `gen_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      mockGenerations.set(fallbackId, {
        id: fallbackId,
        user_id: userId,
        plan_type: 'basic',
        style_count: styles.length,
        input_photos: inputPhotos,
        output_photos: [],
        status: 'processing',
        progress: 0,
        current_step: 'Initializing...',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      logGenerationDebug(`[GenerationService] Successfully stored in memory: ${fallbackId}`)
      return {
        id: fallbackId,
        status: 'processing',
        progress: 0,
        currentStep: 'Initializing...',
        outputUrls: []
      }
    }

    const generationId = data.id
    logGenerationDebug(`[GenerationService] Successfully stored in database: ${generationId}`)
    setCachedGeneration(generationId, data as Generation)

    return {
      id: generationId,
      status: 'processing',
      progress: 0,
      currentStep: 'Initializing...',
      outputUrls: []
    }
  }

  static async getGeneration(id: string): Promise<Generation | null> {
    logGenerationDebug(`[GenerationService] getGeneration called for id: ${id}`)

    // 先查内存缓存
    const cached = getCachedGeneration(id)
    if (cached) {
      logGenerationDebug(`[GenerationService] Cache hit for id: ${id}, status: ${cached.status}`)
      return cached
    }

    const { data, error } = await supabaseAdmin
      .from('generations')
      .select('*')
      .eq('id', id)
      .single()

    if (!error && data) {
      logGenerationDebug(`[GenerationService] Found in database - id: ${id}, status: ${data.status}, progress: ${data.progress}`)
      const gen = data as Generation
      setCachedGeneration(id, gen)
      return gen
    }

    if (error) {
      logGenerationDebug(`[GenerationService] Database query error for id ${id}: ${error.message || error}`)
    }

    const mockGeneration = mockGenerations.get(id)
    if (mockGeneration) {
      logGenerationDebug(`[GenerationService] Found in memory - id: ${id}, status: ${mockGeneration.status}, progress: ${mockGeneration.progress}`)
      return mockGeneration
    }

    logGenerationDebug(`[GenerationService] Generation NOT FOUND for id: ${id}`)
    return null
  }

  static async updateGeneration(id: string, updates: Partial<Generation>): Promise<void> {
    logGenerationDebug(`[GenerationService] updateGeneration called for id: ${id}, updates:`, JSON.stringify(updates))

    // 更新数据库时清除缓存，下次查询会重新加载
    generationCache.delete(id)

    const { error } = await supabaseAdmin
      .from('generations')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      if (!allowMemoryFallback) {
        throw error
      }

      logGenerationDebug(`[GenerationService] Database update error for id ${id}: ${error.message || error}, falling back to memory`)
      const mockGeneration = mockGenerations.get(id)
      if (mockGeneration) {
        const updated = {
          ...mockGeneration,
          ...updates,
          updated_at: new Date().toISOString()
        }
        mockGenerations.set(id, updated)
        logGenerationDebug(`[GenerationService] Successfully updated memory for id: ${id}, new status: ${updated.status}, progress: ${updated.progress}`)
      } else {
        logGenerationDebug(`[GenerationService] Could not find generation in memory for id: ${id}`)
      }
    } else {
      logGenerationDebug(`[GenerationService] Successfully updated database for id: ${id}`)
    }
  }

  static async deleteGeneration(id: string): Promise<void> {
    await supabaseAdmin
      .from('generations')
      .delete()
      .eq('id', id)
  }

  static async getUserGenerations(userId: string): Promise<Generation[]> {
    const { data, error } = await supabaseAdmin
      .from('generations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) return []
    return data as Generation[]
  }

  static async generateHeadshots(generationId: string): Promise<void> {
    logGenerationDebug(`[GenerationService] generateHeadshots started for id: ${generationId}`)
    const generation = await this.getGeneration(generationId)
    if (!generation) {
      logGenerationDebug(`[GenerationService] generateHeadshots FAILED - generation not found: ${generationId}`)
      throw new Error('Generation not found')
    }
    logGenerationDebug(`[GenerationService] Found generation - style_count: ${generation.style_count}`)

    await this.updateGeneration(generationId, { 
      status: 'processing',
      started_at: new Date().toISOString(),
      current_step: generationStepForProgress(5)
    })

    const requestedStyleIds = Array.isArray(generation.metadata?.styleIds)
      ? generation.metadata.styleIds.filter((styleId): styleId is string => typeof styleId === 'string')
      : []
    const stylesToGenerate = requestedStyleIds.length
      ? requestedStyleIds
      : Object.keys(await getStyleMap()).slice(0, generation.style_count)
    const batchSize = 5
    const batches: string[][] = []
    
    for (let i = 0; i < stylesToGenerate.length; i += batchSize) {
      batches.push(stylesToGenerate.slice(i, i + batchSize))
    }

    logGenerationDebug(`[GenerationService] Generating ${stylesToGenerate.length} styles in ${batches.length} batches`)

    const outputUrls: string[] = []
    const totalStyles = stylesToGenerate.length
    const storageFolderName = this.createStorageFolderName()
    let completedStyles = 0

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex]
      logGenerationDebug(`[GenerationService] Processing batch ${batchIndex + 1}/${batches.length} (${batch.length} styles)`)
      
      const batchStartProgress = Math.round((completedStyles / totalStyles) * 100)
      await this.updateGeneration(generationId, {
        current_step: generationStepForProgress(batchStartProgress),
      })

      const batchPromises = batch.map((styleId, batchItemIndex) => 
        this.generateWithRetry(
          generation.input_photos.slice(0, MAX_INPUT_PHOTOS),
          styleId,
          {
            userId: generation.user_id,
            generationId,
            folderName: storageFolderName,
            index: completedStyles + batchItemIndex,
          }
        )
      )

      const batchResults = await Promise.all(batchPromises)
      const validResults = batchResults.filter(Boolean)
      outputUrls.push(...validResults)
      completedStyles += batch.length

      const progress = Math.round((completedStyles / totalStyles) * 100)
      logGenerationDebug(`[GenerationService] Batch ${batchIndex + 1} completed - progress: ${progress}%, total outputs: ${outputUrls.length}`)
      await this.updateGeneration(generationId, { 
        progress, 
        output_photos: outputUrls,
        current_step: generationStepForProgress(progress),
      })
    }

    const archivedInputPhotos = await this.archiveInputPhotos(generation.input_photos, {
      userId: generation.user_id,
      generationId,
      folderName: storageFolderName,
      index: 0,
    })

    logGenerationDebug(`[GenerationService] Generation completed for id: ${generationId}, total outputs: ${outputUrls.length}`)
    await this.updateGeneration(generationId, { 
      status: 'completed', 
      progress: 100,
      input_photos: archivedInputPhotos.length ? archivedInputPhotos : generation.input_photos,
      output_photos: outputUrls,
      completed_at: new Date().toISOString(),
      current_step: 'Your headshots are ready to review.'
    })

    // 发送生成完成邮件
    this.sendCompletionEmail(generationId, outputUrls.length).catch(err => {
      console.error('[GenerationService] Failed to send completion email:', err)
    })
  }

  /**
   * 发送生成完成邮件
   */
  private static async sendCompletionEmail(generationId: string, styleCount: number): Promise<void> {
    try {
      const generation = await this.getGeneration(generationId)
      if (!generation) {
        console.warn(`[GenerationService] Generation not found for email: ${generationId}`)
        return
      }

      const user = await userRepository.findById(generation.user_id)
      if (!user?.email) {
        console.warn(`[GenerationService] User email not found for generation: ${generationId}`)
        return
      }

      const creditSummary = await CreditPackageService.getTotalRemaining(generation.user_id)
      const creditsUsed = generation.credits_used || styleCount

      await emailService.sendGenerationCompleteEmail({
        email: user.email,
        name: user.full_name || undefined,
        generationId: generation.id,
        styleCount,
        creditsUsed,
        remainingCredits: creditSummary.totalRemaining,
        nearestExpiresAt: creditSummary.nearestExpiresAt,
      })

      logGenerationDebug(`[GenerationService] Completion email sent to ${user.email}`)
    } catch (err) {
      console.error('[GenerationService] Error sending completion email:', err)
    }
  }

  private static isMockMode(): boolean {
    const mode = process.env.GENERATION_MODE?.toLowerCase()
    if (mode === 'mock') return false
    if (mode === 'replicate') return false
    return false
  }

  private static async generateWithRetry(
    faceImageUrls: string[],
    styleId: string,
    storageContext: OutputPhotoStorageContext
  ): Promise<string> {
    try {
      return await this.generateSingleStyle(faceImageUrls, styleId, storageContext)
    } catch (error) {
      console.error(`Failed to generate ${styleId} after ${GENERATION_ATTEMPTS} attempts:`, error)
      return this.fallbackGenerationImage(styleId, error instanceof Error ? error.message : 'Retry limit reached')
    }
  }

  private static async generateSingleStyle(
    faceImageUrls: string[],
    styleId: string,
    storageContext: OutputPhotoStorageContext
  ): Promise<string> {
    const availableStyles = await getStyleMap()
    const styleConfig = availableStyles[styleId]
    if (!styleConfig) throw new Error(`Style ${styleId} not found`)

    if (this.isMockMode()) {
      if (!allowMemoryFallback && process.env.GENERATION_MODE?.toLowerCase() === 'mock') {
        throw new Error('Mock generation mode is not allowed in production')
      }
      return this.generateMockImage(styleId)
    }

    logGenerationDebug(`[GenerationService] Generating ${styleId} with Replicate API...`)
    
    const prompt = `Create a square 1:1 professional AI headshot from 1-3 reference photos of the same person. Keep the identity consistent, natural, and realistic. Preserve facial likeness and do not soften or blur facial details. Preserve the person's facial structure, face shape, and recognizable likeness. Make the result look naturally polished and slightly refreshed, with a subtly younger appearance, without changing identity or facial proportions. Output should be a polished LinkedIn-ready 4K-quality headshot with the chosen style: ${styleConfig.prompt}, ${QUALITY_SUFFIX}`

    const replicateApiKey = process.env.REPLICATE_API_KEY
    const modelName = process.env.REPLICATE_MODEL_NAME || 'google/nano-banana-2'

    for (let attempt = 1; attempt <= GENERATION_ATTEMPTS; attempt++) {
      try {
        logGenerationDebug(`[GenerationService] Calling Replicate API for ${styleId} (attempt ${attempt}/${GENERATION_ATTEMPTS})...`)
        logGenerationDebug(`[GenerationService] Using model: ${modelName}`)
        
        // 使用官方模型端点（30秒超时）
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
                negative_prompt: `${styleConfig.negative}, ${DEFAULT_NEGATIVE}`,
                image_input: faceImageUrls.slice(0, MAX_INPUT_PHOTOS),
                aspect_ratio: '1:1',
                output_format: 'jpg',
              },
            }),
          },
          30000
        )

        logGenerationDebug(`[GenerationService] Replicate API response status: ${response.status}`)
        
        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get('Retry-After') || '10')
          const waitTime = Math.pow(2, attempt) * 1000 + retryAfter * 1000
          console.warn(`[GenerationService] Rate limited (429) for ${styleId}. Retrying in ${waitTime/1000}s...`)
          await new Promise(resolve => setTimeout(resolve, waitTime))
          continue
        }

        const data = await response.json()
        logGenerationDebug(`[GenerationService] Replicate API response data:`, JSON.stringify(data).substring(0, 500))
        
        if (response.status === 422) {
          console.error(`[GenerationService] Request validation failed (422) for ${styleId}:`, JSON.stringify(data))
          return this.fallbackGenerationImage(styleId, 'Replicate validation failed')
        }
        
        if (data.error) {
          console.error(`[GenerationService] Error generating ${styleId}:`, data.error)
          return this.fallbackGenerationImage(styleId, data.error)
        }

        if (!data.id) {
          console.error(`[GenerationService] No prediction ID returned for ${styleId}`)
          return this.fallbackGenerationImage(styleId, 'No prediction ID returned')
        }

        logGenerationDebug(`[GenerationService] Prediction ID: ${data.id}, status: ${data.status}`)

        let result = data
        let pollCount = 0
        while (result.status !== 'succeeded' && result.status !== 'failed') {
          pollCount++
          logGenerationDebug(`[GenerationService] Polling ${styleId} - attempt ${pollCount}, status: ${result.status}`)
          await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS))
          const statusResponse = await fetchWithTimeout(
            `https://api.replicate.com/v1/predictions/${result.id}`,
            {
              headers: { 'Authorization': `Token ${replicateApiKey}` },
            },
            15000
          )
          
          if (statusResponse.status === 429) {
            const retryAfter = parseInt(statusResponse.headers.get('Retry-After') || '5')
            console.warn(`[GenerationService] Polling rate limited for ${styleId}. Waiting ${retryAfter}s...`)
            await new Promise(resolve => setTimeout(resolve, retryAfter * 1000))
            continue
          }
          
          result = await statusResponse.json()
        }

        logGenerationDebug(`[GenerationService] ${styleId} completed with status: ${result.status}`)
        if (result.status === 'failed') {
          return this.fallbackGenerationImage(styleId, result.error || 'Prediction failed')
        }

        const outputUrl = this.extractReplicateOutputUrl(result.output)
        if (!outputUrl) {
          return this.fallbackGenerationImage(styleId, 'Prediction returned no output')
        }

        return await this.persistOutputPhoto(outputUrl, styleId, storageContext)
      } catch (error) {
        console.error(`[GenerationService] Exception generating ${styleId} (attempt ${attempt}):`, error)
        if (attempt < GENERATION_ATTEMPTS) {
          const waitTime = Math.pow(2, attempt) * 1000
          logGenerationDebug(`[GenerationService] Retrying ${styleId} in ${waitTime/1000}s...`)
          await new Promise(resolve => setTimeout(resolve, waitTime))
        }
      }
    }

    console.error(`[GenerationService] Failed to generate ${styleId} after ${GENERATION_ATTEMPTS} attempts`)
    return this.fallbackGenerationImage(styleId, 'Generation attempts exhausted')
  }

  private static fallbackGenerationImage(styleId: string, reason: string): string {
    if (!allowMemoryFallback) {
      throw new Error(`Generation failed for ${styleId}: ${reason}`)
    }

    return this.generateMockImage(styleId)
  }

  private static extractReplicateOutputUrl(output: unknown): string | null {
    if (typeof output === 'string') return output
    if (Array.isArray(output)) {
      for (const item of output) {
        if (typeof item === 'string') return item
        if (item && typeof item === 'object') {
          const maybeOutput = item as { url?: unknown }
          if (typeof maybeOutput.url === 'string') return maybeOutput.url
        }
      }

      return null
    }

    if (output && typeof output === 'object') {
      const maybeOutput = output as { url?: unknown }
      if (typeof maybeOutput.url === 'string') return maybeOutput.url
    }

    return null
  }

  private static createStorageFolderName(): string {
    return new Date().toISOString().replace(/[:.]/g, '-')
  }

  private static async persistOutputPhoto(
    temporaryUrl: string,
    styleId: string,
    context: OutputPhotoStorageContext
  ): Promise<string> {
    const image = await this.loadImageFromUrl(temporaryUrl, 'image/jpeg')
    const extension = this.extensionForContentType(image.contentType)
    const safeStyleId = this.safeStorageSegment(styleId)
    const objectPath = [
      this.safeStorageSegment(context.userId),
      `${context.folderName}-${this.safeStorageSegment(context.generationId)}`,
      `${String(context.index + 1).padStart(3, '0')}-${safeStyleId}.${extension}`,
    ].join('/')

    const storedImage = await this.storeImage(temporaryUrl, image, {
      bucket: OUTPUT_PHOTOS_BUCKET,
      path: objectPath,
      public: true,
    })

    if (!storedImage.publicUrl) {
      throw new Error('Failed to create public URL for generated image')
    }

    return storedImage.publicUrl
  }

  private static async archiveInputPhotos(
    inputPhotos: string[],
    context: OutputPhotoStorageContext
  ): Promise<string[]> {
    const archivedPhotos: string[] = []

    for (let index = 0; index < inputPhotos.length; index++) {
      const inputPhoto = inputPhotos[index]
      try {
        const image = await this.loadImageFromUrl(inputPhoto, 'image/jpeg')
        const extension = this.extensionForContentType(image.contentType)
        const objectPath = [
          this.safeStorageSegment(context.userId),
          `${context.folderName}-${this.safeStorageSegment(context.generationId)}`,
          `input-${String(index + 1).padStart(2, '0')}.${extension}`,
        ].join('/')

        const storedImage = await this.storeImage(inputPhoto, image, {
          bucket: INPUT_PHOTOS_BUCKET,
          path: objectPath,
          public: false,
        })

        archivedPhotos.push(storedImage.path)
      } catch (error) {
        console.error('[GenerationService] Failed to archive input photo:', error)
        archivedPhotos.push(inputPhoto)
      }
    }

    return archivedPhotos
  }

  private static async loadImageFromUrl(
    imageUrl: string,
    fallbackContentType: string
  ): Promise<{ contentType: string; data: ArrayBuffer }> {
    if (imageUrl.startsWith('data:')) {
      return this.loadDataUrlImage(imageUrl, fallbackContentType)
    }

    const response = await fetchWithTimeout(imageUrl, {}, 30000)
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status}`)
    }

    const contentType = response.headers.get('content-type') || fallbackContentType
    if (!contentType.startsWith('image/')) {
      throw new Error(`Downloaded file is not an image: ${contentType}`)
    }

    return {
      contentType,
      data: await response.arrayBuffer(),
    }
  }

  private static loadDataUrlImage(
    dataUrl: string,
    fallbackContentType: string
  ): { contentType: string; data: ArrayBuffer } {
    const match = dataUrl.match(/^data:([^;,]+)?(;base64)?,(.*)$/)
    if (!match) {
      throw new Error('Invalid data URL image')
    }

    const contentType = match[1] || fallbackContentType
    if (!contentType.startsWith('image/')) {
      throw new Error(`Data URL is not an image: ${contentType}`)
    }

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
    options: {
      bucket: string
      path: string
      public: boolean
    }
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

    if (error) {
      throw new Error(`Failed to upload image to ${options.bucket}: ${error.message}`)
    }

    if (!options.public) {
      return { path: options.path, publicUrl: null }
    }

    const { data } = supabaseAdmin.storage
      .from(options.bucket)
      .getPublicUrl(options.path)

    return {
      path: options.path,
      publicUrl: data.publicUrl || null,
    }
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

  private static generateMockImage(styleId: string): string {
    const colorHash = styleId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const hue = colorHash % 360
    const styleName = styleId.replace(/_/g, ' ')
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024"><rect width="100%" height="100%" fill="hsl(${hue}, 70%, 85%)"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="48" fill="hsl(${hue}, 60%, 50%)">${styleName}</text></svg>`
    return `data:image/svg+xml,${encodeURIComponent(svgContent)}`
  }

  static getStyleConfigs(): StyleConfig[] {
    return cachedDbStyles?.length ? cachedDbStyles : Object.values(STYLE_CONFIGS)
  }

  static getStyleConfig(id: string): StyleConfig | undefined {
    return cachedDbStyles?.find(style => style.id === id) || STYLE_CONFIGS[id]
  }
}
