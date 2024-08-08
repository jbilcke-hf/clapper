'use client'

import { create } from 'zustand'
import { WorkflowEditorStore } from '@aitube/clapper-services'
import { ClapWorkflow } from '@aitube/clap'

import { getDefaultWorkflowEditorState } from './getDefaultWorkflowEditorState'

export const useWorkflowEditor = create<WorkflowEditorStore>((set, get) => ({
  ...getDefaultWorkflowEditorState(),
  setCurrent: (current?: ClapWorkflow) => {
    set({ current })
  },
  undo: () => {},
  redo: () => {},

  updateAvailableWorkflows: async () => {
    // TODO pull data from.. somewhere
  },
}))
