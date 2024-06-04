import { ClapEntity, ClapSegment } from "@aitube/clap"

export type TaskStatus =
  | "idle"
  | "generating"
  | "finished"
  | "error"

export type GlobalStatus =
  | "idle"
  | "generating"
  | "finished"
  | "error"

export type GenerationStage =
  | "parse"
  | "story"
  | "entities"
  | "sounds"
  | "music"
  | "voices"
  | "images"
  | "videos"
  | "final"
  | "idle"

export enum ComfyVendor {
  NONE = "NONE",
  CUSTOM = "CUSTOM",
  HUGGINGFACE = "HUGGINGFACE",
  REPLICATE = "REPLICATE",
}

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
}

// TODO: rename the *Model fields to better indicate if this is a LLM or RENDER mdoel
export type Settings = {
  comfyVendor: ComfyVendor
  comfyApiKey: string

  storyboardGenerationStrategy: RenderingStrategy
  videoGenerationStrategy: RenderingStrategy

  maxNbAssetsToGenerateInParallel: number
}

export type RenderRequest = {
  comfyUiApiVendor: ComfyVendor

  // secret vendor api key to use (provided by the user)
  comfyUiApiKey: string

  // available ComfyUI workflows
  // a render request might use multiple workflows (eg. entity + storyboard)
  // so we need to have them all readily available
  entityWorkflow: string
  dialogueWorkflow: string  
  storyboardWorkflow: string
  videoWorkflow: string
  musicWorkflow: string

  // the reference segment to render (eg. storyboard or video)
  segment: ClapSegment

  // the slice to use for rendering
  segments: ClapSegment[]

  entities: Record<string, ClapEntity>
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