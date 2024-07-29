import { useEffect } from 'react'
import { RiFullscreenLine, RiFullscreenExitLine } from 'react-icons/ri'

import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useFullscreenStatus } from '@/lib/hooks'

export function ToggleFullScreen({
  className = '',
}: {
  className?: string
} = {}) {
  const [isFullscreen, setFullscreen, ref] = useFullscreenStatus()

  // we want the whole body to become fullscreen
  // TODO: use pointer lock, to prevent the mouse from going up
  useEffect(() => {
    if (typeof window !== 'undefined') {
      ref.current = document.body
    }
  }, [ref])

  return (
    <Tooltip>
      <TooltipTrigger className="">
        <div
          className={cn(
            `grid h-4 w-5 scale-100 cursor-pointer grid-cols-4 grid-rows-4 overflow-hidden rounded border border-neutral-100 opacity-70 transition-all duration-200 ease-in-out hover:scale-110 hover:opacity-100`,
            className
          )}
          onClick={() => {
            setFullscreen(!isFullscreen)
          }}
        >
          <div className="flex h-4 w-4 items-center justify-center">
            <RiFullscreenLine
              className={cn(
                `absolute -mt-0.5 ml-0.5 h-3 w-3`,
                `transition-all duration-200 ease-in-out`,
                !isFullscreen ? 'opacity-100' : 'opacity-0'
              )}
            />
            <RiFullscreenExitLine
              className={cn(
                `absolute -mt-0.5 ml-0.5 h-3 w-3`,
                `transition-all duration-200 ease-in-out`,
                isFullscreen ? 'opacity-100' : 'opacity-0'
              )}
            />
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent className={cn(`mr-4 mt-2 flex text-xs font-light`)}>
        Toggle fullscreen
      </TooltipContent>
    </Tooltip>
  )
}
