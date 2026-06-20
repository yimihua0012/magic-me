// Validation Utilities

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

export interface FileValidationOptions {
  maxSize?: number // in bytes
  allowedTypes?: string[]
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
}

const DEFAULT_FILE_OPTIONS: FileValidationOptions = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  minWidth: 200,
  minHeight: 200,
}

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Password validation
export function isValidPassword(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

// File validation
export async function validateImageFile(
  file: File,
  options: FileValidationOptions = {}
): Promise<ValidationResult> {
  const opts = { ...DEFAULT_FILE_OPTIONS, ...options }
  const errors: string[] = []

  // Check file type
  if (opts.allowedTypes && !opts.allowedTypes.includes(file.type)) {
    errors.push(`Invalid file type. Allowed: ${opts.allowedTypes.join(', ')}`)
  }

  // Check file size
  if (opts.maxSize && file.size > opts.maxSize) {
    errors.push(`File size exceeds maximum of ${opts.maxSize / 1024 / 1024}MB`)
  }

  // Check dimensions
  if (opts.minWidth || opts.minHeight || opts.maxWidth || opts.maxHeight) {
    const dimensions = await getImageDimensions(file)
    
    if (opts.minWidth && dimensions.width < opts.minWidth) {
      errors.push(`Image width must be at least ${opts.minWidth}px`)
    }

    if (opts.minHeight && dimensions.height < opts.minHeight) {
      errors.push(`Image height must be at least ${opts.minHeight}px`)
    }

    if (opts.maxWidth && dimensions.width > opts.maxWidth) {
      errors.push(`Image width must not exceed ${opts.maxWidth}px`)
    }

    if (opts.maxHeight && dimensions.height > opts.maxHeight) {
      errors.push(`Image height must not exceed ${opts.maxHeight}px`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
      URL.revokeObjectURL(img.src)
    }
    img.onerror = () => {
      reject(new Error('Failed to load image'))
      URL.revokeObjectURL(img.src)
    }
    img.src = URL.createObjectURL(file)
  })
}

// UUID validation
export function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(id)
}

// Plan type validation
export function isValidPlanType(plan: string): plan is 'basic' | 'pro' | 'enterprise' {
  return ['basic', 'pro', 'enterprise'].includes(plan)
}

// Sanitize input
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .substring(0, 1000)
}
