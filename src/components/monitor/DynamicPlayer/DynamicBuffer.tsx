"use client"

import { ClapOutputType, ClapSegment } from "@aitube/clap"

import { cn } from "@/lib/utils"

import { VideoClipBuffer } from "./VideoClipBuffer"
import { StoryboardBuffer } from "./StoryboardBuffer"

export const DynamicBuffer = ({
  segment,
  isPlaying = false,
  isVisible = false,
}: {
  segment?: ClapSegment
  isPlaying?: boolean
  isVisible?: boolean
}): JSX.Element | null => {  
  const src = `${segment?.assetUrl || ""}`

  if (!src) { return null }

  const outputType = segment!.outputType

  const className = cn(isVisible ? `opacity-100` : `opacity-0`)

  return (
   <>
     {outputType === ClapOutputType.VIDEO
       ? <VideoClipBuffer
        src={src}
        isPlaying={isPlaying}
        className={className}
      />
      : <StoryboardBuffer
        src={src}
        className={className}
      />}
    </>
  )
}