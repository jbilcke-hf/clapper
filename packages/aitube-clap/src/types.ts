export type ClapFormat =
  | "clap-0"
  | "clap-1"

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
  | "ai" // the element was edited using a large language entity
  | "human" // the element was edited by a human

export type ClapAssetSource =
  | "REMOTE" // http:// or https://

    // note that "path" assets are potentially a security risk, they need to be treated with care
  | "PATH" // a file path eg. /path or ./path/to/ or ../path/to/

  | "DATA" // a data URI, starting with data:

  | "PROMPT" // by default, a plain text prompt

  | "EMPTY"

// @deprecated we are going to use ClapEntityVariant (see below)
export type ClapEntityGender =
  | "male"
  | "female"
  | "person"
  | "object"

// this is what we should be using - using presets like "male" / "female" is okay,
// but we are going to also enable arbitrary strings
// export type ClapEntityVariant =
//   | "male"
//   | "female"
//   | "person"
//   | "object"
//   | string

// @deprecated - we are going to use the ClapEntityVariant instead
export type ClapEntityAppearance = "serious" | "neutral" | "friendly" | "chill"

// this is used for accent, style..
export type ClapEntityRegion =
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
export type ClapEntityTimbre = "high" | "neutral" | "deep"

export type ClapEntityAudioEngine = "ElevenLabs" | "XTTS" | "Parler-TTS"

export type ClapVoice = {
  name: string
  gender: ClapEntityGender
  age: number
  region: ClapEntityRegion
  timbre: ClapEntityTimbre
  appearance: ClapEntityAppearance
  audioEngine: ClapEntityAudioEngine
  audioId: string
}

export type ClapHeader = {
  format: ClapFormat
  numberOfEntities: number
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
  entityId: string
  sceneId: string
  prompt: string
  label: string
  outputType: ClapOutputType
  renderId: string
  status: ClapSegmentStatus
  assetUrl: string
  assetDurationInMs: number
  assetSourceType: ClapAssetSource
  createdBy: ClapAuthor
  editedBy: ClapAuthor
  outputGain: number
  seed: number
}

// TODO: this class name is too confusing,
// we should rename it to ClapEntity
export type ClapEntity = {
  id: string
  category: ClapSegmentCategory
  triggerName: string
  label: string
  description: string
  author: string
  thumbnailUrl: string
  seed: number

  imagePrompt: string
  imageSourceType: ClapAssetSource
  imageEngine: string
  imageId: string
  
  audioPrompt: string
  audioSourceType: ClapAssetSource
  audioEngine: ClapEntityAudioEngine
  audioId: string

  // could be replaced by an inceptionDate, so it can be used to compute the absolute "age" of anything:
  // a pyramid, a person, a spaceship..
  // maybe also with a destructionDate
  age: number

  // @deprecated TODO: we are going to use `variant: ClapEntityVariant` instead, which is gonna be an arbitrary string
  //
  // thay way clap entities could be used for inanimate or fantastic entities like:
  // buildings, vehicles, robots, animals, people, aliens..
  // (anything that needs visual and audio consistency)
  // @deprecated
  gender: ClapEntityGender

  // we can keep this, this is generic enough
  // ClapEntityRegion should be renamed to ClapEntityRegion
  region: ClapEntityRegion

  // @deprecated TODO: we are going to use `variant: ClapEntityVariant` instead, which is gonna be an arbitrary string
  appearance: ClapEntityAppearance
}

export type ClapProject = {
  meta: ClapMeta
  entities: ClapEntity[]
  entityIndex: Record<string, ClapEntity>
  scenes: ClapScene[]
  segments: ClapSegment[]
  // let's keep room for other stuff (screenplay etc)
}
