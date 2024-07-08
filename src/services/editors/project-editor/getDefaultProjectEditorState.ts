import { ProjectEditorState } from "@aitube/clapper-services"

export function getDefaultProjectEditorState(): ProjectEditorState {
  const state: ProjectEditorState = {
    current: undefined,
    version: 0,
    history: [],
  }

  return state
}
