import { EditorState } from "./types"

export function getDefaultEditorState(): EditorState {
  const state: EditorState = {
    editor: undefined,
    draft: "",
    lineNumberToMentionedSegments: {},

    scrollChanges: 0,
    scrollHeight: 0,
    scrollLeft: 0,
    scrollTop: 0,
    scrollWidth: 0,
    scrollTopInMs: 0,
  }

  return state
}
