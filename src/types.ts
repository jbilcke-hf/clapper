import { ClapEntity, ClapMeta, ClapSegment, ClapSegmentCategory, ClapSegmentStatus } from "@aitube/clap"
import { SettingsState } from "./controllers/settings"

export enum SettingsCategory {
  NONE = "NONE",
  PROVIDER = "PROVIDER",
  ASSISTANT = "ASSISTANT",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  VOICE = "VOICE",
  MUSIC = "MUSIC",
  SOUND = "SOUND"
}

export enum ComputeProvider {
  NONE = "NONE",
  CUSTOM = "CUSTOM",
  HUGGINGFACE = "HUGGINGFACE", // https://huggingface.co
  COMFY_HUGGINGFACE = "COMFY_HUGGINGFACE", // https://huggingface.co
  REPLICATE = "REPLICATE", // https://replicate.com
  COMFY_REPLICATE = "COMFY_REPLICATE", // https://replicate.com
  COMFY_COMFYICU = "COMFY_COMFYICU", // https://comfy.icu
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
}

export enum ComfyIcuAccelerator {
  T4 = "T4",
  L4 = "L4",
  A10 = "A10",
  A100_40GB = "A100_40GB",
  A100_80GB = "A100_80GB",
  H100 = "H100"
}

export type ResolveRequest = {
  settings: SettingsState

  // the reference segment to render (eg. storyboard or video)
  segment: ClapSegment

  // the slice to use for rendering
  segments: ClapSegment[]

  entities: Record<string, ClapEntity>

  speakingCharactersIds: string[]
  generalCharactersIds: string[]
  mainCharacterId?: string
  mainCharacterEntity?: ClapEntity

  meta: ClapMeta
}

export type AssistantRequest = {
  settings: SettingsState

  prompt: string

  // the slice to edit
  segments: ClapSegment[]

  // the full text of the current scene
  fullScene: string

  // the full text of the current action line
  actionLine: string
  
  // used to provide more context
  entities: Record<string, ClapEntity>

  // used to provide more context
  projectInfo: string
}

export type AssistantResponse = {
  prompt: string
  categoryName: ClapSegmentCategory
  llmOutput: string
}

export type ComfyParameter =
  | string
  | number
  | boolean
  | Array< string | number | boolean>

export type ComfyNode = {
  inputs: Record<string, ComfyParameter>
  /*
  inputs: {
    "seed": number
    "steps": number
    "cfg": number
    "sampler_name":string
    "scheduler": string
    "denoise": number
    "model": any[]
    "positive": any[]
    "negative": any[]
    "latent_image": any[]
  }
    */
  class_type: string
  _meta: {
    title: string
  }
}

export enum FalAiImageSize {
  SQUARE_HD = "square_hd",
  SQUARE = "square",
  PORTRAIT_4_3 = "portrait_4_3",
  PORTRAIT_16_9 = "portrait_16_9",
  LANDSCAPE_4_3 = "landscape_4_3",
  LANDSCAPE_16_9 = "landscape_16_9"
}

export interface ImageSegment {
    id: number;
    box: number[];
    color: number[];
    label: string;
    score: number;
}

export enum SegmentVisibility {
  // the segment is visible, and the user explicitly requested to render it before the others
  DEMANDED = "DEMANDED",

  // TODO: add some implicit intermediary priority options
  // such as SELECTED, HOVERED..

  // the segment (or at least a portion of it) is currently visible in the sliding window
  VISIBLE = "VISIBLE",

  // the segment is hidden, but not too far from the sliding window
  BUFFERED = "BUFFERED",

  // fully hidden, far from the sliding window
  HIDDEN = "HIDDEN"
}

// used for sort
export const SegmentVisibilityPriority: Record<SegmentVisibility, number> = {
    // the segment is visible, and the user explicitly requested to render it before the others
  [SegmentVisibility.DEMANDED]: 3,

  // TODO: add some implicit intermediary priority options
  // such as SELECTED, HOVERED..

  // the segment (or at least a portion of it) is currently visible in the sliding window
  [SegmentVisibility.VISIBLE]: 2,

  // the segment is hidden, but not too far from the sliding window
  [SegmentVisibility.BUFFERED]: 1,

  // fully hidden, far from the sliding window
  [SegmentVisibility.HIDDEN]: 0
}

// some data can only exist inside a browser session (eg. AudioBuffer)
// or at least data that only make sense on client side
// we could put things like a mouse hover or selected state in here
export type BrowserOnlySegmentData = {
  audioBuffer?: AudioBuffer

  visibility?: SegmentVisibility
}

export type RuntimeSegment = ClapSegment & BrowserOnlySegmentData