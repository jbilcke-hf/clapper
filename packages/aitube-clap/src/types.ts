
export type ClapSegmentCategory =
  | "splat"
  | "mesh"
  | "depth"
  | "event"
  | "interface"
  | "phenomenon"
  | "video"
  | "storyboard"
  | "transition"
  | "character"
  | "location"
  | "time"
  | "era"
  | "lighting"
  | "weather"
  | "action"
  | "music"
  | "sound"
  | "dialogue"
  | "style"
  | "camera"
  | "generic"

export type ClapOutputType =
  | "text"
  | "animation"
  | "interface"
  | "event"
  | "phenomenon"
  | "transition"
  | "image"
  | "video"
  | "audio"

export type ClapSegmentStatus =
  | "to_generate"
  | "to_interpolate"
  | "to_upscale"
  | "completed"
  | "error"

export type ClapAuthor =
  | "auto" // the element was edited automatically using basic if/else logical rules
  | "ai" // the element was edited using a large language model
  | "human" // the element was edited by a human

export type ClapAssetSource =
  | "REMOTE" // http:// or https://

    // note that "path" assets are potentially a security risk, they need to be treated with care
  | "PATH" // a file path eg. /path or ./path/to/ or ../path/to/

  | "DATA" // a data URI, starting with data:

  | "PROMPT" // by default, a plain text prompt

  | "EMPTY"

export type ClapModelGender =
  | "male"
  | "female"
  | "person"
  | "object"

export type ClapModelAppearance = "serious" | "neutral" | "friendly" | "chill"

// this is used for accent, style..
export type ClapModelRegion =
  | "global"
  | "american"
  | "european"
  | "british"
  | "australian"
  | "canadian"
  | "indian"
  | "french"
  | "italian"
  | "german"
  | "chinese"

// note: this is all very subjective, so please use good judgment
//
// "deep" might indicate a deeper voice tone, thicker, rich in harmonics
// in this context, it is used to indicate voices that could
// be associated with African American (AADOS) characters
//
// "high" could be used for some other countries, eg. asia
export type ClapModelTimbre = "high" | "neutral" | "deep"

export type ClapModelAudioEngine = "ElevenLabs" | "XTTS" | "Parler-TTS"

export type ClapVoice = {
  name: string
  gender: ClapModelGender
  age: number
  region: ClapModelRegion
  timbre: ClapModelTimbre
  appearance: ClapModelAppearance
  audioEngine: ClapModelAudioEngine
  audioId: string
}

export type ClapHeader = {
  format: "clap-0"
  numberOfModels: number
  numberOfScenes: number
  numberOfSegments: number
}

export type ClapMeta = {
  id: string
  title: string
  description: string
  synopsis: string
  licence: string
  orientation: string

  // the default duration of the experience
  // the real one might last longer if made interactive
  durationInMs: number

  width: number
  height: number
  defaultVideoModel: string
  extraPositivePrompt: string[]
  screenplay: string
  isLoop: boolean
  isInteractive: boolean
}

export type ClapSceneEvent = {
  id: string
  type: "description" | "dialogue" | "action"
  character?: string
  description: string
  behavior: string
  startAtLine: number
  endAtLine: number
}

export type ClapScene = {
  id: string
  scene: string
  line: string
  rawLine: string
  sequenceFullText: string
  sequenceStartAtLine: number
  sequenceEndAtLine: number
  startAtLine: number
  endAtLine: number
  events: ClapSceneEvent[]
}

export type ClapSegment = {
  id: string
  track: number // usually track 0 is the video, track 1 is the storyboard, track 2 is the camera
  startTimeInMs: number
  endTimeInMs: number
  category: ClapSegmentCategory
  modelId: string
  sceneId: string
  prompt: string
  label: string
  outputType: ClapOutputType
  renderId: string
  status: ClapSegmentStatus
  assetUrl: string
  assetDurationInMs: number
  createdBy: ClapAuthor
  editedBy: ClapAuthor
  outputGain: number
  seed: number
}

export type ClapModel = {
  id: string
  category: ClapSegmentCategory
  triggerName: string
  label: string
  description: string
  author: string
  thumbnailUrl: string
  seed: number

  // TODO: create those 4 fields across all the code base:
  imagePrompt: string
  imageSourceType: ClapAssetSource
  imageEngine: string
  imageId: string
  
  audioPrompt: string
  audioSourceType: ClapAssetSource
  audioEngine: ClapModelAudioEngine
  audioId: string

  // TODO: rename to audioVendor, audioId and add an audioSourceType
  // those are only used by certain types of models
  age: number
  gender: ClapModelGender
  region: ClapModelRegion
  appearance: ClapModelAppearance
}

export type ClapProject = {
  meta: ClapMeta
  models: ClapModel[]
  scenes: ClapScene[]
  segments: ClapSegment[]
  // let's keep room for other stuff (screenplay etc)
}
