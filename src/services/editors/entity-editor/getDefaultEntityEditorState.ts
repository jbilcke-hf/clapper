import { EntityEditorState } from '@aitube/clapper-services'

export function getDefaultEntityEditorState(): EntityEditorState {
  const state: EntityEditorState = {
    before: [],
    current: undefined,
    after: [],
    version: 0,

    draft: undefined,
    showEntityList: false,
  }

  return state
}
