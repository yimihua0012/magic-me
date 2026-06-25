import { supabaseAdmin } from '@backend/config/supabase'
import { Generation, GenerationStatus, StyleConfig, CreateGenerationInput } from '@backend/types'

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

const QUALITY_SUFFIX = '4k, highly detailed, professional photography, sharp focus, beautiful lighting, masterpiece'
const DEFAULT_NEGATIVE = 'worst quality, low quality, blurry, distorted face, extra fingers, fused fingers, bad anatomy, ugly, deformed, disfigured, watermark, text, logo'

export interface CreateGenerationRequest {
  userId: string
  faceImageUrl: string
  styleIds?: string[]
}

export interface GenerationResponse {
  id: string
  status: GenerationStatus
  progress: number
  currentStep: string
  outputUrls: string[]
}

export class GenerationService {
  static async getPendingGeneration(userId: string): Promise<Generation | null> {
    console.log(`[GenerationService] getPendingGeneration for user: ${userId}`)
    
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
    console.log(`[GenerationService] activateGeneration called - id: ${generationId}`)
    
    const { data: existing } = await supabaseAdmin
      .from('generations')
      .select('*')
      .eq('id', generationId)
      .single()

    if (!existing) {
      throw new Error('Generation not found')
    }

    const styles = styleIds?.length 
      ? styleIds.slice(0, existing.style_count || 30)
      : Object.keys(STYLE_CONFIGS).slice(0, existing.style_count || 30)

    const updateData: Partial<Generation> = {
      status: 'processing',
      progress: 0,
      current_step: 'Initializing...',
      input_photos: [faceImageUrl],
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

    console.log(`[GenerationService] Activated generation: ${generationId}, styles: ${styles.length}`)
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
    console.log(`[GenerationService] createGeneration called - userId: ${input.userId}, faceImageUrl: ${input.faceImageUrl?.substring(0, 50)}...`)
    const { userId, faceImageUrl, styleIds } = input
    const styles = styleIds || Object.keys(STYLE_CONFIGS).slice(0, 30)
    console.log(`[GenerationService] Creating generation with ${styles.length} styles`)
    
    const generationData: Partial<Generation> = {
      user_id: userId,
      plan_type: 'basic',
      style_count: styles.length,
      input_photos: [faceImageUrl],
      output_photos: [],
      status: 'pending',
      progress: 0,
      current_step: 'Initializing...',
    }

    const { data, error } = await supabaseAdmin
      .from('generations')
      .insert(generationData)
      .select()
      .single()

    if (error) {
      console.log(`[GenerationService] Database insert error: ${error.message || error}, falling back to memory`)
      const fallbackId = `gen_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      mockGenerations.set(fallbackId, {
        id: fallbackId,
        user_id: userId,
        plan_type: 'basic',
        style_count: styles.length,
        input_photos: [faceImageUrl],
        output_photos: [],
        status: 'pending',
        progress: 0,
        current_step: 'Initializing...',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      console.log(`[GenerationService] Successfully stored in memory: ${fallbackId}`)
      return {
        id: fallbackId,
        status: 'pending',
        progress: 0,
        currentStep: 'Initializing...',
        outputUrls: []
      }
    }

    const generationId = data.id
    console.log(`[GenerationService] Successfully stored in database: ${generationId}`)
    setCachedGeneration(generationId, data as Generation)

    return {
      id: generationId,
      status: 'pending',
      progress: 0,
      currentStep: 'Initializing...',
      outputUrls: []
    }
  }

  static async getGeneration(id: string): Promise<Generation | null> {
    console.log(`[GenerationService] getGeneration called for id: ${id}`)

    // 先查内存缓存
    const cached = getCachedGeneration(id)
    if (cached) {
      console.log(`[GenerationService] Cache hit for id: ${id}, status: ${cached.status}`)
      return cached
    }

    const { data, error } = await supabaseAdmin
      .from('generations')
      .select('*')
      .eq('id', id)
      .single()

    if (!error && data) {
      console.log(`[GenerationService] Found in database - id: ${id}, status: ${data.status}, progress: ${data.progress}`)
      const gen = data as Generation
      setCachedGeneration(id, gen)
      return gen
    }

    if (error) {
      console.log(`[GenerationService] Database query error for id ${id}: ${error.message || error}`)
    }

    const mockGeneration = mockGenerations.get(id)
    if (mockGeneration) {
      console.log(`[GenerationService] Found in memory - id: ${id}, status: ${mockGeneration.status}, progress: ${mockGeneration.progress}`)
      return mockGeneration
    }

    console.log(`[GenerationService] Generation NOT FOUND for id: ${id}`)
    return null
  }

  static async updateGeneration(id: string, updates: Partial<Generation>): Promise<void> {
    console.log(`[GenerationService] updateGeneration called for id: ${id}, updates:`, JSON.stringify(updates))

    // 更新数据库时清除缓存，下次查询会重新加载
    generationCache.delete(id)

    const { error } = await supabaseAdmin
      .from('generations')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      console.log(`[GenerationService] Database update error for id ${id}: ${error.message || error}, falling back to memory`)
      const mockGeneration = mockGenerations.get(id)
      if (mockGeneration) {
        const updated = {
          ...mockGeneration,
          ...updates,
          updated_at: new Date().toISOString()
        }
        mockGenerations.set(id, updated)
        console.log(`[GenerationService] Successfully updated memory for id: ${id}, new status: ${updated.status}, progress: ${updated.progress}`)
      } else {
        console.log(`[GenerationService] Could not find generation in memory for id: ${id}`)
      }
    } else {
      console.log(`[GenerationService] Successfully updated database for id: ${id}`)
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
    console.log(`[GenerationService] generateHeadshots started for id: ${generationId}`)
    const generation = await this.getGeneration(generationId)
    if (!generation) {
      console.log(`[GenerationService] generateHeadshots FAILED - generation not found: ${generationId}`)
      throw new Error('Generation not found')
    }
    console.log(`[GenerationService] Found generation - style_count: ${generation.style_count}`)

    await this.updateGeneration(generationId, { 
      status: 'processing',
      started_at: new Date().toISOString(),
      current_step: 'Initializing generation...'
    })

    const maxStylesForTesting = 3
const stylesToGenerate = Object.keys(STYLE_CONFIGS).slice(0, Math.min(generation.style_count, maxStylesForTesting))
console.log(`[GenerationService] Testing mode - limiting to ${maxStylesForTesting} styles`)
    const batchSize = 5
    const batches: string[][] = []
    
    for (let i = 0; i < stylesToGenerate.length; i += batchSize) {
      batches.push(stylesToGenerate.slice(i, i + batchSize))
    }

    console.log(`[GenerationService] Generating ${stylesToGenerate.length} styles in ${batches.length} batches`)

    const outputUrls: string[] = []
    const maxRetries = 1
    const totalStyles = stylesToGenerate.length
    let completedStyles = 0

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex]
      console.log(`[GenerationService] Processing batch ${batchIndex + 1}/${batches.length} (${batch.length} styles)`)
      
      await this.updateGeneration(generationId, { 
        current_step: `Generating batch ${batchIndex + 1}/${batches.length}...`
      })

      const batchPromises = batch.map(styleId => 
        this.generateWithRetry(generation.input_photos[0], styleId, maxRetries)
      )

      const batchResults = await Promise.all(batchPromises)
      const validResults = batchResults.filter(Boolean)
      outputUrls.push(...validResults)
      completedStyles += batch.length

      const progress = Math.round((completedStyles / totalStyles) * 100)
      console.log(`[GenerationService] Batch ${batchIndex + 1} completed - progress: ${progress}%, total outputs: ${outputUrls.length}`)
      await this.updateGeneration(generationId, { 
        progress, 
        output_photos: outputUrls 
      })
    }

    console.log(`[GenerationService] Generation completed for id: ${generationId}, total outputs: ${outputUrls.length}`)
    await this.updateGeneration(generationId, { 
      status: 'completed', 
      progress: 100,
      output_photos: outputUrls,
      completed_at: new Date().toISOString(),
      current_step: 'Generation complete!'
    })
  }

  private static isMockMode(): boolean {
    const mode = process.env.GENERATION_MODE?.toLowerCase()
    if (mode === 'mock') return true
    if (mode === 'replicate') return false
    // Default: use mock if no API key, otherwise use replicate
    return !process.env.REPLICATE_API_KEY
  }

  private static async generateWithRetry(faceImageUrl: string, styleId: string, maxRetries: number): Promise<string> {
    let attempts = 0
    let lastError: Error | undefined

    while (attempts <= maxRetries) {
      try {
        return await this.generateSingleStyle(faceImageUrl, styleId)
      } catch (error) {
        lastError = error as Error
        attempts++
        if (attempts <= maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
      }
    }

    console.error(`Failed to generate ${styleId} after ${maxRetries + 1} attempts:`, lastError)
    return this.generateMockImage(styleId)
  }

  private static async generateSingleStyle(faceImageUrl: string, styleId: string): Promise<string> {
    const styleConfig = STYLE_CONFIGS[styleId]
    if (!styleConfig) throw new Error(`Style ${styleId} not found`)

    if (this.isMockMode()) {
      return this.generateMockImage(styleId)
    }

    console.log(`[GenerationService] Generating ${styleId} with Replicate API...`)
    
    const prompt = `${styleConfig.prompt}, ${QUALITY_SUFFIX}`

    const replicateApiKey = process.env.REPLICATE_API_KEY
    const modelName = process.env.REPLICATE_MODEL_NAME || 'google/nano-banana-2'

    const maxRetries = 5
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[GenerationService] Calling Replicate API for ${styleId} (attempt ${attempt}/${maxRetries})...`)
        console.log(`[GenerationService] Using model: ${modelName}`)
        
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
                image_input: [faceImageUrl],
                aspect_ratio: 'match_input_image',
                output_format: 'jpg',
              },
            }),
          },
          30000
        )

        console.log(`[GenerationService] Replicate API response status: ${response.status}`)
        
        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get('Retry-After') || '10')
          const waitTime = Math.pow(2, attempt) * 1000 + retryAfter * 1000
          console.warn(`[GenerationService] Rate limited (429) for ${styleId}. Retrying in ${waitTime/1000}s...`)
          await new Promise(resolve => setTimeout(resolve, waitTime))
          continue
        }

        const data = await response.json()
        console.log(`[GenerationService] Replicate API response data:`, JSON.stringify(data).substring(0, 500))
        
        if (response.status === 422) {
          console.error(`[GenerationService] Request validation failed (422) for ${styleId}:`, JSON.stringify(data))
          return this.generateMockImage(styleId)
        }
        
        if (data.error) {
          console.error(`[GenerationService] Error generating ${styleId}:`, data.error)
          return this.generateMockImage(styleId)
        }

        if (!data.id) {
          console.error(`[GenerationService] No prediction ID returned for ${styleId}`)
          return this.generateMockImage(styleId)
        }

        console.log(`[GenerationService] Prediction ID: ${data.id}, status: ${data.status}`)

        let result = data
        let pollCount = 0
        while (result.status !== 'succeeded' && result.status !== 'failed') {
          pollCount++
          console.log(`[GenerationService] Polling ${styleId} - attempt ${pollCount}, status: ${result.status}`)
          await new Promise(resolve => setTimeout(resolve, 2000))
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

        console.log(`[GenerationService] ${styleId} completed with status: ${result.status}`)
        return result.output || this.generateMockImage(styleId)
      } catch (error) {
        console.error(`[GenerationService] Exception generating ${styleId} (attempt ${attempt}):`, error)
        if (attempt < maxRetries) {
          const waitTime = Math.pow(2, attempt) * 1000
          console.log(`[GenerationService] Retrying ${styleId} in ${waitTime/1000}s...`)
          await new Promise(resolve => setTimeout(resolve, waitTime))
        }
      }
    }

    console.error(`[GenerationService] Failed to generate ${styleId} after ${maxRetries} attempts`)
    return this.generateMockImage(styleId)
  }

  private static generateMockImage(styleId: string): string {
    const colorHash = styleId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const hue = colorHash % 360
    const styleName = styleId.replace(/_/g, ' ')
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024"><rect width="100%" height="100%" fill="hsl(${hue}, 70%, 85%)"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="48" fill="hsl(${hue}, 60%, 50%)">${styleName}</text></svg>`
    return `data:image/svg+xml,${encodeURIComponent(svgContent)}`
  }

  static getStyleConfigs(): StyleConfig[] {
    return Object.values(STYLE_CONFIGS)
  }

  static getStyleConfig(id: string): StyleConfig | undefined {
    return STYLE_CONFIGS[id]
  }
}
