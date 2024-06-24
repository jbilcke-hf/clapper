
import { CgSpinnerTwoAlt } from "react-icons/cg"

import { cn } from "@/lib/utils"

export function ActivitySpinner({
  className = "",
  isBusy = false,
  color = "",
}: {
  className?: string
  isBusy?: boolean
  color?: string
}) {
  return (
    <CgSpinnerTwoAlt
      className={cn(
        `w-2 h-2`,
        className,
        isBusy
        ? 'opacity-100 animate-spin'
        : 'opacity-0',
      )}
      style={{ color }}
    />
  )
}