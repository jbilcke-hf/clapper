import { ClapEntity, ClapMeta } from "@aitube/clap"

// TODO: export this one in a more proper way
import { ClapInputField } from "@aitube/clap/dist/types"

import { TimelineSegment } from "@aitube/timeline"

import { SettingsState } from "./settings"
import { ChatEvent, ResolveRequestPrompts } from "./base-types"

export type ResolveRequest = {
  settings: SettingsState

  // the reference segment to render (eg. storyboard or video)
  segment: TimelineSegment

  // the slice to use for rendering
  segments: TimelineSegment[]

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
  segments: TimelineSegment[]

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

export enum ProjectCreationWizardStep {
  NONE = "NONE",
  CHOOSE_CATEGORY = "CHOOSE_CATEGORY",
  CREATE_FROM_PROMPT = "CREATE_FROM_PROMPT",
}

/**
 * We use a simplified representation of what is a segment
 *
 * This is used for LLM interactions
 */
export type SimplifiedSegmentData = {
  // id: string
  prompt: string
  startTimeInMs: number
  endTimeInMs: number
  category: string
}