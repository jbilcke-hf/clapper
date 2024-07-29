'use client'

import { create } from 'zustand'
import {
  FilterEditorStore,
  FilterWithParams,
  redo,
  undo,
} from '@aitube/clapper-services'

import { getDefaultFilterEditorState } from './getDefaultFilterEditorState'
import { runFilterPipeline } from './runFilterPipeline'

export const useFilterEditor = create<FilterEditorStore>()((set, get) => ({
  ...getDefaultFilterEditorState(),

  setEnabled: (isEnabled: boolean) => {
    set({ isEnabled })
  },

  runFilterPipeline: async (input: string) => {
    const { activeFilters } = get()
    const results = await runFilterPipeline({
      images: [{ image: input }],
      filters: activeFilters,
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
