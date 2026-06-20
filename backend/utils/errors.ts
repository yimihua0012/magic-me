// Custom Error Classes

export class AppError extends Error {
  public statusCode: number
  public isOperational: boolean
  public code?: string

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
    this.code = code

    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  public errors: string[]

  constructor(message: string, errors: string[] = []) {
    super(message, 400, 'VALIDATION_ERROR')
    this.errors = errors
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR')
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403, 'AUTHORIZATION_ERROR')
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND')
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT')
  }
}

export class RateLimitError extends AppError {
  public retryAfter?: number

  constructor(message: string = 'Too many requests', retryAfter?: number) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED')
    this.retryAfter = retryAfter
  }
}

export class PaymentError extends AppError {
  constructor(message: string = 'Payment failed') {
    super(message, 402, 'PAYMENT_ERROR')
  }
}

export class StripeWebhookError extends AppError {
  constructor(message: string = 'Invalid webhook signature') {
    super(message, 400, 'STRIPE_WEBHOOK_ERROR')
  }
}

// Error handler wrapper
export function asyncHandler(
  fn: (req: any, res: any, next: any) => Promise<any>
) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

// Format error response
export function formatErrorResponse(error: AppError): {
  success: false
  error: {
    message: string
    code?: string
    errors?: string[]
  }
} {
  return {
    success: false,
    error: {
      message: error.message,
      code: error.code,
      errors: 'errors' in error ? (error as any).errors : undefined,
    },
  }
}
