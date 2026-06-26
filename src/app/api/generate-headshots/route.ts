import { NextResponse } from 'next/server'
import { GenerationService } from '@backend/services'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@backend/config/supabase'
import { CreditPackageService } from '@backend/services'

export const dynamic = 'force-dynamic'

async function getCurrentUser(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    try {
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
      if (!error && user) {
        return user
      }
    } catch (e) {
      console.error('[Auth] Error verifying bearer token:', e)
    }
  }
  
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user || null
}

export async function POST(request: Request) {
  try {
    console.log('[API POST] Request received')
    
    const user = await getCurrentUser(request)
    console.log('[API POST] Auth check completed, user:', user?.id || 'none')
    
    if (!user) {
      console.warn('[API POST] Authentication required')
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    console.log('[API POST] Parsing request body...')
    const body = await request.json()
    console.log('[API POST] Request body parsed successfully')
    
    const { faceImageUrl, styleIds } = body
    console.log(`[API POST] faceImageUrl: ${faceImageUrl?.substring(0, 50)}..., styleIds count: ${styleIds?.length || 'all'}`)

    if (!faceImageUrl) {
      console.log('[API POST] Error: faceImageUrl is required')
      return NextResponse.json(
        { error: 'faceImageUrl is required' },
        { status: 400 }
      )
    }

    // 确定本次生成需要消耗的次数（风格数量）
    if (styleIds && (!Array.isArray(styleIds) || styleIds.some((styleId) => typeof styleId !== 'string'))) {
      return NextResponse.json(
        { error: 'styleIds must be an array of strings' },
        { status: 400 }
      )
    }

    const styleCount = styleIds?.length || 30
    console.log(`[API POST] Credits needed: ${styleCount}`)

    if (styleCount < 1 || styleCount > 120) {
      return NextResponse.json(
        { error: 'Invalid style count' },
        { status: 400 }
      )
    }

    // 检查是否有足够的信用次数
    const hasEnough = await CreditPackageService.hasEnoughCredits(user.id, styleCount)
    if (!hasEnough) {
      console.warn(`[API POST] Insufficient credits - needed: ${styleCount}`)
      return NextResponse.json(
        { error: 'No available credits. Please purchase a plan first.' },
        { status: 402 }
      )
    }

    // 创建并激活生成（会自动预扣信用次数）
    const generation = await GenerationService.createAndActivateGeneration({
      userId: user.id,
      faceImageUrl,
      styleIds,
    })
    console.log(`[API POST] Created and activated generation: ${generation.id}`)

    // 后台异步生成
    GenerationService.generateHeadshots(generation.id).then(() => {
      console.log(`[API POST] Generation completed for taskId: ${generation.id}`)
    }).catch(async (error) => {
      console.error('[API POST] Background generation error:', error)
      // 生成失败时回退信用次数
      try {
        const gen = await GenerationService.getGeneration(generation.id)
        const consumedCredits = Array.isArray(gen?.metadata?.consumedCredits)
          ? gen.metadata.consumedCredits as { packageId: string; amount: number }[]
          : []

        if (consumedCredits.length > 0) {
          await Promise.all(consumedCredits.map(({ packageId, amount }) =>
            CreditPackageService.refundCredits(packageId, amount)
          ))
          console.log(`[API POST] Refunded credits for generation ${generation.id}`)
        } else if (gen?.credit_package_id && gen?.credits_used) {
          await CreditPackageService.refundCredits(gen.credit_package_id, gen.credits_used)
          console.log(`[API POST] Refunded ${gen.credits_used} credits to package ${gen.credit_package_id}`)
        }
      } catch (refundError) {
        console.error('[API POST] Failed to refund credits:', refundError)
      }
    })
    console.log(`[API POST] Started background generation for taskId: ${generation.id}`)

    return NextResponse.json({
      taskId: generation.id,
      status: 'processing',
      estimatedTime: 180
    })
  } catch (error) {
    console.error('[API POST] Error creating generation:', error)
    const message = error instanceof Error ? error.message : ''
    if (message.includes('Insufficient credits') || message.includes('Concurrent credit update')) {
      return NextResponse.json(
        { error: 'No available credits. Please purchase a plan first.' },
        { status: 402 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create generation' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('taskId')
    console.log(`[API GET] Request received - taskId: ${taskId || 'none'}`)

    if (!taskId) {
      console.log(`[API GET] Returning config (no taskId)`)
      const mode = process.env.GENERATION_MODE?.toLowerCase()
      const hasApiKey = !!process.env.REPLICATE_API_KEY
      const isMockMode = mode === 'mock' || (!mode && !hasApiKey)

      return NextResponse.json({
        generationMode: isMockMode ? 'mock' : 'replicate',
        hasReplicateKey: hasApiKey,
        modelVersion: process.env.REPLICATE_MODEL_VERSION || 'f65a676869e16bc5474c291f55ba299250d979897d165810020079f9eea8f574',
        config: {
          guidanceScale: parseFloat(process.env.REPLICATE_GUIDANCE_SCALE || '7.5'),
          numInferenceSteps: parseInt(process.env.REPLICATE_INFERENCE_STEPS || '30')
        }
      })
    }

    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    console.log(`[API GET] Looking up generation for taskId: ${taskId}`)
    const generation = await GenerationService.getGeneration(taskId)
    
    if (!generation) {
      console.log(`[API GET] Generation NOT FOUND for taskId: ${taskId}`)
      return NextResponse.json(
        { error: 'Generation not found' },
        { status: 404 }
      )
    }

    if (generation.user_id !== user.id) {
      console.warn(`[API GET] Forbidden generation access - user: ${user.id}, generation: ${generation.id}`)
      return NextResponse.json(
        { error: 'Generation not found' },
        { status: 404 }
      )
    }

    console.log(`[API GET] Found generation - id: ${generation.id}, status: ${generation.status}, progress: ${generation.progress}, outputUrls count: ${generation.output_photos?.length || 0}`)

    // 添加短缓存头 - 生成状态每5秒刷新一次足够
    return NextResponse.json(
      {
        taskId: generation.id,
        status: generation.status,
        progress: generation.progress,
        outputUrls: generation.output_photos,
      },
      {
        headers: {
          'Cache-Control': 'private, max-age=5, stale-while-revalidate=10',
        },
      }
    )
  } catch (error) {
    console.error('[API GET] Error getting generation:', error)
    return NextResponse.json(
      { error: 'Failed to get generation' },
      { status: 500 }
    )
  }
}
