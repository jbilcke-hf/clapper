import { ClapProject, ClapSegment } from "@aitube/clap"
import MonacoEditor from "monaco-editor"

export type ScrollData = {
  scrollHeight: number
  scrollLeft: number
  scrollTop: number
  scrollWidth: number
}

export type EditorState = {
  // reference to the React component
  editor?: MonacoEditor.editor.IStandaloneCodeEditor

  // the full-text of the screenplay
  draft: string

  // map screenplay lines to dialogue segments
  // (note: some lines point to nothing, eg. when we have empty spaces)
  lineNumberToMentionedSegments: Record<number, ClapSegment>

  scrollChanges: number

  /**
   * the index of the first step visible in the current screenplay
   * 
   * (the topmost visible timeline step in the current timeline)
   */
  scrollTopInMs: number
} & ScrollData

export type EditorControls = {
  setEditor: (editor?: MonacoEditor.editor.IStandaloneCodeEditor) => void
  loadDraftFromClap: (clap: ClapProject) => void
  setDraft: (draft: string) => void
  publishDraftToTimeline: () => Promise<void>
  onDidScrollChange: (scrollData: ScrollData, ignoreChange?: boolean) => void
  jumpCursorOnLineClick: (line?: number) => void
}

export type EditorStore = EditorState & EditorControls
