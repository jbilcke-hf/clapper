
import { DEFAULT_COLUMNS_PER_SLICE, DEFAULT_DURATION_IN_MS_PER_STEP } from "@aitube/timeline"

// how much we look up in the future
export const blockSizeInMs =
  DEFAULT_COLUMNS_PER_SLICE // this equals to 4 at the time of writing, but this might become dynamic
  * DEFAULT_DURATION_IN_MS_PER_STEP // this equals to 500 at the time of writing

  // max refresh rate (eg. 100 ms)
  // if the user has a fast device you can try faster rates
  export const ACTIVE_SEGMENTS_REFRESH_RATE_IN_MS = 100

