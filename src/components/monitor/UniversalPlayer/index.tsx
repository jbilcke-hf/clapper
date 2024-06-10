import { ClapSegment } from "@aitube/clap"
import { useTimeline } from "@aitube/timeline"

import { StaticPlayer } from "../../monitor/StaticPlayer"
import { DynamicPlayer } from "../DynamicPlayer"

// TODO: put this in a separate component eg @aitube-player or @aitube/monitor
export function UniversalPlayer() {
  const finalVideo: ClapSegment | undefined = useTimeline(s => s.finalVideo)

  const assetUrl: string = finalVideo?.assetUrl || ""

  // console.log('finalVideo:', finalVideo)
  
  // note: I think we are going to only display the final video in specific cases,
  // and use the dynamic player 99% the time

  /*
  if (assetUrl) {
    return (
      <div className="
        flex flex-col flex-grow
        items-center justify-center
        w-full h-[calc(100%-60px)]
        ">
        <StaticPlayer
          video={assetUrl}
          isBusy={false}
          progress={0}
          status=""
          error={undefined}
        />
      </div>
    )
  }
    */


  return (
    <div className="
      flex flex-col flex-grow
      items-center justify-center
      w-full h-[calc(100%-60px)]
      ">
      <DynamicPlayer
      />
    </div>
  )
}