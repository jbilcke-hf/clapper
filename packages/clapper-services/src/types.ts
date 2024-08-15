// import { ClapEntity, ClapMeta } from "@aitube/clap"

import { TimelineSegment } from "@aitube/timeline"

import { RequestSettings, SettingsState } from "./settings"
import { ChatEvent, ResolveRequestPrompts } from "./base-types"

export type ResolveRequest = {
  settings: RequestSettings

  // the reference segment to render (eg. storyboard or video)
  segment: TimelineSegment

  // the slice to use for rendering
  segments: TimelineSegment[]

  entities: Record<string, any> // ClapEntity

  speakingCharactersIds: string[]
  generalCharactersIds: string[]
  mainCharacterId?: string
  mainCharacterEntity?: any // ClapEntity

  meta: any // ClapMeta

  prompts: ResolveRequestPrompts
}

export type AssistantRequest = {
  settings: RequestSettings

  prompt: string

  // the slice to edit
  segments: TimelineSegment[]

  // the full text of the current scene
  fullScene: string

  // the full text of the current action line
  actionLine: string
  
  // used to provide more context
  entities: Record<string, any> // ClapEntity

  // used to provide more context
  projectInfo: string

  history: ChatEvent[]
}
