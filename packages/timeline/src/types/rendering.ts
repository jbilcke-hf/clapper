import { ClapSegmentCategory } from "@aitube/clap"
import { TimelineSegment } from "./timeline"

export enum RenderingStrategy {

  // render assets when the user asks for it (could be a click or mouse hover)
  ON_DEMAND = "ON_DEMAND",

  // render assets currently visible on screen, never render invisible ones
  ON_SCREEN_ONLY = "ON_SCREEN_ONLY",

  // render assets visible on screen in priority,
  // then pre-render a few of the surrounding assets (but not the whole set)
  ON_SCREEN_THEN_SURROUNDING = "ON_SCREEN_THEN_SURROUNDING",


  // render assets visible on screen in priority,
  // then pre-render *ALL* the remaining project's assets
  // so yeah if you have 3000 storyboards, it will render that many ($$$)
  // (note: there is a setting to cap the number of parallel renderings)
  //
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // !! this is hardcore! only GPU-rich people shoud use this feature! !!
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  ON_SCREEN_THEN_ALL = "ON_SCREEN_THEN_ALL",

  // a special mode which only renders what is under the current playback cursor,
  // plus also pre-generates the following videos according to a given buffer size,
  // to try to ensure smooth streaming (smooth loading is only possible of the hardware
  // is fast other. Otherwise we will have to display a loader or progression bar).
  //
  // - if the user watches the whole video, then it will cost as much as the ON_SCREEN_THEN_ALL option
  //
  // - but if the user only watches 10%, then they only have to pay for 10% (+ the buffer)
  //
  // - if the user clicks somewhere in the timeline during playback, the it buffers again,
  //   but they also saves money (it won't compute the skipped segments)
  BUFFERED_PLAYBACK_STREAMING = "BUFFERED_PLAYBACK_STREAMING"
}

export type SegmentResolver = (segment: TimelineSegment) => Promise<TimelineSegment>

export type RenderableSegmentCategory =
  | ClapSegmentCategory.VIDEO
  | ClapSegmentCategory.STORYBOARD
  | ClapSegmentCategory.DIALOGUE
  | ClapSegmentCategory.SOUND
  | ClapSegmentCategory.MUSIC