import { SegmentEditorState } from "@aitube/clapper-services"

export function getDefaultSegmentEditorState(): SegmentEditorState {
  const state: SegmentEditorState = {
    current: undefined,
    version: 0,
    history: [],
  }

  return state
}
