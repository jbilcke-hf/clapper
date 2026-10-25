import { useEffect } from 'react'
import { useTimeline } from './useTimeline'

/** Native capture keeps dragging and cleanup working outside a cell or the canvas. */
export function useSegmentDrag() {
  const canvas = useTimeline(state => state.canvas)
  useEffect(() => {
    if (!canvas) return
    const move = (event: PointerEvent) => useTimeline.getState().updateSegmentDrag(event)
    const up = (event: PointerEvent) => {
      const state = useTimeline.getState()
      if (state.segmentDrag?.pointerId !== event.pointerId) return
      state.updateSegmentDrag(event)
      state.finishSegmentDrag()
    }
    const cancelPointer = (event: PointerEvent) => {
      if (useTimeline.getState().segmentDrag?.pointerId === event.pointerId) useTimeline.getState().finishSegmentDrag(true)
    }
    const cancel = () => useTimeline.getState().finishSegmentDrag(true)
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') cancel()
    }
    window.addEventListener('pointermove', move, { passive: false })
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', cancelPointer)
    window.addEventListener('blur', cancel)
    window.addEventListener('keydown', key)
    canvas.addEventListener('lostpointercapture', cancelPointer)
    return () => {
      cancel()
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', cancelPointer)
      window.removeEventListener('blur', cancel)
      window.removeEventListener('keydown', key)
      canvas.removeEventListener('lostpointercapture', cancelPointer)
    }
  }, [canvas])
}
