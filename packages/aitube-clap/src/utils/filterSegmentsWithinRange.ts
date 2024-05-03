import { ClapSegment, ClapSegmentFilteringMode } from "@/types"

/**
 * Return all the segments within the provided range, for the given mode:
 * 
 * - START: the start of a segment must be within the range
 * - END: the end of a segment must be within the range
 * - ANY: any end of a segment must be within the range
 * - BOTH: both ends of a segment must be within the range
 * 
 * @param mode 
 * @param startTimeInMs 
 * @param endTimeInMs 
 * @param segments 
 * @returns 
 */
export function filterSegmentsWithinRange(
  mode: ClapSegmentFilteringMode,
  startTimeInMs: number,
  endTimeInMs: number,
  segments?: ClapSegment[]
): ClapSegment[] {

  const array = Array.isArray(segments) ? segments : []

  if (!array.length) { return [] }

  switch (mode) {
    case ClapSegmentFilteringMode.START:
      return array.filter(s => startTimeInMs <= s.startTimeInMs && s.startTimeInMs <= endTimeInMs)
    case ClapSegmentFilteringMode.END:
      return array.filter(s => startTimeInMs <= s.endTimeInMs && s.endTimeInMs <= endTimeInMs)
    case ClapSegmentFilteringMode.BOTH:
      return array.filter(s => startTimeInMs <= s.startTimeInMs && s.endTimeInMs <= endTimeInMs)

      // less efficient version is:
      // array.filter(s =>
      //   (startTimeInMs <= s.startTimeInMs && s.startTimeInMs <= endTimeInMs)
      //   &&
      //   (startTimeInMs <= s.endTimeInMs && s.endTimeInMs <= endTimeInMs)
      // )

    case ClapSegmentFilteringMode.ANY:
      return array.filter(s =>
        (startTimeInMs <= s.startTimeInMs && s.startTimeInMs <= endTimeInMs)
        ||
        (startTimeInMs <= s.endTimeInMs && s.endTimeInMs <= endTimeInMs)
      )
    default:
      throw new Error(`unknown ClapSegmentFilteringMode "${mode}"`)
  }
}