import { ClapSegment } from "@aitube/clap"
import { useTimelineState } from "@aitube/timeline"

import { StaticVideo } from "../static-video"

// TODO: put this in a separate component
export function RenderClap() {
  const finalVideo: ClapSegment | undefined = useTimelineState(s => s.finalVideo)

  console.log(`finalVideo:`, finalVideo)
  const assetUrl: string = finalVideo?.assetUrl || ""
  if (!assetUrl) {
    return null
  }

  return (
    <div className="
    flex flex-col 
    items-center justify-center
    w-full h-full
    ">
    <StaticVideo
      video={assetUrl}
      isBusy={false}
      progress={0}
      status=""
      error={undefined}
    />
    </div>
  )
}