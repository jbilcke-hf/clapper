import { ClapEntity, ClapMeta, ClapSegment } from "@aitube/clap"

import { SettingsState } from "./settings"
import { ChatEvent, ResolveRequestPrompts } from "./base-types"

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

  prompts: ResolveRequestPrompts
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

  history: ChatEvent[]
}
