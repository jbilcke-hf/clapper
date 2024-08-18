import { ClapSegmentCategory, ClapSegmentFilteringMode } from "@/types"
import { filterSegmentsWithinRange } from "@/utils/filterSegmentsWithinRange"

/**
 * Return all the segments within the provided reference segment, for the given mode:
 * 
 * - START: the start of a segment must be within the provided segment's range
 * - END: the end of a segment must be within the provided segment's range
 * - ANY: any end of a segment must be within the provided segment's range
 * - BOTH: both ends of a segment must be within the provided segment's range
 * 
 * Note: we use a loose definition for the input segment,
 * to get a bit more flexibility
 * 
 * @param mode 
 * @param range 
 * @param segments 
 * @param category optional, to also filter by category
 * @returns 
 */
export function filterSegments<T extends {
  startTimeInMs: number
  endTimeInMs: number
  category?: ClapSegmentCategory
}>(
  mode: ClapSegmentFilteringMode,
  range?: {
    startTimeInMs: number
    endTimeInMs: number
    category?: ClapSegmentCategory
  },
  segments?: T[],
  category?: ClapSegmentCategory
): T[] {

  const array = Array.isArray(segments) ? segments : []

  if (!range || !array.length) { return [] }

  const { startTimeInMs, endTimeInMs } = range

  return filterSegmentsWithinRange<T>(mode, startTimeInMs, endTimeInMs, segments, category)
}