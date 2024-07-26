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
        `flex h-full w-full flex-col space-y-2 overflow-y-scroll scrollbar scrollbar-track-stone-300 scrollbar-thumb-stone-700 scrollbar-corner-stone-500`,
        className
      )}
    >
      <h2 className="pb-2 text-xl font-normal text-white/45">{label}</h2>
      <div className={cn('flex w-full', 'flex-col space-y-4')}>{children}</div>
    </div>
  )
}
