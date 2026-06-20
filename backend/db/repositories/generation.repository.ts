import { supabaseAdmin } from '../../config/supabase'
import { Generation, GenerationStatus, CreateGenerationInput, UpdateGenerationInput } from '../types'

export class GenerationRepository {
  async findById(id: string): Promise<Generation | null> {
    const { data, error } = await supabaseAdmin
      .from('generations')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) return null
    return data as Generation
  }

  async findByUserId(userId: string, limit = 10): Promise<Generation[]> {
    const { data, error } = await supabaseAdmin
      .from('generations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw new Error(`Failed to fetch generations: ${error.message}`)
    return (data || []) as Generation[]
  }

  async findByStripePaymentId(paymentId: string): Promise<Generation | null> {
    const { data, error } = await supabaseAdmin
      .from('generations')
      .select('*')
      .eq('stripe_payment_id', paymentId)
      .single()

    if (error || !data) return null
    return data as Generation
  }

  async create(input: CreateGenerationInput): Promise<Generation> {
    const { data, error } = await supabaseAdmin
      .from('generations')
      .insert(input)
      .select()
      .single()

    if (error) throw new Error(`Failed to create generation: ${error.message}`)
    return data as Generation
  }

  async update(id: string, input: UpdateGenerationInput): Promise<Generation> {
    const { data, error } = await supabaseAdmin
      .from('generations')
      .update(input)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(`Failed to update generation: ${error.message}`)
    return data as Generation
  }

  async updateStatus(id: string, status: GenerationStatus): Promise<void> {
    const updates: Partial<Generation> = { status }
    
    if (status === 'processing') {
      updates.started_at = new Date().toISOString()
    } else if (status === 'completed' || status === 'failed') {
      updates.completed_at = new Date().toISOString()
    }

    const { error } = await supabaseAdmin
      .from('generations')
      .update(updates)
      .eq('id', id)

    if (error) throw new Error(`Failed to update generation status: ${error.message}`)
  }

  async updateProgress(id: string, progress: number, currentStep?: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('generations')
      .update({ progress, current_step: currentStep })
      .eq('id', id)

    if (error) throw new Error(`Failed to update generation progress: ${error.message}`)
  }

  async complete(id: string, outputPhotos: string[]): Promise<void> {
    const { error } = await supabaseAdmin
      .from('generations')
      .update({
        status: 'completed',
        progress: 100,
        current_step: 'Complete',
        output_photos: outputPhotos,
        completed_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) throw new Error(`Failed to complete generation: ${error.message}`)
  }

  async fail(id: string, errorMessage: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('generations')
      .update({
        status: 'failed',
        error_message: errorMessage,
        completed_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) throw new Error(`Failed to mark generation as failed: ${error.message}`)
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('generations')
      .delete()
      .eq('id', id)

    if (error) throw new Error(`Failed to delete generation: ${error.message}`)
  }

  async countByUserId(userId: string): Promise<number> {
    const { count, error } = await supabaseAdmin
      .from('generations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (error) throw new Error(`Failed to count generations: ${error.message}`)
    return count || 0
  }
}

export const generationRepository = new GenerationRepository()
