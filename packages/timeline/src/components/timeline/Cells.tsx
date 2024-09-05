
import {
  useSegmentLoader,
  useTimeline
} from "@/hooks"

import { Cell } from "@/components/cells"

import { GRID_REFRESH_RATE_IN_MS } from "@/constants/grid";

export function Cells() {

  // subscribe to changes in content width; height, as well as the container width
  const contentHeight = useTimeline(s => s.contentHeight)
  const containerWidth = useTimeline(s => s.containerWidth)

  // note: this one is async, so it creates a delay
  // we could cheat by detecting the cell width change and apply it
  // faster on the current geometries 
  const { loadedSegments } = useSegmentLoader({
    refreshRateInMs: GRID_REFRESH_RATE_IN_MS,
  });


  console.log(`re-rendering <Cells> (${loadedSegments.length} loaded segments)`)

  return (
    <group position={[
      0,
      contentHeight / 2,
       -5
       ]}>
      {loadedSegments.map((s) =>
        <Cell
          key={s.id}
          segment={s}
        />
      )}
    </group>
  );
};
