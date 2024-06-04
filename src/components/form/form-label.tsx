import { ReactNode } from "react"

import { cn } from "@/lib/utils"

export function FormLabel({ children, className }: {
  children?: ReactNode
  className?: string
}) {
  return (
    <label className={cn(`text-sm font-normal text-gray-300/70`, className)}>{
      children
    }</label>
  )
}