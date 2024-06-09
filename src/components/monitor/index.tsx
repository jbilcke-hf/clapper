
import { MdZoomOutMap } from "react-icons/md"

import { cn } from "@/lib/utils"
import { useFullscreenStatus } from "@/lib/hooks"

import { UniversalPlayer } from "./UniversalPlayer"
import { PlayerControls } from "./PlayerControls"

export function Monitor() {
  const [isFullscreen, setFullscreen, ref] = useFullscreenStatus()

  return (
    <div
      ref={ref as any}
      className="flex flex-col w-full h-full overflow-hidden items-center justify-between px-2">
      <UniversalPlayer />
      <PlayerControls />
      <div className="z-20 absolute right-0 top-8">
        <div
          onClick={() => setFullscreen()}
          className={cn(
          `p-2 rounded-full cursor-pointer`,
          `transition-all duration-100 ease-in-out`,
          isFullscreen ? `opacity-0` : `opacity-70 hover:opacity-100 scale-95 hover:scale-100`
          )}>
          {/*<BiFullscreen className="w-8 h-8" />*/}
          <MdZoomOutMap className="w-8 h-8" />
        </div>
      </div>
    </div>
  )
}
