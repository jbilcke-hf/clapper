import { Vector3 } from 'three'
import { TimelineStoreState } from '@/types/timeline'
import { computeCellHeight } from '@/compute/computeCellHeight'
import { leftBarTrackScaleWidth, topBarTimeScaleHeight } from '@/constants/themes'

export function timelinePointer(state: TimelineStoreState, clientX: number, clientY: number) {
  const { canvas, timelineCamera: camera } = state
  const rect = canvas?.getBoundingClientRect()
  if (!rect || !camera || !rect.width || !rect.height) return undefined
  const x = clientX - rect.left
  const y = clientY - rect.top
  const point = new Vector3((x / rect.width) * 2 - 1, 1 - (y / rect.height) * 2, 0).unproject(camera)
  const timeInMs = ((point.x + state.containerWidth / 2) / state.cellWidth) * state.durationInMsPerStep
  let bottom = 0
  const rowY = state.contentHeight / 2 - point.y
  const track = state.tracks.find(track => {
    bottom += computeCellHeight({ ...state, trackNumber: track.id })
    return rowY >= 0 && rowY < bottom
  })
  const inside = x >= leftBarTrackScaleWidth && x <= rect.width && y >= topBarTimeScaleHeight && y <= rect.height
  return { timeInMs, trackId: inside ? track?.id : undefined }
}
