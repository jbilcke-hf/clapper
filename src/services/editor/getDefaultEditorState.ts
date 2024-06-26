import { EditorState, EditorView } from "@aitube/clapper-services"

export function getDefaultEditorState(): EditorState {
  const state: EditorState = {
    view: EditorView.SCRIPT,
    monaco: undefined,
    textModel: undefined,
    standaloneCodeEditor: undefined,
    mouseIsInside: false,
    draft: "",
    lineNumberToMentionedSegments: {},

    scrollHeight: 0,
    scrollLeft: 0,
    scrollTop: 0,
    scrollWidth: 0,
    scrollTopInMs: 0,
  }

  return state
}
