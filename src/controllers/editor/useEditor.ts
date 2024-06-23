"use client"

import MonacoEditor from "monaco-editor"
import { create } from "zustand"

import { EditorStore, ScrollData } from "./types"
import { getDefaultEditorState } from "./getDefaultEditorState"
import { ClapProject, ClapSegment, ClapSegmentCategory } from "@aitube/clap"
import { TimelineStore, useTimeline, leftBarTrackScaleWidth } from "@aitube/timeline"

export const useEditor = create<EditorStore>((set, get) => ({
  ...getDefaultEditorState(),
  setEditor: (editor?: MonacoEditor.editor.IStandaloneCodeEditor) => { set({ editor }) },
  loadDraftFromClap: (clap: ClapProject) => {
    const { setDraft } = get()

    setDraft(clap.meta.screenplay)
  },
  setDraft: (draft: string) => {
    const { draft: previousDraft } = get()
    if (draft === previousDraft) { return }
    set({ draft })

    const { editor } = get()
    if (!editor) { return }
    editor?.setValue(draft)
  },
  publishDraftToTimeline: async (): Promise<void> => {
    const { draft } = get()
    console.log(`user asked to update the whole scene! this is expensive..`)
    // we can do something smart, which is to only reconstruct the impacted segments
    // and shift the rest along the time axis, without modifying it
  },
  onDidScrollChange: ({
    scrollHeight,
    scrollLeft,
    scrollTop,
    scrollWidth
  }: ScrollData, ignoreChange = false) => {
    const { 
      scrollHeight: previousScrollHeight,
      scrollLeft: previousScrollLeft,
      scrollTop: previousScrollTop,
      scrollWidth: previousScrollWidth,
      scrollChanges
    } = get()

    // skip if nothing changed
    if (
      scrollHeight === previousScrollHeight &&
      scrollLeft === previousScrollLeft &&
      scrollTop === previousScrollTop &&
      scrollWidth === previousScrollWidth
    ) {
      return
    }

    set({
      scrollHeight,
      scrollLeft,
      scrollTop,
      scrollWidth,

      // optionally mark the state as stale
      scrollChanges: scrollChanges + (ignoreChange ? 0 : 1),
    })

    const timeline: TimelineStore = useTimeline.getState()
    if (!timeline.timelineCamera || !timeline.timelineControls) { return }

    const { editor } = get()
  
    const scrollRatio = scrollTop / scrollHeight
    const scrollX = leftBarTrackScaleWidth + scrollRatio * timeline.contentWidth
    console.log({
      scrollHeight,
      scrollLeft,
      scrollTop,
      scrollWidth,
      scrollRatio,
      scrollX
    })
    useTimeline.setState({ scrollX })
    timeline.timelineCamera.position.setX(scrollX)
    timeline.timelineControls.target.setX(scrollX)
  },
  jumpCursorOnLineClick: (line?: number) => {
    if (typeof line !== "number") { return }
    const timeline: TimelineStore = useTimeline.getState()
  
    const { lineNumberToMentionedSegments } = timeline

    const mentionedSegments = lineNumberToMentionedSegments[line] || []

    const firstMentionedSegment = mentionedSegments.at(0)


    if (typeof firstMentionedSegment?.startTimeInMs !== "number") { return }

    const { startTimeInMs } = firstMentionedSegment

    timeline.setCursorTimestampAtInMs(startTimeInMs)
  },

}))


if (typeof window !== "undefined") {
  (window as any).useEditor = useEditor
}