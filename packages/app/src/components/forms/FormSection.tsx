import { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export function FormSection({
  label,
  children,
  className,
}: {
  label?: string
  children?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        '@container', // so that inputs can use container queries
        `flex h-full w-full flex-col space-y-2 overflow-y-scroll scrollbar scrollbar-track-neutral-300 scrollbar-thumb-neutral-700 scrollbar-corner-neutral-500`,
        className
      )}
    >
      <h2 className="pb-2 text-lg font-normal text-white/60">{label}</h2>
      <div className={cn('flex w-full', 'flex-col space-y-4 text-sm')}>
        {children}
      </div>
    </div>
  )
}
