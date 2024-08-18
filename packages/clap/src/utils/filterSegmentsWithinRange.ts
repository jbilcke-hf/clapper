import { ClapSegment, ClapSegmentCategory, ClapSegmentFilteringMode } from "@/types"

/**
 * Return all the segments within the provided range, for the given mode:
 * 
 * - START: the start of a segment must be within the range
 * - END: the end of a segment must be within the range
 * - ANY: any *PART* of a segment must be within the range
 * - BOTH: both ends of a segment must be within the range
 * 
 * Note: this is a strict inclusion
 * 
 * @param mode 
 * @param startTimeInMs 
 * @param endTimeInMs 
 * @param segments
 * @param category optional, to also filter by category
 * @returns 
 */
export function filterSegmentsWithinRange<T extends {
  startTimeInMs: number;
  endTimeInMs: number;
  category?: ClapSegmentCategory;
}>(
  mode: ClapSegmentFilteringMode,
  startTimeInMs: number,
  endTimeInMs: number,
  segments?: T[],
  category?: ClapSegmentCategory
): T[] {

  const array = Array.isArray(segments) ? segments : []

  if (!array.length) { return [] }

  switch (mode) {
    case ClapSegmentFilteringMode.START:
      return array.filter(s => (startTimeInMs <= s.startTimeInMs && s.startTimeInMs < endTimeInMs) && ((category && s?.category) ? s.category === category : true))
    case ClapSegmentFilteringMode.END:
      return array.filter(s => (startTimeInMs < s.endTimeInMs && s.endTimeInMs <= endTimeInMs) && ((category && s?.category) ? s.category === category : true))
    case ClapSegmentFilteringMode.BOTH:
      return array.filter(s => (startTimeInMs <= s.startTimeInMs && s.endTimeInMs <= endTimeInMs) && ((category && s?.category) ? s.category === category : true))
    case ClapSegmentFilteringMode.ANY:
      return array.filter(s => (
        // we keep if we ARE NOT out of bound
        !(s.endTimeInMs <= startTimeInMs || s.startTimeInMs >= endTimeInMs)
  
        && ((category && s?.category) ? s.category === category : true)
      ))
    default:
      throw new Error(`unknown ClapSegmentFilteringMode "${mode}"`)
  }
}