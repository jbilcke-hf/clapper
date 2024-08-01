'use client'

import { create } from 'zustand'
import {
  FilterEditorStore,
  FilterWithParams,
  redo,
  undo,
} from '@aitube/clapper-services'

import { getDefaultFilterEditorState } from './getDefaultFilterEditorState'
import { debouncedRunFilterPipeline } from './runFilterPipeline'

export const useFilterEditor = create<FilterEditorStore>()((set, get) => ({
  ...getDefaultFilterEditorState(),

  setEnabled: (isEnabled: boolean) => {
    set({ isEnabled })
  },

  runFilterPipeline: async (input: string) => {
    const { current } = get()
    const results = await debouncedRunFilterPipeline({
      images: [{ image: input }],
      filters: current || [],
    })

    const result = results[0]

    return result
  },

  setCurrent: (current?: FilterWithParams[]) => {
    set({ current })
  },

  undo: () => {
    set({
      ...undo<FilterWithParams[]>({
        ...get(),
      }),
    })
  },

  redo: () => {
    set({
      ...redo<FilterWithParams[]>({
        ...get(),
      }),
    })
  },
}))
