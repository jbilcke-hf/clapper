import { ReactNode } from "react"

import { cn } from "@/lib/utils"

export function FormLabel({ children, className }: {
  children?: ReactNode
  className?: string
}) {
  return (
    <label className={cn(`text-base font-light text-stone-400`, className)}>{
      children
    }</label>
  )
}