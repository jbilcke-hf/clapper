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
    <label
      className={cn(`font-mono text-xs text-white/85`, className)}
      style={{
        textShadow: '#000000 0px 0 1px',
      }}
    >
      {children}
    </label>
  )
}
