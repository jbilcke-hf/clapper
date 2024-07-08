"use client"

import { ClapMeta } from "@aitube/clap"
import { create } from "zustand"
import { ProjectEditorStore } from "@aitube/clapper-services"

import { getDefaultProjectEditorState } from "./getDefaultProjectEditorState"
import { TimelineStore, useTimeline } from "@aitube/timeline"

export const useProjectEditor = create<ProjectEditorStore>((set, get) => ({
  ...getDefaultProjectEditorState(),
  setCurrent: (current?: ClapMeta) => {
    const timeline: TimelineStore = useTimeline.getState()
    set({ current })
    if (current && timeline?.clap?.meta) {
      Object.assign(timeline.clap.meta, current)
    }
  },
  undo: () => {},
  redo: () => {},
}))


if (typeof window !== "undefined") {
  (window as any).useProjectEditor = useProjectEditor
}