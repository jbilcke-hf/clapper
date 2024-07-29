import { SegmentEditorState } from '@aitube/clapper-services'

export function getDefaultSegmentEditorState(): SegmentEditorState {
  const state: SegmentEditorState = {
    before: [],
    current: undefined,
    after: [],
    version: 0,
  }

  return state
}
