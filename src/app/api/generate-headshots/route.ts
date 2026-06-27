import { NextResponse } from 'next/server'
import { CreditPackageService, GenerationService } from '@backend/services'
import { supabaseAdmin } from '@backend/config/supabase'
import { getCurrentUser } from '@/lib/auth/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { faceImageUrl, styleIds, clientGenerationId } = body

    if (!faceImageUrl) {
      return NextResponse.json(
        { error: 'faceImageUrl is required' },
        { status: 400 }
      )
    }

    if (!Array.isArray(styleIds) || styleIds.some((styleId) => typeof styleId !== 'string')) {
      return NextResponse.json(
        { error: 'styleIds must be an array of strings' },
        { status: 400 }
      )
    }

    if (clientGenerationId !== undefined && typeof clientGenerationId !== 'string') {
      return NextResponse.json(
        { error: 'clientGenerationId must be a string' },
        { status: 400 }
      )
    }

    const styleCount = styleIds.length
    if (styleCount < 1 || styleCount > 120) {
      return NextResponse.json(
        { error: 'Invalid style count' },
        { status: 400 }
      )
    }

    const generation = await GenerationService.createAndActivateGeneration({
      userId: user.id,
      faceImageUrl,
      styleIds,
      clientGenerationId,
    })

    if (!generation.reused) {
      GenerationService.generateHeadshots(generation.id).catch(async (error) => {
        console.error('[GenerateHeadshots] Background generation error:', error)
        try {
          const gen = await GenerationService.getGeneration(generation.id)
          const consumedCredits = Array.isArray(gen?.metadata?.consumedCredits)
            ? gen.metadata.consumedCredits as { packageId: string; amount: number }[]
            : []

          if (consumedCredits.length > 0) {
            await Promise.all(consumedCredits.map(({ packageId, amount }) =>
              CreditPackageService.refundCredits(packageId, amount)
            ))
          } else if (gen?.credit_package_id && gen?.credits_used) {
            await CreditPackageService.refundCredits(gen.credit_package_id, gen.credits_used)
          }
        } catch (refundError) {
          console.error('[GenerateHeadshots] Failed to refund credits:', refundError)
        }
      })
    }

    return NextResponse.json({
      taskId: generation.id,
      status: 'processing',
      estimatedTime: 180,
    })
  } catch (error) {
    console.error('[GenerateHeadshots] Error creating generation:', error)
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

    if (!taskId) {
      return NextResponse.json({
        service: 'generation',
        status: process.env.REPLICATE_API_KEY ? 'configured' : 'not_configured',
      })
    }

    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { data: generation, error } = await supabaseAdmin
      .from('generations')
      .select('id,user_id,status,progress,current_step,output_photos')
      .eq('id', taskId)
      .maybeSingle()

    if (error) {
      console.error('[GenerateHeadshots] Error querying generation:', error)
      return NextResponse.json(
        { error: 'Failed to get generation' },
        { status: 500 }
      )
    }

    if (!generation || generation.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Generation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        taskId: generation.id,
        status: generation.status,
        progress: generation.progress,
        currentStep: generation.current_step,
        outputUrls: generation.output_photos,
      },
      {
        headers: {
          'Cache-Control': 'private, max-age=5, stale-while-revalidate=10',
        },
      }
    )
  } catch (error) {
    console.error('[GenerateHeadshots] Error getting generation:', error)
    return NextResponse.json(
      { error: 'Failed to get generation' },
      { status: 500 }
    )
  }
}
