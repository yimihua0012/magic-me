import { NextResponse } from 'next/server'
import { GenerationService } from '@backend/services'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { faceImageUrl, styleIds } = body

    if (!faceImageUrl) {
      return NextResponse.json(
        { error: 'faceImageUrl is required' },
        { status: 400 }
      )
    }

    const generation = await GenerationService.createGeneration({
      userId: 'demo-user',
      faceImageUrl,
      styleIds: styleIds || GenerationService.getStyleConfigs().map(s => s.id)
    })

    setTimeout(() => {
      GenerationService.generateHeadshots(generation.id)
    }, 100)

    return NextResponse.json({
      taskId: generation.id,
      status: generation.status,
      estimatedTime: 180
    })
  } catch (error) {
    console.error('Error creating generation:', error)
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

    if (!taskId) {
      // Return generation mode configuration
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

    const generation = await GenerationService.getGeneration(taskId)
    if (!generation) {
      return NextResponse.json(
        { error: 'Generation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      taskId: generation.id,
      status: generation.status,
      progress: generation.progress,
      outputUrls: generation.output_photos
    })
  } catch (error) {
    console.error('Error getting generation:', error)
    return NextResponse.json(
      { error: 'Failed to get generation' },
      { status: 500 }
    )
  }
}