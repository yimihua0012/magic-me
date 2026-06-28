import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

type ButtonStyleOptions = {
  variant?: ButtonProps['variant']
  size?: ButtonProps['size']
  className?: string
}

const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed touch-target'

const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-600/30 hover:-translate-y-0.5',
  secondary: 'bg-white text-primary-600 border-2 border-primary-200 hover:border-primary-400 hover:bg-primary-50',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  accent: 'bg-accent-500 text-white hover:bg-accent-600 shadow-lg shadow-accent-500/25 hover:shadow-xl hover:-translate-y-0.5',
}

const sizes = {
  sm: 'px-4 py-2 text-sm min-h-[44px]',
  md: 'px-6 py-3 text-base min-h-[48px]',
  lg: 'px-8 py-4 text-lg min-h-[56px]',
}

export function buttonStyles({ variant = 'primary', size = 'md', className }: ButtonStyleOptions = {}) {
  return cn(baseStyles, variants[variant], sizes[size], className)
}

export default function Button({
  className,
  variant = 'primary',
  size = 'md',
  isLoading,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonStyles({ variant, size, className })}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="-ml-1 mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </>
      ) : children}
    </button>
  )
}
