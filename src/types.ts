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
  CUSTOM = "CUSTOM",
  HUGGINGFACE = "HUGGINGFACE",
  REPLICATE = "REPLICATE",
}

export enum AssetGenerationStrategy {

  // generate assets when the user asks for it explicitely
  ON_DEMAND = "ON_DEMAND_",

  // generate missing assets currently visible on screen, and that's all
  ON_SCREEN_ONLY = "ON_SCREEN_ONLY",

  // generate missing assets visible on screen first,
  // then pre-generate surrouding assets (a bit before and after)
  ON_SCREEN_THEN_SURROUNDING = "ON_SCREEN_THEN_SURROUNDING",

  // generate missing assets visible on screen first,
  // then pre-generate *ALL* the remaining project's assets
  //
  // this is hardcore! only GPU-rich people shoud use this one!
  ON_SCREEN_THEN_ALL = "ON_SCREEN_THEN_ALL",
}

// TODO: rename the *Model fields to better indicate if this is a LLM or RENDER mdoel
export type Settings = {
  comfyVendor: ComfyVendor
  comfyApiKey: string

  storyboardGenerationStrategy: AssetGenerationStrategy
  videoGenerationStrategy: AssetGenerationStrategy

  maxNbAssetsToGenerateInParallel: number
}

export type RenderRequest = {
  comfyVendor: ComfyVendor

  // secret vendor api key to use (provided by the user)
  comfyApiKey: string

  // URL to use for the vendor
  // vendorUrl: string

  // ComfyUI workflow to use
  comfyWorkflow: string

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