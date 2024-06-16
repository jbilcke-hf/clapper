import { GoDotFill } from "react-icons/go"

import { cn } from "@/lib/utils"

export function IsBusy({
  nbPendingTasks = 0,
}: {
  nbPendingTasks?: number
}) {
  return (
    <GoDotFill
      className={cn(
        `ml-[1px] -mt-[9px] w-1.5 h-1.5 text-yellow-400`,
        nbPendingTasks > 0
        ? 'opacity-100 animate-pulse'
        : 'opacity-0'
      )}
    />
  )
}