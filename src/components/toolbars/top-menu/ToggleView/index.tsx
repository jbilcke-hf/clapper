import { ReactNode } from 'react'

import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function ToggleView({
  children,
  isVisible = false,
  setVisible,
  className = '',
}: {
  children?: ReactNode
  isVisible?: boolean
  setVisible: (isVisible: boolean) => void
  className?: string
}) {
  return (
    <Tooltip>
      <TooltipTrigger className="">
        <div
          className={cn(
            `group grid h-4 w-5 scale-100 cursor-pointer grid-cols-4 grid-rows-4 overflow-hidden rounded border border-neutral-100 opacity-70 transition-all duration-200 ease-in-out hover:scale-110 hover:opacity-100`
          )}
          onClick={() => {
            setVisible(!isVisible)
          }}
        >
          <div
            className={cn(
              `flex transition-all duration-200 ease-in-out group-hover:scale-110 group-hover:border-stone-100`,
              isVisible
                ? `border-neutral-100 bg-neutral-400`
                : `border-neutral-400`,
              className
            )}
          ></div>
        </div>
      </TooltipTrigger>
      <TooltipContent className={cn(`mr-4 mt-2 flex text-xs font-light`)}>
        {children}
      </TooltipContent>
    </Tooltip>
  )
}
