import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'accent'
export type ButtonSize = 'sm' | 'md' | 'lg'

const baseStyles =
  'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-600/30 hover:-translate-y-0.5',
  secondary: 'bg-white text-primary-600 border-2 border-primary-200 hover:border-primary-400 hover:bg-primary-50',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  accent: 'bg-accent-500 text-white hover:bg-accent-600 shadow-lg shadow-accent-500/25 hover:shadow-xl hover:-translate-y-0.5',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

export function buttonStyles({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
} = {}) {
  return cn(baseStyles, variants[variant], sizes[size], className)
}
