import { cn } from '@/lib/utils'

/**
 * Compact button variant for data grids and operator consoles.
 * 28-32px height, minimal padding, optimized for dense layouts.
 */
export function useCompactButtonClass(
  variant?: 'default' | 'ghost' | 'outline' | 'secondary',
  size?: 'xs' | 'sm'
) {
  const sizeClass =
    size === 'xs'
      ? 'h-6 px-2 text-[11px]'
      : size === 'sm'
        ? 'h-7 px-2.5 text-xs'
        : 'h-8 px-3 text-xs'

  const variantClass = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    ghost: 'hover:bg-muted text-foreground',
    outline: 'border border-input hover:bg-muted',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  }[variant || 'default']

  return cn(
    'inline-flex items-center justify-center gap-1 rounded-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
    sizeClass,
    variantClass
  )
}

/**
 * Compact input class for forms in data-dense layouts.
 */
export function useCompactInputClass() {
  return 'h-7 px-2.5 text-xs rounded-sm border border-input bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0'
}

/**
 * Compact select field class.
 */
export function useCompactSelectClass() {
  return 'h-7 px-2.5 text-xs rounded-sm border border-input bg-background'
}

/**
 * Compact table row height (28px).
 */
export const compactRowHeight = 'h-[28px]'

/**
 * Compact cell padding for data tables.
 */
export const compactCellPadding = 'px-3 py-1'

/**
 * Text size for compact headers.
 */
export const compactHeaderText = 'text-[11px] font-semibold uppercase tracking-widest'
