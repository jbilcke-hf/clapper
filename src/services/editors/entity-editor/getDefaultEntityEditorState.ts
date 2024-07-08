import { EntityEditorState } from "@aitube/clapper-services"

export function getDefaultEntityEditorState(): EntityEditorState {
  const state: EntityEditorState = {
    current: undefined,
    version: 0,
    history: [],
  }

  return state
}
