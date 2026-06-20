import { generationRepository } from '../db/repositories'
import { Generation, CreateGenerationInput, GenerationStatus, GENERATION_STEPS } from '../types'
import { generationService } from './generation.service'

export class GenerationService {
  async createGeneration(userId: string, planType: 'basic' | 'pro', inputPhotos: string[]): Promise<Generation> {
    const styleCount = planType === 'pro' ? 100 : 30

    const input: CreateGenerationInput = {
      user_id: userId,
      plan_type: planType,
      style_count: styleCount,
      input_photos: inputPhotos,
    }

    return generationRepository.create(input)
  }

  async getGeneration(id: string): Promise<Generation | null> {
    return generationRepository.findById(id)
  }

  async getUserGenerations(userId: string, limit = 10): Promise<Generation[]> {
    return generationRepository.findByUserId(userId, limit)
  }

  async updateGenerationStatus(id: string, status: GenerationStatus): Promise<void> {
    await generationRepository.updateStatus(id, status)
  }

  async updateProgress(id: string, progress: number): Promise<void> {
    let currentStep: string

    if (progress < 15) {
      currentStep = GENERATION_STEPS.ANALYZING
    } else if (progress < 35) {
      currentStep = GENERATION_STEPS.DETECTING
    } else if (progress < 55) {
      currentStep = GENERATION_STEPS.GENERATING_BASE
    } else if (progress < 75) {
      currentStep = GENERATION_STEPS.APPLYING_LIGHTING
    } else if (progress < 90) {
      currentStep = GENERATION_STEPS.CREATING_VARIATIONS
    } else if (progress < 100) {
      currentStep = GENERATION_STEPS.APPLYING_FINISHING
    } else {
      currentStep = GENERATION_STEPS.FINALIZING
    }

    await generationRepository.updateProgress(id, progress, currentStep)
  }

  async completeGeneration(id: string, outputPhotos: string[]): Promise<void> {
    await generationRepository.complete(id, outputPhotos)
  }

  async failGeneration(id: string, errorMessage: string): Promise<void> {
    await generationRepository.fail(id, errorMessage)
  }

  async deleteGeneration(id: string): Promise<void> {
    await generationRepository.delete(id)
  }

  async startGeneration(id: string): Promise<void> {
    await generationRepository.updateStatus(id, 'processing')
    
    // Simulate generation progress
    // In production, this would trigger an actual AI generation job
    const generation = await generationRepository.findById(id)
    if (!generation) {
      throw new Error('Generation not found')
    }

    // Simulate progress updates
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 2000))
      await this.updateProgress(id, progress)
    }

    // Generate mock output photos (in production, these would be real AI-generated images)
    const outputPhotos = Array(generation.style_count)
      .fill(null)
      .map((_, i) => `https://picsum.photos/seed/${id}-${i}/1024/1024`)

    await this.completeGeneration(id, outputPhotos)
  }
}

export const generationService = new GenerationService()
