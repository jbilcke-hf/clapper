export {
  TimelineControls,
  HorizontalScroller,
  VerticalScroller,
  Timeline,
  TopBarTimeScale,
  Cells,
  Grid,
  Cell,
  ImageCell,
  VideoCell,
  TextCell,
  type SpecializedCellProps,
  type JumpAt
} from "./components"

export {
  DEFAULT_DURATION_IN_MS_PER_STEP,
  DEFAULT_NB_TRACKS,
  DEFAULT_COLUMNS_PER_SLICE,
  PROMPT_STEP_HEIGHT_IN_PX,
  PREVIEW_STEP_HEIGHT_IN_PX,
  NB_MAX_SHOTS,
  baseClapSegmentCategoryHues,
  pastel,
  DEFAULT_THEMES,
} from "./constants"

export {
  useAxis,
  useVerticalGridLines,
  useHorizontalGridLines,
  useTimeline,
  useSegmentChanges,
  useSegmentLoader,
} from "./hooks"

export {
  clamp,
  cn,
  debounceAsync,
  debounceSync,
  findFreeTrack,
  formatTimestamp,
  getDefaultState,
  getFinalVideo,
  getWebGLCharWidth,
  getWebGLTextWidth,
  clampWebGLText,
  clampWebGLTextNaive,
  hslToHex,
  parseRenderingStrategy,
  removeFinalVideos,
  similar,
  sleep,
  sliceSegments,
  throttle
} from "./utils"

export {
  Track,
  Tracks,
  ContentSizeMetrics,
  RenderedCell,
  TimelineStore,
  TimelineStoreState,
  TimelineStoreModifiers,
  ClapTimelineTheme,
  ClapSegmentCategoryHues,
  ClapSegmentColorScheme,
  RenderingStrategy,
 type SegmentResolver,
} from "./types"


export { ClapTimeline } from "./ClapTimeline"

