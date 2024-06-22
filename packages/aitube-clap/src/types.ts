export enum ClapFormat {
  // the current active version
  // as long as the Clap format is not "standardized"
  // we will stay in clap-0
  CLAP_0 = "clap-0",

  // reserved for future use
  // CLAP_1 = "clap-1"
}

export enum ClapSegmentCategory {
  // a 3D Gaussian Splatting object (eg. a .splatv)
  SPLAT = "splat",

  // a 3D mesh object
  MESH = "mesh",

  // a depth map
  DEPTH = "depth",

  // a event happening in the scene
  EVENT = "event",
  
  // a user interface element, such as an overlay or caption, or HTML content
  INTERFACE = "interface",

  // a phenomenom triggering changes in the scene
  PHENOMENON = "phenomenon",

  // a video clip, eg. mp4 or webm
  // it is strongly recommended to use an open and royalty-free codec such as VP9,
  // otherwise some web browsers might not be able to display it
  VIDEO = "video",

  // a storyboard image, eg. jpg, png, webp, heic (note: most of the apps compatible with .clap prefer to work with jpg and png)
  STORYBOARD = "storyboard",

  // a transition between two shots (eg. a cross-fade)
  TRANSITION = "transition",

  // a character (person, animal, alien, robot, walking skeleton..)
  CHARACTER = "character",

  // a location (indoor or outdoor eg. a house, castle, garden..)
  LOCATION = "location",
  
  // the absolute time where the action takes place
  //
  // this can be anything that a language model or stable diffusion model can interpret, eg:
  // eg. "today at 12am", "2024-01-01", "contemporary times", "14th century", 1960, "AB 31", "20 BC"
  //
  // ideally you should use a date formatting indicating the hour and timezone (if your LLM can understand those)
  // that way it will be possible to automatically determine if it's day or night!
  TIME = "time",

  // @deprecated - we should use TIME instead
  ERA = "era",

  // how to lit the scene, colors, angles etc
  LIGHTING = "lighting",

  // weather conditions in the scene (raining, sunny, cloudy, morning mist..)
  WEATHER = "weather",

  // direct description of what is happening in the scene ("people talking", "bus passing by", "putting down the glass")
  ACTION = "action",

  // some music
  // like for all segments you can either give a prompt and/or work with an actual file (in the case mp3 or wav)
  MUSIC = "music",

  // some sound
  // eg. "dog barking", "foot steps", "crowded bar"
  SOUND = "sound",

  // a dialogue line
  // either the transcript and/or the generated TTS line
  DIALOGUE = "dialogue",

  // a specific style to apply
  // "cinematic", "1950s comic book", "Panavision 70 mm"
  STYLE = "style",

  // type of shot eg "medium-shot", aperture, ISO..
  CAMERA = "camera",

  // ..anything else, from prompt to arbitrary/custom/obscure file format
  // 
  // however if you have a special demand, something that could be popular and not too niche,
  // we can turn it into its own category
  GENERIC = "generic"
}

export enum ClapMediaOrientation {
  LANDSCAPE = "landscape",
  PORTRAIT = "portrait",
  SQUARE = "square"
}

export enum ClapOutputType {
  // a plain text
  TEXT = "text",

  // an animation (not used)
  ANIMATION = "animation",

  // UI element
  INTERFACE = "interface",

  // event
  EVENT = "event",

  PHENOMENON = "phenomenon",

  TRANSITION = "transition",

  // image asset
  IMAGE = "image",

  // video asset
  VIDEO = "video",

  // audio asset
  AUDIO = "audio"
}

export enum ClapSegmentStatus {
  TO_GENERATE = "to_generate",
  IN_PROGRESS = "in_progress",
  TO_INTERPOLATE = "to_interpolate",
  TO_UPSCALE = "to_upscale",
  COMPLETED = "completed",
  ERROR = "error",
}

export type ClapAuthor =
  | "auto" // the element was edited automatically using basic if/else logical rules
  | "ai" // the element was edited using a large language entity
  | "human" // the element was edited by a human
  | string

export enum ClapAssetSource {
  REMOTE = "REMOTE", // http:// or https://

  // note that "path" assets are potentially a security risk, they need to be treated with care
  PATH = "PATH", // a file path eg. /path or ./path/to/ or ../path/to/

  DATA = "DATA", // a data URI, starting with data:

  PROMPT = "PROMPT", // by default, a plain text prompt

  EMPTY = "EMPTY"
}

// @deprecated we are going to use ClapEntityVariant (see below)
export type ClapEntityGender =
  | "male"
  | "female"
  | "person"
  | "object"
  | string

// an arbitrary physical description
export type ClapEntityVariant = string

// @deprecated - we are going to use the ClapEntityVariant instead
export type ClapEntityAppearance =
  | "serious"
  | "neutral"
  | "friendly"
  | "chill"
  | string

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
  | string

// note: this is all very subjective, so please use good judgment
//
// "deep" might indicate a deeper voice tone, thicker, rich in harmonics
// in this context, it is used to indicate voices that could
// be associated with African American (AADOS) characters
//
// "high" could be used for some other countries, eg. asia
export type ClapEntityTimbre = "high" | "neutral" | "deep"

export type ClapEntityAudioEngine =
  | "ElevenLabs"
  | "XTTS"
  | "Parler-TTS"
  | "OpenVoice"
  | string

export enum ClapSegmentFilteringMode {
  // the start of a segment must be within the range
  START,

  // the end of a segment must be within the range
  END,

  // any end of a segment must be within the range
  ANY,

  // both ends of a segment must be within the range
  BOTH,
}

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

  orientation: ClapMediaOrientation

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
  startTimeInLines: number
  endTimeInLines: number
  prompt: string
  label: string
  outputType: ClapOutputType
  renderId: string
  status: ClapSegmentStatus
  assetUrl: string
  assetDurationInMs: number
  assetSourceType: ClapAssetSource
  assetFileFormat: string 

  // when was the segment created
  createdAt: string

  createdBy: ClapAuthor

  // clap segment default: 0)
  revision: number

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

export enum ClapCompletionMode {
  /**
   * the API and the client will return a full clap file.
   * This is a very convenient and simple mode, but it is also very ineficient,
   * so it should not be used for intensive applications.
   */
  FULL = "full",

  /**
   * the API and the client will return a partial clap file containing only the changes,
   * containing only the new values and changes.
   * This is useful for real-time applications and streaming.
   */
  PARTIAL = "partial",

  /**
   * the API will return a partial clap file containing only the changes,
   * and the client will return a merge of the original with the new values.
   * This is safe to run, there are no side-effects.
   */
  MERGE = "merge",

  /**
   * the API will return a partial clap file, and the client will replace the original.
   * This is the most efficient mode, but it relies on side-effects and inline object updates.
   */
  REPLACE = "replace"
}
