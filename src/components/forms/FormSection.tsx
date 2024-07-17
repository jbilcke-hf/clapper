import { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export function FormSection({
  label,
  children,
  className,
  horizontal,
}: {
  label?: string
  children?: ReactNode
  className?: string
  horizontal?: boolean
}) {
  return (
    <div
      className={cn(
        `flex h-full w-full flex-col space-y-4 overflow-y-scroll scrollbar scrollbar-track-stone-300 scrollbar-thumb-stone-700 scrollbar-corner-stone-500`,
        className
      )}
    >
      <h2 className="pb-2 text-4xl font-thin text-stone-400">{label}</h2>
      <div
        className={cn(
          'flex w-full',
          horizontal ? 'flex-row justify-start space-x-3' : 'flex-col space-y-6'
        )}
      >
        {children}
      </div>
    </div>
  )
}
