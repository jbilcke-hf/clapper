import { ReactNode } from "react"

import { cn } from "@/lib/utils"

export function FormSection({ label, children, className, horizontal }: {
  label?: string
  children?: ReactNode
  className?: string
  horizontal?: boolean
}) {
  return (
    <div className={cn(`
    flex flex-col space-y-4
    h-full w-full
    scrollbar-corner-stone-500 scrollbar scrollbar-thumb-stone-700 scrollbar-track-stone-300
    overflow-y-scroll
    `, className)}>
      <h2 className="text-4xl font-thin pb-2 text-stone-400">{label}</h2>
      <div className={cn(
        "flex w-full",
        horizontal
        ? "flex-row space-x-3 justify-start"
        : "flex-col space-y-6"
        )}>
        {children}
      </div>
    </div>
  )
}