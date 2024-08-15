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
  DEFAULT_MIN_ZOOM,
  DEFAULT_MAX_ZOOM,
  DEFAULT_ZOOM_SPEED,
  DEFAULT_ZOOM_DAMPING_FACTOR,
  DEFAULT_SHOW_FPS,
  DEFAULT_FRAMELOOP,
  DEFAULT_THEMES,
  DEFAULT_DURATION_IN_MS_PER_STEP,
  DEFAULT_NB_TRACKS,
  DEFAULT_COLUMNS_PER_SLICE,
  PROMPT_STEP_HEIGHT_IN_PX,
  PREVIEW_STEP_HEIGHT_IN_PX,
  NB_MAX_SHOTS,
  pastel,
  segmentVisibilityPriority,
  leftBarTrackScaleWidth
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
  clapSegmentToTimelineSegment,
  cn,
  debounceAsync,
  debounceSync,
  findFreeTrack,
  formatTimestamp,
  getAudioBuffer,
  getDefaultState,
  getFinalVideo,
  getWebGLCharWidth,
  getWebGLTextWidth,
  clampWebGLText,
  clampWebGLTextNaive,
  hslToHex,
  parseRenderingStrategy,
  readFileAsArrayBuffer,
  removeFinalVideosAndConvertToTimelineSegments,
  similar,
  sleep,
  sliceSegments,
  throttle,
  timelineSegmentToClapSegment
} from "./utils"

export {
  SegmentVisibility,
  SegmentEditionStatus,
  BrowserOnlySegmentData,
  TimelineSegment,
  ContentSizeMetrics,
  RenderedCell,
  TimelineStore,
  TimelineStoreState,
  TimelineStoreModifiers,
  ClapTimelineTheme,
  ClapSegmentCategoryHSL,
  ClapSegmentCategoryColors,
  ClapSegmentColorScheme,
  RenderingStrategy,
 type SegmentResolver,
} from "./types"

export { ClapTimeline } from "./ClapTimeline"

