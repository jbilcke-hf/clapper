import { EntityEditorState } from "@aitube/clapper-services"

export function getDefaultEntityEditorState(): EntityEditorState {
  const state: EntityEditorState = {
    current: undefined,
    version: 0,
    history: [],

    draft: undefined,
    showEntityList: false,
  }

  return state
}
