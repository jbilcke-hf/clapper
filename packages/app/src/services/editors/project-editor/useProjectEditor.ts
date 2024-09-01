'use client'

import { ClapMeta } from '@aitube/clap'
import { create } from 'zustand'
import { ProjectEditorStore } from '@aitube/clapper-services'

import { getDefaultProjectEditorState } from './getDefaultProjectEditorState'
import { TimelineStore, useTimeline } from '@aitube/timeline'

export const useProjectEditor = create<ProjectEditorStore>((set, get) => ({
  ...getDefaultProjectEditorState(),
  setCurrent: (current?: ClapMeta) => {
    const timeline: TimelineStore = useTimeline.getState()
    set({ current })
    if (current && timeline) {
      // note: we really need to be sure that current is valid here
      Object.assign(timeline, current)
    }
  },
  undo: () => {},
  redo: () => {},
}))
