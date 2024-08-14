'use client'

import { create } from 'zustand'
import { WorkflowEditorStore } from '@aitube/clapper-services'
import { ClapWorkflow } from '@aitube/clap'

import { getDefaultWorkflowEditorState } from './getDefaultWorkflowEditorState'
import { dynamicWorkflows, staticWorkflows } from './workflows'

export const useWorkflowEditor = create<WorkflowEditorStore>((set, get) => ({
  ...getDefaultWorkflowEditorState(),
  setCurrent: (current?: ClapWorkflow) => {
    set({ current })
  },
  undo: () => {},
  redo: () => {},

  updateAvailableWorkflows: async () => {
    let availableWorkflows: ClapWorkflow[] = []

    availableWorkflows = availableWorkflows.concat(
      staticWorkflows.map((w) => ({ ...w }))
    )

    for (const dynamicWorkflow of dynamicWorkflows) {
      availableWorkflows = availableWorkflows.concat(await dynamicWorkflow())
    }

    set({
      availableWorkflows,
    })
  },
}))
