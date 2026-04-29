import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-2xl bg-white/[0.08] shadow-[0_0_15px_rgba(0,245,255,0.03)]', className)}
      {...props}
    />
  )
}

export { Skeleton }
