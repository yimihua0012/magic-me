// Generation Types
export type GenerationStatus = 'pending' | 'processing' | 'completed' | 'failed'

export type PlanType = 'basic' | 'pro'

export interface Generation {
  id: string
  user_id: string
  status: GenerationStatus
  plan_type: PlanType
  style_count: number
  input_photos: string[]
  output_photos: string[]
  progress: number
  current_step?: string
  stripe_payment_id?: string
  amount_paid?: number
  currency?: string
  created_at: string
  updated_at?: string
  started_at?: string
  completed_at?: string
  metadata?: Record<string, unknown>
  error_message?: string
}

export interface CreateGenerationInput {
  user_id: string
  plan_type: PlanType
  style_count: number
  input_photos: string[]
  stripe_payment_id?: string
  amount_paid?: number
}

export interface UpdateGenerationInput {
  status?: GenerationStatus
  plan_type?: PlanType
  style_count?: number
  input_photos?: string[]
  output_photos?: string[]
  progress?: number
  current_step?: string
  stripe_payment_id?: string
  amount_paid?: number
  metadata?: Record<string, unknown>
  error_message?: string
}

export interface GenerationProgress {
  id: string
  progress: number
  currentStep: string
  status: GenerationStatus
}

// AI Generation Steps
export const GENERATION_STEPS = {
  ANALYZING: 'Analyzing your photos...',
  DETECTING: 'Detecting facial features...',
  GENERATING_BASE: 'Generating base model...',
  APPLYING_LIGHTING: 'Applying professional lighting...',
  CREATING_VARIATIONS: 'Creating style variations...',
  APPLYING_FINISHING: 'Applying finishing touches...',
  FINALIZING: 'Finalizing your headshots...',
  COMPLETE: 'Your headshots are ready!',
} as const

export type GenerationStep = keyof typeof GENERATION_STEPS

// Style Configuration
export interface StyleConfig {
  id: string
  name: string
  category: string
  prompt: string
  negative: string
}
