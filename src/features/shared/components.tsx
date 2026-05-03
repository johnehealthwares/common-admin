import { Button } from '@/components/ui/button'
import { compactUI } from '@/lib/compact-ui'

/**
 * Compact button for data grids and dense layouts.
 */
export function CompactButton({
  children,
  variant = 'ghost',
  size = 'sm',
  ...props
}: Omit<React.ComponentProps<typeof Button>, 'size'> & {
  size?: 'xs' | 'sm' | 'compact'
}) {
  const sizeClass = {
    xs: compactUI.control.small,
    sm: compactUI.control.small,
    compact: compactUI.control.compact,
  }[size]

  return (
    <Button
      variant={variant}
      size='sm'
      className={`${sizeClass} h-6 gap-1 font-medium`}
      {...props}
    >
      {children}
    </Button>
  )
}

/**
 * Keyboard shortcut hint display.
 */
export function KeyboardHint({ keys }: { keys: string[] }) {
  return (
    <span className='inline-flex gap-1 text-[10px] font-mono text-muted-foreground/60 tracking-wide'>
      {keys.map((key, i) => (
        <span key={i}>
          {i > 0 && <span className='mx-1'>+</span>}
          <kbd className='rounded-sm border border-border bg-muted/50 px-1 py-0.5'>{key}</kbd>
        </span>
      ))}
    </span>
  )
}
