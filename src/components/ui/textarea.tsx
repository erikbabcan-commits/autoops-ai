import * as React from 'react'
import { cn } from '@/lib/utils'

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      'flex min-h-28 w-full rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm text-foreground shadow-inner placeholder:text-muted-foreground focus-visible:border-cyber-cyan/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-cyan/25 disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    ref={ref}
    {...props}
  />
))
Textarea.displayName = 'Textarea'

export { Textarea }
