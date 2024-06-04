import { ReactNode } from "react"

import { cn } from "@/lib/utils"

export function FormSection({ label, children, className, horizontal }: {
  label?: string
  children?: ReactNode
  className?: string
  horizontal?: boolean
}) {
  return (
    <div className={cn(`flex flex-col space-y-4`)}>
      <h2 className="text-4xl font-thin pb-2 text-stone-400">{label}</h2>
      <div className={cn(
        "flex",
        horizontal
        ? "flex-row space-x-3 justify-start"
        : "flex-col space-y-6"
        )}>
        {children}
      </div>
    </div>
  )
}