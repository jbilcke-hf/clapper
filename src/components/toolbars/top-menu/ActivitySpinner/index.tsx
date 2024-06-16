
import { CgSpinnerTwoAlt } from "react-icons/cg"

import { cn } from "@/lib/utils"

export function ActivitySpinner({
  className = "",
  isBusy = false,
}: {
  className?: string
  isBusy?: boolean
}) {
  return (
    <CgSpinnerTwoAlt
      className={cn(
        `w-2 h-2 text-stone-200`,
        className,
        isBusy
        ? 'opacity-100 animate-spin'
        : 'opacity-0',
      )}
    />
  )
}