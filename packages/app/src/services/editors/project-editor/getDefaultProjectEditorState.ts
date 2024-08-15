import { ProjectEditorState } from '@aitube/clapper-services'

export function getDefaultProjectEditorState(): ProjectEditorState {
  const state: ProjectEditorState = {
    before: [],
    current: undefined,
    after: [],
    version: 0,
  }

  return state
}
