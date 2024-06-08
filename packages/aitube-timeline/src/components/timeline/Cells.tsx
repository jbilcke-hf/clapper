
import {
  useSegmentLoader,
  useTimeline
} from "@/hooks"

import { Cell } from "@/components/cells"

export function Cells() {

  // refresh rate for the grid (high value == delay before we see the "hidden" cells)
  // this should be a fact of the number of segments,
  // as this puts a strain on the rendering FPS
  //
  // another solution can also consist in rendering more hidden cells,
  // to avoid having to re-compute
  const refreshRateInMs = 500

  const contentHeight = useTimeline(s => s.contentHeight)

  // note: this one is async, so it creates a delay
  // we could cheat by detecting the cell width change and apply it
  // faster on the current geometries 
  const { visibleSegments, loadedSegments } = useSegmentLoader({
    refreshRateInMs,
  });


  /*
  const [props, set] = useSpring(() => ({
    pos: [0, 0, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    config: { mass: 10, tension: 1000, friction: 300, precision: 0.00001 }
  }))
  */
  
  console.log(`re-rendering <Cells> (${visibleSegments.length} strictly  visible, ${loadedSegments.length} loaded in total)`)

  return (
    <group position={[
      0,
      // height/2 is to shift the group above, to make it centered
      // cellHeight/2 is to also take into account the height of a cell
      // (baseCellHeight / 2) - (baseCellHeight / 2),
      contentHeight / 2,
       -4
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
