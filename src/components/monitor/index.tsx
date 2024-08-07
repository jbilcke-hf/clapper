import { MdZoomOutMap } from 'react-icons/md'

import { cn } from '@/lib/utils'
import { useFullscreenStatus } from '@/lib/hooks'

import { UniversalPlayer } from './UniversalPlayer'
import { PlayerControls } from './PlayerControls'
import { useUI } from '@/services/ui'
import { useTheme } from '@/services/ui/useTheme'
import { UIWindowLayout } from '@aitube/clapper-services'

export function Monitor() {
  const [isFullscreen, setFullscreen, ref] = useFullscreenStatus()
  const theme = useTheme()
  const windowLayout = useUI((s) => s.windowLayout)

  return (
    <div
      ref={ref as any}
      className={cn(
        `flex h-full w-full flex-col items-center justify-between overflow-hidden px-2 transition-colors`
      )}
      style={{
        background: theme?.monitorBgColor || theme?.defaultBgColor || '',
      }}
    >
      <UniversalPlayer />
      <PlayerControls />
      {windowLayout === UIWindowLayout.GRID && (
        <div className="absolute right-0 top-0 z-20">
          <div
            onClick={() => setFullscreen()}
            className={cn(
              `cursor-pointer rounded-full p-2`,
              `transition-all duration-100 ease-in-out`,
              isFullscreen
                ? `opacity-0`
                : `scale-95 opacity-70 hover:scale-100 hover:opacity-100`
            )}
          >
            <MdZoomOutMap className="h-7 w-7" />
          </div>
        </div>
      )}
    </div>
  )
}
