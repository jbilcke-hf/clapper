export enum EditorView {
  PROJECT = "PROJECT",
  SCRIPT = "SCRIPT",
  ENTITY = "ENTITY",
  SEGMENT = "SEGMENT",
  HISTORY = "HISTORY"
}

export type EditorsState = {
  view: EditorView
}

export type EditorsControls = {
  setView: (editorView: EditorView) => void
}

export type EditorsStore = EditorsState & EditorsControls
