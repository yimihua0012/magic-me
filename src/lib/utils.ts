import { twMerge } from 'tailwind-merge'

export function cn(...classes: (string | boolean | undefined)[]): string {
  return twMerge(classes.filter(Boolean).join(' '))
}
