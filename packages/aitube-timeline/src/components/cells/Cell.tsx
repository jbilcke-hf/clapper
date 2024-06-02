import { a } from "@react-spring/three"
import { ClapSegment } from "@aitube/clap"

import { DEFAULT_DURATION_IN_MS_PER_STEP } from "@/constants"

import { ImageCell } from "./ImageCell"
import { VideoCell } from "./VideoCell"
import { TextCell } from "./TextCell"
import { useTimelineState } from "@/hooks"
import { useHoveredSegment } from "@/hooks/useHoveredSegment"
import { leftBarTrackScaleWidth, topBarTimeScaleHeight } from "@/constants/themes"

export function Cell({
  segment: s
}: {
  segment: ClapSegment
}) {

  const getSegmentColorScheme = useTimelineState(s => s.getSegmentColorScheme)
  const colorScheme = getSegmentColorScheme(s)

  const cellWidth = useTimelineState((s) => s.horizontalZoomLevel)
  const getCellHeight = useTimelineState((s) => s.getCellHeight)
  const getVerticalCellPosition = useTimelineState((s) => s.getVerticalCellPosition)

  const cellHeight = getCellHeight(s.track)
  const verticalCellPosition = getVerticalCellPosition(0, s.track)

  // used to react to changes impacting tracks
  const tracks = useTimelineState(s => s.tracks)

  const durationInSteps = (
    (s.endTimeInMs - s.startTimeInMs) / DEFAULT_DURATION_IN_MS_PER_STEP
  )

  const startTimeInSteps = (
    s.startTimeInMs / DEFAULT_DURATION_IN_MS_PER_STEP
  )

  const widthInPx = durationInSteps * cellWidth

  const currentZoomLevel = useTimelineState(s => s.currentZoomLevel)

  // we need to round this one to avoid *too* many re-renders
  const widthInPxAfterZoom = Math.round(currentZoomLevel * durationInSteps * cellWidth)

  const isHovered = useHoveredSegment(s.id)

  // note: this is not reactive (as a general rule, we never want to be reactive in here)
  // note: as a general rule, we should avoid "reactive" state updates like this
  const isResizing = useTimelineState(s => s.isResizing)
  // const isResizing = useTimelineState.getState().isResizing

  const SpecializedCell =
    s.assetUrl.startsWith("data:image/")
      ? ImageCell
    : s.assetUrl.startsWith("data:video/")
      ? VideoCell
      : TextCell

  const setHoveredSegment = useTimelineState(s => s.setHoveredSegment)
    
  // cells are rendered often (eg. whenever we mouse the mouse from one cell to another)
  // because we need to handle their color change on hover / transition
  // console.log(`re-rendering a <Cell>`)

  return (
    <a.mesh
      key={s.id}
      position={[
        (startTimeInSteps * cellWidth) 

          // the position of a RoundedBox is defined from its center
          // so we have to shift its container (the a.mesh)
          // to the right, exactly one half of the RoundedBox's width
          + ((durationInSteps * cellWidth) / 2),

        -verticalCellPosition  + (cellHeight / 2),
        -1
      ]}

      onPointerMove={(e) => {
        // crude code to ignore the event when we are over the left column or the top row
        if (e.offsetX < leftBarTrackScaleWidth || e.offsetY < topBarTimeScaleHeight) {
          setHoveredSegment(undefined)
        } else {
          setHoveredSegment(s)
        }
      }}

      /*
      onPointerEnter={(e) => {
        // crude code to ignore the event when we are over the left column or the top row
        if (e.offsetX < leftBarTrackScaleWidth || e.offsetY < topBarTimeScaleHeight) {
          setHoveredSegment(undefined)
        } else {
          setHoveredSegment(s)
        }
      }}
        */
      onPointerLeave={(e) => {
        // console.log('leave')
        setHoveredSegment(undefined)
      }}


      onClick={(e) => console.log('click')}
      onContextMenu={(e) => console.log('context menu')}
      onDoubleClick={(e) => console.log('double click')}
      // onWheel={(e) => console.log('wheel spins')}
      // onPointerUp={(e) => console.log('up')}
      // onPointerDown={(e) => console.log('down')}
      // onPointerOver={(e) => console.log('over')}
      // onPointerOut={(e) => console.log('out')}

      // onPointerMove={(e) => console.log('move')}
      // onPointerMissed={() => console.log('missed')}
      // onUpdate={(self) => console.log('props have been updated')}
    >
      <SpecializedCell
          segment={s}
          cellWidth={cellWidth}
          cellHeight={cellHeight}
          isHovered={isHovered}
          setHoveredSegment={setHoveredSegment}
          durationInSteps={durationInSteps}
          startTimeInSteps={startTimeInSteps}
          colorScheme={colorScheme}
          widthInPx={widthInPx}
          widthInPxAfterZoom={widthInPxAfterZoom}
          isResizing={isResizing}
          track={tracks[s.track]}
        />
    </a.mesh>
  )
}
