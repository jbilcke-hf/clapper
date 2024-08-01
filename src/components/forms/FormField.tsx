import { ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { FormLabel } from './FormLabel'

export function FormField({
  label,
  children,
  className,
}: {
  label?: ReactNode
  children?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        `flex flex-col items-center justify-center`,
        `w-full`,
        `opacity-80`,
        `font-thin text-neutral-200`,
        // note: the parent component needs @container for this to work
        `@md:flex-row @md:space-x-3`
      )}
    >
      {label && (
        <div className={cn(`flex flex-row`, `mb-2 w-full @md:mb-0 @md:w-1/3`)}>
          <FormLabel>{label}</FormLabel>
        </div>
      )}
      <div
        className={cn(
          `flex flex-row items-center justify-center`,
          'w-full @md:w-2/3',
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}
