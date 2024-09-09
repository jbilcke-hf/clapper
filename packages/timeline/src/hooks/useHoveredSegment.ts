import { useTimeline } from "./useTimeline"

export function useHoveredSegment(segmentId: string): boolean {
  const hoveredSegment = useTimeline(s => s.hoveredSegment)
  /* deprecateed


        useEffect(() => {
          const cursor = hoveredSegment ? 'pointer' : 'auto'
          if (document.body.style.cursor !== cursor) {
          document.body.style.cursor = cursor
          }
          return () => { document.body.style.cursor = 'auto' }
        }, [hoveredSegment])
  
  */
  if (hoveredSegment?.id === segmentId) {
    return true
  } else {
    return false
  }
}