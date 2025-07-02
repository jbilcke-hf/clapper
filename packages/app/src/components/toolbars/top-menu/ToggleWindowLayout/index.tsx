import { VscMultipleWindows } from 'react-icons/vsc'
import { CiGrid32 } from 'react-icons/ci'

import { GiStrawberry } from 'react-icons/gi'
import { UIWindowLayout } from '@aitube/clapper-services'

import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useUI } from '@/services'
import { BiSolidWindowAlt } from 'react-icons/bi'

export function ToggleWindowLayout({
  className = '',
}: {
  className?: string
} = {}) {
  const windowLayout = useUI((s) => s.windowLayout)
  const setWindowLayout = useUI((s) => s.setWindowLayout)

  return (
    <Tooltip>
      <TooltipTrigger className="">
        <div
          className={cn(
            `grid h-4 w-5 scale-100 cursor-pointer grid-cols-4 grid-rows-4 overflow-hidden rounded-sm border border-neutral-100 opacity-70 transition-all duration-200 ease-in-out hover:scale-110 hover:opacity-100`,
            className
          )}
          onClick={() => {
            setWindowLayout(
              windowLayout === UIWindowLayout.FLYING
                ? UIWindowLayout.GRID
                : UIWindowLayout.FLYING
            )
          }}
        >
          <div className="flex h-4 w-4 items-center justify-center">
            <GiStrawberry
              className={cn(
                `absolute -mt-0.5 ml-0.5 h-3 w-3`,
                `transition-all duration-200 ease-in-out`,
                windowLayout === UIWindowLayout.FLYING
                  ? 'opacity-100'
                  : 'opacity-0'
              )}
            />
            <BiSolidWindowAlt
              className={cn(
                `absolute -mt-0.5 ml-0.5 h-3 w-3`,
                `transition-all duration-200 ease-in-out`,
                windowLayout === UIWindowLayout.GRID
                  ? 'opacity-100'
                  : 'opacity-0'
              )}
            />
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent className={cn(`mt-2 mr-4 flex text-xs font-light`)}>
        Toggle layout
      </TooltipContent>
    </Tooltip>
  )
}
