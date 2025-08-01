import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import { TogglePlayback } from './TogglePlayback'
import { StaticOrInteractiveTag } from './StaticOrInteractive'
import { useMonitor } from '@/services'
import { useTimeline } from '@aitube/timeline'

export function EmbeddedPlayer() {
  const isPlaying = useMonitor((s) => s.isPlaying)
  const togglePlayback = useMonitor((s) => s.togglePlayback)

  const isInteractive = useTimeline((s) => s.isInteractive)
  const isLive = useTimeline((s) => s.isLive)

  const [isOverlayVisible, setOverlayVisible] = useState(true)

  const overlayTimerRef = useRef<NodeJS.Timeout>(null)
  // const videoLayerRef = useRef<HTMLDivElement>(null)
  // const segmentationLayerRef = useRef<HTMLDivElement>(null)

  const isPlayingRef = useRef(isPlaying)
  isPlayingRef.current = isPlaying

  const scheduleOverlayInvisibility = () => {
    clearTimeout(overlayTimerRef.current!)
    overlayTimerRef.current = setTimeout(() => {
      if (isPlayingRef.current) {
        setOverlayVisible(!isPlayingRef.current)
      }
      clearTimeout(overlayTimerRef.current!)
    }, 3000)
  }

  return (
    <>
      {/* content overlay, with the gradient, buttons etc */}
      <div
        className={cn(
          `pointer-events-none absolute mt-0 mr-0 mb-0 ml-0 flex flex-col items-center justify-end px-3 pt-5 pb-1 transition-opacity duration-300 ease-in-out`,
          isOverlayVisible ? 'opacity-100' : 'opacity-0'
        )}
        onMouseMove={() => {
          setOverlayVisible(true)
          scheduleOverlayInvisibility()
        }}
        style={{
          // width,
          // height,
          boxShadow: 'rgba(0, 0, 0, 1) 0px -77px 100px 15px inset',
        }}
      >
        {/* bottom slider and button bar */}
        <div
          className={cn(
            `flex w-full flex-col items-center justify-center self-end`
          )}
        >
          {/* the (optional) timeline slider bar */}
          <div
            className={cn(
              `flex h-0.5 w-full flex-row items-center bg-gray-100/50`
            )}
          >
            <div
              className={cn(`flex h-full flex-row items-center`, {
                'bg-yellow-500/100': isInteractive,
                'bg-red-500/100': isLive,
              })}
              style={{
                width: '100%', // <-- TODO: compute the % of progression within the experience
              }}
            ></div>
          </div>

          {/* button bar */}
          <div
            className={cn(
              `pointer-events-auto flex h-14 w-full flex-none flex-row items-center justify-between`
            )}
          >
            {/* left-side buttons */}
            <div
              className={cn(
                `flex h-full flex-none items-center justify-center`
              )}
            >
              <TogglePlayback
                isToggledOn={isPlaying}
                onClick={togglePlayback}
              />
              <StaticOrInteractiveTag
                isInteractive={isInteractive}
                size="md"
                className=""
              />
            </div>

            {/* right-side buttons */}
            <div
              className={cn(
                `flex h-full w-32 flex-none flex-row items-center justify-center space-x-2`
              )}
            ></div>
          </div>
        </div>
      </div>
    </>
  )
}
