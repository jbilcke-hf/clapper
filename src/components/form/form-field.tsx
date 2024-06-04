import { ReactNode } from "react"

import { cn } from "@/lib/utils"

import { FormLabel } from "./form-label"

export function FormField({ label, children, className, horizontal = false }: {
  label?: string
  children?: ReactNode
  className?: string
  horizontal?: boolean
}) {
  return (
    <div className={cn(
      `flex flex-col space-y-3`,
      `text-base font-thin text-stone-400`,
      horizontal ? '' : 'w-full',
      )}>
      {label && <FormLabel>{label}</FormLabel>}
      <div className={cn(
        `flex`,
        horizontal ? '' : 'w-full',
        className
        )}>
        {children}
      </div>
    </div>
  )
}