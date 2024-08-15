import { Group, Object3DEventMap } from "three"

export type TimelineCursorImpl = Group<Object3DEventMap>

// application-provided callback used to seek into a specific timestamp
export type JumpAt = (jumpAtInMs: number) => void

// application-provided callback used to determine if we are playing back a stream or not
export type IsPlaying = () => boolean

// application-provided callback used to toggle the playback
export type TogglePlayback = (forcePlaying?: boolean) => {
  wasPlaying: boolean
  isPlaying: boolean
}
