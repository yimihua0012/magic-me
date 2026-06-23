import { NextResponse } from 'next/server'
import { GenerationService } from '@backend/services'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    console.log('[API POST] Request received')
    const supabase = await createClient()
    console.log('[API POST] Created supabase client')
    
    const authResult = await supabase.auth.getUser()
    console.log('[API POST] Auth check completed')
    const { user } = authResult.data
    
    if (authResult.error) {
      console.warn('[API POST] Auth error:', authResult.error.message)
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

    const generation = await GenerationService.createGeneration({
      userId: user?.id || 'anonymous',
      faceImageUrl,
      styleIds: styleIds || GenerationService.getStyleConfigs().map(s => s.id)
    })
    console.log(`[API POST] Created generation: ${generation.id}`)

    GenerationService.generateHeadshots(generation.id).then(() => {
      console.log(`[API POST] Generation completed for taskId: ${generation.id}`)
    }).catch(error => {
      console.error('[API POST] Background generation error:', error)
    })
    console.log(`[API POST] Started background generation for taskId: ${generation.id}`)

    return NextResponse.json({
      taskId: generation.id,
      status: 'processing',
      estimatedTime: 180
    })
  } catch (error) {
    console.error('[API POST] Error creating generation:', error)
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

    console.log(`[API GET] Looking up generation for taskId: ${taskId}`)
    const generation = await GenerationService.getGeneration(taskId)
    
    if (!generation) {
      console.log(`[API GET] Generation NOT FOUND for taskId: ${taskId}`)
      return NextResponse.json(
        { error: 'Generation not found' },
        { status: 404 }
      )
    }

    console.log(`[API GET] Found generation - id: ${generation.id}, status: ${generation.status}, progress: ${generation.progress}, outputUrls count: ${generation.output_photos?.length || 0}`)
    
    return NextResponse.json({
      taskId: generation.id,
      status: generation.status,
      progress: generation.progress,
      outputUrls: generation.output_photos
    })
  } catch (error) {
    console.error('[API GET] Error getting generation:', error)
    return NextResponse.json(
      { error: 'Failed to get generation' },
      { status: 500 }
    )
  }
}