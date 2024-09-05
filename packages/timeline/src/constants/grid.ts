export const DEFAULT_DURATION_IN_MS_PER_STEP = 500

export const DEFAULT_NB_TRACKS = 24

// how many columns per slice / default segment lenght - this may be an option in the future
// so here, a "slice" (a typical shot)
// lasts for 2 seconds (500ms * 4)
export const DEFAULT_COLUMNS_PER_SLICE = 4

export const PROMPT_STEP_HEIGHT_IN_PX = 48
export const PREVIEW_STEP_HEIGHT_IN_PX = 3 * PROMPT_STEP_HEIGHT_IN_PX

export const NB_MAX_SHOTS = ((8 * 60 * 60) / 2) // 6 hours converted to seconds, and divided by 2 (a shot is about 2 sec)

// refresh rate for the grid (high value == delay before we see the "hidden" cells)
// this should be a factor of the number of segments,
// as this puts a strain on the rendering FPS
//
// another solution can also consist in rendering more hidden cells,
// to avoid having to re-compute
export const GRID_REFRESH_RATE_IN_MS = 25