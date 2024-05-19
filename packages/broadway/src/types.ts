import { ScreenplaySequenceType } from "@/constants/screenplaySequences"
import { ClapSegmentCategory } from "@aitube/clap"
import { SegmentColor } from "./constants/colors"

export type NamedEntity = {
  label: string
  aliases: {
    en: string[]
  }
  prompts: Omit<
    Record<ClapSegmentCategory, string[]>,
    "splat" | "interface" | "event" | "phenomenon" | "mesh" | "depth" | "video" | "storyboard" | "generic"
  >
}

export type LocationEntity = NamedEntity | {
  type: "INDOOR" | "OUTDOOR"
}

export type NamedEntityPosition = {
  sentence: number
  word: number
  begin: number
  end: number
}

export type NamedEntityResult = {
  ngram: string
  value: NamedEntity
  score: number
  position: NamedEntityPosition
}

export type NamedEntityParser = (input: string) => Promise<NamedEntityResult[]>

export type SimpleNamedEntityParser = (inputs?: string[], defaultValues?: string[], removeDuplicates?: boolean) => Promise<string[]>

export type SimpleOccurrencesCounter = (input: string, minimumOccurrences: number) => Promise<Record<string, number>> 

export interface ClapSegmentCategorySettings {
  id: ClapSegmentCategory // eg. "country"
  title: string // eg. Country
  description: string // description in one sentence
  color: SegmentColor // base color name, in lowercase
}

export type MovieScriptMeta = {
  fileName: string
  title: string
}
export type MovieScript = {
  meta: MovieScriptMeta
  content: string | Blob
}

export type SceneEvent = {
  id: string
  type: "description" | "dialogue" | "action"
  character?: string
  description: string
  behavior: string
  startAtLine: number
  endAtLine: number
}

export type Scene = {
  id: string
  scene: string
  line: string
  rawLine: string
  sequenceFullText: string
  sequenceStartAtLine: number
  sequenceEndAtLine: number
  startAtLine: number
  endAtLine: number
  events: SceneEvent[]
}

export type MergedLine = {
  rawLine: string
  trimmedLine: string
  startAtLine: number
  endAtLine: number
}

export type ScreenplaySequence = {
  id: string
  location: string[]
  type: ScreenplaySequenceType
  time: string
  transition: string
  fullText: string
  startAtLine: number
  endAtLine: number
  scenes: Scene[]
}

export type Screenplay = {
  fullText: string
  sequences: ScreenplaySequence[]
}

export type RenderedSceneStatus =
| "pending" // for retro-compatibility only, but this is deprecated
| "to_generate"
| "to_interpolate"
| "to_upscale"
| "completed"
| "error"

export interface ImageSegment {
  id: number
  box: number[]
  color: number[]
  label: string
  score: number 
}

export type RenderedScene = {
  renderId: string
  status: RenderedSceneStatus
  assetUrl: string
  durationInMs: number
  alt: string
  error: string
  maskUrl: string
  segments: ImageSegment[]
}


// --- what is below is only used during analysis, but I think we this is obsolete ---

export type AssetType =
  | "Direction"
  | "Image"
  | "Video"
  | "Description" // eg. "H.M.S. Dauntless" -> "A pirate ship made of wod, with sails.."

export type AssetCategory =
  | "character"
  | "location"
  | "unknown"


export type TemporaryAssetData = {
  id: string // unique identifier of the assets (UUID)
  type: AssetType
  category: AssetCategory
  label: string // the asset name (eg. in the script)
  content: string // url to the resource, or content string
  occurrences: number // how many times we see this asset
  sequences: ScreenplaySequence[]
  predictedPrompt: string
}