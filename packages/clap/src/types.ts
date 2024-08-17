export enum ClapFormat {
  CLAP_0 = "clap-0",

  // current active version, where some enums have uppercased,
  // and some extract things added
  CLAP_0b = "clap-0b",
}

export enum ClapSegmentCategory {
  // a 3D Gaussian Splatting object (eg. a .splatv)
  SPLAT = "SPLAT",

  // a 3D mesh object
  MESH = "MESH",

  // a depth map
  DEPTH = "DEPTH",

  // a transformative effect and/or filter to apply to an input
  // eg. upscaling, face swap..
  EFFECT = "EFFECT",

  // a event happening in the scene
  EVENT = "EVENT",
  
  // a user interface element, such as an overlay or caption, or HTML content
  INTERFACE = "INTERFACE",

  // a phenomenom triggering changes in the scene
  PHENOMENON = "PHENOMENON",

  // a video clip, eg. mp4 or webm
  // it is strongly recommended to use an open and royalty-free codec such as VP9,
  // otherwise some web browsers might not be able to display it
  VIDEO = "VIDEO",

  // a storyboard image, eg. jpg, png, webp, heic (note: most of the apps compatible with .clap prefer to work with jpg and png)
  STORYBOARD = "STORYBOARD",

  // a transition between two shots (eg. a cross-fade)
  TRANSITION = "TRANSITION",

  // a character (person, animal, alien, robot, walking skeleton..)
  CHARACTER = "CHARACTER",

  // a location (indoor or outdoor eg. a house, castle, garden..)
  LOCATION = "LOCATION",
  
  // the absolute time where the action takes place
  //
  // this can be anything that a language model or stable diffusion model can interpret, eg:
  // eg. "today at 12am", "2024-01-01", "contemporary times, in the morning", "14th century, in the afternoon", 1960, "AB 31, 11pm", "20 BC"
  //
  // ideally you should use a date formatting indicating the hour and timezone (if your LLM can understand those)
  // that way it will be possible to automatically determine if it's day or night!
  TIME = "TIME",

  // @deprecated - we should use TIME instead
  ERA = "ERA",

  // how to lit the scene, colors, angles etc
  LIGHTING = "LIGHTING",

  // weather conditions in the scene (raining, sunny, cloudy, morning mist..)
  WEATHER = "WEATHER",

  // direct description of what is happening in the scene ("people talking", "bus passing by", "putting down the glass")
  ACTION = "ACTION",

  // some music
  // like for all segments you can either give a prompt and/or work with an actual file (in the case mp3 or wav)
  MUSIC = "MUSIC",

  // some sound
  // eg. "dog barking", "foot steps", "crowded bar"
  SOUND = "SOUND",

  // a dialogue line
  // either the transcript and/or the generated TTS line
  DIALOGUE = "DIALOGUE",

  // a specific style to apply
  // "cinematic", "1950s comic book", "Panavision 70 mm"
  STYLE = "STYLE",

  // type of shot eg "medium-shot", aperture, ISO..
  CAMERA = "CAMERA",

  // ..anything else, from prompt to arbitrary/custom/obscure file format
  // 
  // however if you have a special demand, something that could be popular and not too niche,
  // we can turn it into its own category
  GENERIC = "GENERIC"
}

export enum ClapMediaOrientation {
  LANDSCAPE = "LANDSCAPE",
  PORTRAIT = "PORTRAIT",
  SQUARE = "SQUARE"
}

export enum ClapOutputType {
  // a plain text
  TEXT = "TEXT",

  // an animation
  ANIMATION = "ANIMATION",

  // UI element
  INTERFACE = "INTERFACE",

  // event
  EVENT = "EVENT",

  PHENOMENON = "PHENOMENON",

  TRANSITION = "TRANSITION",

  // image asset
  IMAGE = "IMAGE",

  // image segmentation layer
  IMAGE_SEGMENTATION = "IMAGE_SEGMENTATION",

  // image depthmap layer
  IMAGE_DEPTH = "IMAGE_DEPTH",

  // video asset
  VIDEO = "VIDEO",

  // video segmentation layer
  VIDEO_SEGMENTATION = "VIDEO_SEGMENTATION",

  // image depthmap layer
  VIDEO_DEPTH = "VIDEO_DEPTH",

  // audio asset
  AUDIO = "AUDIO"
}

export enum ClapSegmentStatus {
  TO_GENERATE = "TO_GENERATE",
  IN_PROGRESS = "IN_PROGRESS",
  TO_INTERPOLATE = "TO_INTERPOLATE",
  TO_UPSCALE = "TO_UPSCALE",
  COMPLETED = "COMPLETED",
  ERROR = "ERROR",
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
  numberOfWorkflows: number
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
  
  /**
   * List of keywords used to describe the project.
   * 
   * Examples: action, sci-fi, romance, advert, music video,
   */
  tags: string[]
  
  /**
   * A thumbnail representing the project.
   * 
   * Can be hosted on a remote server or in base64
   */
  thumbnailUrl: string

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

  /**
   * ID of the entity attached to the segment
   * 
   * This allows segments of different nature (image, voice) to be attached to the same or different entities.
   * 
   * Eg. video of character A but voice of character B
   * 
   * If you want multiple entities, you can add multiple segments.
   */
  entityId: string

  /**
   * ID of the workflow to use for the segment
   * 
   * This is optional (empty string by default)
   * 
   * If unspecified, a default workflow will be used
   */
  workflowId: string

  /**
   * Id of the scene to which the segment is attached
   *
   * This is optional (empty string by default)
   */
  sceneId: string

  /**
   * Statring line number to which the segment is attached
   *
   * This is optional (empty string by default)
   */
  startTimeInLines: number

  /**
   * Ending line number to which the segment is attached
   *
   * This is optional (empty string by default)
   */
  endTimeInLines: number

  /**
   * 
   */
  prompt: string

  /**
   * Human-readable label to showfor this segment.
   * 
   * Should be kept short.
   */
  label: string

  outputType: ClapOutputType

  /**
   * Id of an external rendering job to which this segment could be attached.
   * 
   * This is optional (empty string by default)
   * 
   * It is possible that this field gets removed in the future,
   * and instead moved to TimelineSegment
   */
  renderId: string

  /**
   * Status of the segment (is it generated, to generate etc)
   */
  status: ClapSegmentStatus

  /**
   * The value of the segment, ie. the data
   * 
   * It can come from the output of a workflow.
   * 
   * This can be either a link to a remotely hosted resource,
   * a file path or a data URI (base64)
   * 
   * I recommend the data URI for small projects,
   * as the other modes create additional complexity
   * (manage a cloud, access rights, deletes, downloads etc)
   */
  assetUrl: string

  /**
   * The duration of the asset itself.
   * 
   * This might be different from the segment itself,
   * for instance if the asset has a zero length (a storyboard),
   * or if the asset is longer (eg. a cropped audio file)
   */
  assetDurationInMs: number
  assetSourceType: ClapAssetSource
  assetFileFormat: string 

  // when was the segment created
  createdAt: string

  createdBy: ClapAuthor

  // clap segment default: 0)
  revision: number

  editedBy: ClapAuthor

  /**
   * The volume of the segment
   */
  outputGain: number

  /**
   * The seed used to generate the asset data/value.
   * 
   * This is mostly used fo tracking changes,
   * and reproduce result
   */
  seed: number
}

export type ClapInputFieldNumber = {
  type: 'number'
  minValue: number
  maxValue: number
  defaultValue: number
}

export type ClapInputFieldInteger = {
  type: 'integer'
  minValue: number
  maxValue: number
  defaultValue: number
}

export type ClapInputFieldString = {
  type: 'string'
  allowedValues: string[]
  defaultValue: string
}

export type ClapInputFieldBoolean = {
  type: 'boolean'
  defaultValue: boolean
}

export type ClapInputFieldAny = {
  type: 'any'
  defaultValue: any
}

export type ClapInputField = {
  /**
   * Machine readable input field name or identifier
   */
  id: string

  /**
   * Human-readable input field name
   */
  label: string

  /**
   * Description of what the input field does
   */
  description: string
} & (
  | ClapInputFieldNumber
  | ClapInputFieldInteger
  | ClapInputFieldString
  | ClapInputFieldBoolean
  | ClapInputFieldAny
)

export type ClapInputFields = ClapInputField[]

export type ClapInputValue =
  number | string | boolean | string[] | number[] | null | undefined

export type ClapInputValues =
  Record<string, ClapInputValue>


export enum ClapWorkflowProvider {
  NONE = "NONE",
  BUILTIN = "BUILTIN",
  CUSTOM = "CUSTOM",
  COMFYUI = "COMFUI", // any ComfyUI server (local or remote)
  AITUBE = "AITUBE", // https://aitube.at
  HUGGINGFACE = "HUGGINGFACE", // https://huggingface.co
  REPLICATE = "REPLICATE", // https://replicate.com
  COMFYDEPLOY = "COMFYDEPLOY", // https://comfydeploy.com
  COMFYICU = "COMFYICU", // https://comfy.icu
  ELEVENLABS = "ELEVENLABS", // https://elevenlabs.io
  KITSAI = "KITSAI", // https://kits.ai
  OPENAI = "OPENAI", // https://openai.com
  STABILITYAI = "STABILITYAI", // https://stability.ai
  FIREWORKSAI = "FIREWORKSAI", // https://fireworks.ai
  GROQ = "GROQ", // https://groq.com
  ANTHROPIC = "ANTHROPIC", // https://anthropic.com
  GOOGLE = "GOOGLE", // https://google.com (in case you didn't know)
  MISTRALAI = "MISTRALAI", // https://mistral.ai
  COHERE = "COHERE", // https://cohere.com
  FALAI = "FALAI", // https://fal.ai
  MODELSLAB = "MODELSLAB", // https://modelslab.com
  MIDJOURNEY = "MIDJOURNEY",
  SUNO = "SUNO",
  UDIO = "UDIO",
  LUMALABS = "LUMALABS",
  KUAISHOU = "KUAISHOU",
  RUNWAYML = "RUNWAYML",
  HEDRA = "HEDRA",
  LEONARDOAI = "LEONARDOAI",
  EVERARTAI = "EVERARTAI",
  LETZAI = "LETZAI",
  BIGMODEL = "BIGMODEL",
  PIAPI = "PIAPI",
}

  
// note: it could be argued that image filtering and upscaling
// are both subsets of the same general concept of "image to image"
// and.. yes, that's true!
// there are only separated for convenient, to add some semantic
// to those abstract image-to-image models.
export enum ClapWorkflowCategory {
  ASSISTANT = "ASSISTANT",
  IMAGE_GENERATION = "IMAGE_GENERATION",
  IMAGE_FILTERING = "IMAGE_FILTERING",
  IMAGE_UPSCALING = "IMAGE_UPSCALING",
  IMAGE_DEPTH_MAPPING = "IMAGE_DEPTH_MAPPING",
  IMAGE_SEGMENTATION = "IMAGE_SEGMENTATION",
  MUSIC_GENERATION = "MUSIC_GENERATION",
  SOUND_GENERATION = "SOUND_GENERATION",
  VOICE_GENERATION = "VOICE_GENERATION",
  VIDEO_GENERATION = "VIDEO_GENERATION",
  VIDEO_FILTERING = "VIDEO_FILTERING",
  VIDEO_UPSCALING = "VIDEO_UPSCALING",
  VIDEO_DEPTH_MAPPING = "VIDEO_DEPTH_MAPPING",
  VIDEO_SEGMENTATION = "VIDEO_SEGMENTATION",
}

export enum ClapWorkflowEngine {
  // the default pipeline (can be anything, this is left to the app developer)
  DEFAULT = "DEFAULT",

  REST_API = "REST_API",

  GRADIO_API = "GRADIO_API",

  // for any API that natively accepts OpenClap
  OPENCLAP = "OPENCLAP",

  // the JSON format used by ComfyUI
  COMFYUI_WORKFLOW = "COMFYUI_WORKFLOW",

  // the proprietary format used by Fal.ai
  // Fal.ai also supports ComfyUI workflows, but this is separate
  FALAI_WORKFLOW = "FALAI_WORKFLOW",

  // the proprietary format used by Glif
  // Glif also supports ComfyUI workflows, but as part of a Glif workflow
  GLIF_WORKFLOW = "GLIF_WORKFLOW",

  // the format used by Google Visual Blocks
  // this is a new and experimental tool, usage is limited for now,
  // I think it can be used in a Colab only and there are now API
  VISUALBLOCKS_WORKFLOW = "VISUALBLOCKS_WORKFLOW"
}

export type ClapWorkflow = {
  id: string

  /**
   * Human-readable label (this is the name or title of the workflow)
   */
  label: string

  /**
   * Long description of what the workflow is about.
   */
  description: string

  /**
   * List of keywords used to describe the workflow.
   * 
   * Examples: upscaling, lip-sync, body animation, text-to-video..
   */
  tags: string[]

  /**
   * The original author of the workflow
   * 
   * Can be a name, email, social media handle..
   */
  author: string

  /**
   * A thumbnail representing the workflow.
   * 
   * Can be hosted on a remote server or in base64
   * (we could use a "ClapAssetSource" here too, but the thumbnail is not
   * used within a workflow so there is no need to do any kind of precise optimization or verification here)
   */
  thumbnailUrl: string

  /**
   * Whether the workflow forbids commercial usage or not
   */
  nonCommercial: boolean

  engine: ClapWorkflowEngine

  category: ClapWorkflowCategory

  provider: ClapWorkflowProvider

  /**
   * The workflow data itself
   * 
   * This is typically a serialized JSON, although this can be other things
   * depending on which engine is used (YAML, base64, or even an ID to a proprietary commercial platform)
   */
  data: string

  /**
   * The workflow schema (optional)
   * 
   * This is used to visualize the workflow in our workflow editor
   * 
   */
  schema: string

  /**
   * Inputs of the workflow (this is used to build an UI for the automatically)
   */
  inputFields: ClapInputFields 

  /**
   * Default values (this is used to initialize the workflow automatically)
   */
  inputValues: ClapInputValues
}

export type ClapEntity = {
  id: string
  category: ClapSegmentCategory

  /**
   * keyword referencing the entity within a screenplay
   * 
   * Typically in UPPERCASE
   */
  triggerName: string

  /**
   * Human-readable label (this is the name or title of the entity)
   */
  label: string

  /**
   * Long description of what the entity is about.
   * 
   * This can be for instance a short history or biography of the entity.
   */
  description: string

  /**
   * List of keywords used to describe the entity.
   * 
   * Examples: location, character, male, female, car..
   */
  tags: string[]

  /**
   * The original author of the entity
   * 
   * Can be a name, email, social media handle..
   */
  author: string

  /**
   * A thumbnail representing the entity.
   * 
   * Can be hosted on a remote server or in base64
   * (we could use a "ClapAssetSource" here too, but the thumbnail is not
   * used within a workflow so there is no need to do any kind of precise optimization or verification here)
   */
  thumbnailUrl: string

  /**
   * The seed associated with the entity.
   * 
   * This can be used to reproduce the settings (eg. reproduce the image
   * from the image prompt, by re-using the same seed)
   */
  seed: number

  /**
   * Text prompt describing the appearance of the entity
   */
  imagePrompt: string

  /**
   * Where the image is hosted (remote, local file etc)
   */
  imageSourceType: ClapAssetSource

  /**
   * Can be used to tell the model used to generate the engine (eg. SDXL, Dalle-3)
   */
  imageEngine: string

  /**
   * The "identity picture" of the entity
   * 
   * if this is too confusing to people, we can rename it
   * 
   * this is a regular URI so, it can be a file path, a remote url, a base64..
   */
  imageId: string

  
  /**
   * Text prompt describing the voice
   * 
   * Eg. "low quality phone recording of an old man"
   */
  audioPrompt: string

  /**
   * Where the audio is hosted (remote, local file etc)
   */
  audioSourceType: ClapAssetSource

  /**
   * The engine used to generate the audio
   * 
   * This is important as this impacts what is the vendor and type audioId
   */
  audioEngine: ClapEntityAudioEngine

  /**
   * The voice identity (the "identity picture" equivalent of the voice)
   * 
   * Depending on the engine, this can be a voice sample or an ID to a 3rd party proprietary platform
   */
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

export type ClapTrack = {
  id: number
  name: string
  isPreview: boolean
  height: number
  hue: number
  occupied: boolean
  visible: boolean
}

export type ClapTracks = ClapTrack[]

export type ClapProject = {
  meta: ClapMeta
  workflows: ClapWorkflow[]
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
  FULL = "FULL",

  /**
   * the API and the client will return a partial clap file containing only the changes,
   * containing only the new values and changes.
   * This is useful for real-time applications and streaming.
   */
  PARTIAL = "PARTIAL",

  /**
   * the API will return a partial clap file containing only the changes,
   * and the client will return a merge of the original with the new values.
   * This is safe to run, there are no side-effects.
   */
  MERGE = "MERGE",

  /**
   * the API will return a partial clap file, and the client will replace the original.
   * This is the most efficient mode, but it relies on side-effects and inline object updates.
   */
  REPLACE = "REPLACE"
}

export type ParseClapProgressUpdate = ({
  value,
  sleepDelay,
  message
}: {
  value: number
  sleepDelay?: number
  message?: string
}) => Promise<void>
