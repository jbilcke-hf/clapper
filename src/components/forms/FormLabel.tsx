import { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export function FormLabel({
  children,
  className,
}: {
  children?: ReactNode
  className?: string
}) {
  return (
    <label className={cn(`font-mono text-xs text-white/70`, className)}>
      {children}
    </label>
  )
}
