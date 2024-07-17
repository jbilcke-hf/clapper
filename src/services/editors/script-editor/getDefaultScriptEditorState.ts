import { ScriptEditorState, EditorView } from '@aitube/clapper-services'

export function getDefaultScriptEditorState(): ScriptEditorState {
  const state: ScriptEditorState = {
    monaco: undefined,
    textModel: undefined,
    standaloneCodeEditor: undefined,
    mouseIsInside: false,
    draft: '',
    lineNumberToMentionedSegments: {},

    scrollHeight: 0,
    scrollLeft: 0,
    scrollTop: 0,
    scrollWidth: 0,
    scrollTopInMs: 0,

    current: undefined,
    version: 0,
    history: [],
  }

  return state
}
