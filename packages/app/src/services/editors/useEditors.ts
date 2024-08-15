'use client'

import { create } from 'zustand'
import { EditorsStore, EditorView } from '@aitube/clapper-services'

import { getDefaultEditorsState } from './getDefaultEditorsState'

export const useEditors = create<EditorsStore>((set, get) => ({
  ...getDefaultEditorsState(),
  setView: (view: EditorView) => {
    set({ view })
  },
}))
