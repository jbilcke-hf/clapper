"use client"

import { create } from "zustand"
import { SegmentEditorStore } from "@aitube/clapper-services"

import { getDefaultSegmentEditorState } from "./getDefaultSegmentEditorState"
import { TimelineSegment } from "@aitube/timeline"

export const useSegmentEditor = create<SegmentEditorStore>((set, get) => ({
  ...getDefaultSegmentEditorState(),
  setCurrent: (current?: TimelineSegment) => { set({ current }) },
  undo: () => {},
  redo: () => {},
}))
