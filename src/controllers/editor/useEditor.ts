"use client"

import MonacoEditor from "monaco-editor"
import { create } from "zustand"

import { EditorStore, ScrollData } from "./types"
import { getDefaultEditorState } from "./getDefaultEditorState"
import { ClapProject, ClapSegment, ClapSegmentCategory } from "@aitube/clap"
import { TimelineStore, useTimeline, leftBarTrackScaleWidth } from "@aitube/timeline"
import { Monaco } from "@monaco-editor/react"

export const useEditor = create<EditorStore>((set, get) => ({
  ...getDefaultEditorState(),
  setMonaco: (monaco?: Monaco) => { set({ monaco}) },
  setEditor: (editor?: MonacoEditor.editor.IStandaloneCodeEditor) => { set({ editor }) },
  setMouseIsInside: (mouseIsInside: boolean) => { set({ mouseIsInside }) },
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
  }: ScrollData) => {
    const { 
      scrollHeight: previousScrollHeight,
      scrollLeft: previousScrollLeft,
      scrollTop: previousScrollTop,
      scrollWidth: previousScrollWidth,
      mouseIsInside
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
    })

    // if the scroll event happened while we where inside the editor,
    // then we need to dispatch the it
    if (mouseIsInside) {

      const timeline: TimelineStore = useTimeline.getState()
      if (!timeline.timelineCamera || !timeline.timelineControls) { return }

      const { editor } = get()
    
      const scrollRatio = scrollTop / scrollHeight
      const scrollX = Math.round(leftBarTrackScaleWidth + scrollRatio * timeline.contentWidth)
      
      /*console.log({
        scrollHeight,
        scrollLeft,
        scrollTop,
        scrollWidth,
        scrollRatio,
        scrollX
      })
       */

      if (useTimeline.getState().scrolX !== scrollX) {
        useTimeline.setState({ scrollX })
        timeline.timelineCamera.position.setX(scrollX)
        timeline.timelineControls.target.setX(scrollX)
      }
    }
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