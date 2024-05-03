import { ClapSegment, ClapSegmentCategory, ClapSegmentFilteringMode } from "@/types"
import { filterSegmentsWithinRange } from "./filterSegmentsWithinRange"

/**
 * Return all the segments within the provided reference segment, for the given mode:
 * 
 * - START: the start of a segment must be within the provided segment's range
 * - END: the end of a segment must be within the provided segment's range
 * - ANY: any end of a segment must be within the provided segment's range
 * - BOTH: both ends of a segment must be within the provided segment's range
 * 
 * @param mode 
 * @param segment 
 * @param segments 
 * @param category optional, to also filter by category
 * @returns 
 */
export function filterSegments(
  mode: ClapSegmentFilteringMode,
  segment?: ClapSegment,
  segments?: ClapSegment[],
  category?: ClapSegmentCategory
): ClapSegment[] {

  const array = Array.isArray(segments) ? segments : []

  if (!segment || !array.length) { return [] }

  const { startTimeInMs, endTimeInMs } = segment

  return filterSegmentsWithinRange(mode, startTimeInMs, endTimeInMs, segments, category)
}