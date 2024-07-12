import { create } from "zustand"
import { ClapEntity } from "@aitube/clap"
import { EntityEditorStore } from "@aitube/clapper-services"
import { TimelineStore, useTimeline } from "@aitube/timeline"

import { getDefaultEntityEditorState } from "./getDefaultEntityEditorState"

export const useEntityEditor = create<EntityEditorStore>((set, get) => ({
  ...getDefaultEntityEditorState(),
  setCurrent: (current?: ClapEntity) => set({ current }),
  undo: () => {},
  redo: () => {},
  setDraft: (draft?: ClapEntity) => set({ draft }),
  selectEntity: (id: string) => {
    const { entityIndex }: TimelineStore = useTimeline.getState()
    set({ current: entityIndex[id] })
  },
  addEntity: (entity: ClapEntity) => {
    const { addEntities }: TimelineStore = useTimeline.getState()
    addEntities([entity])
    get().setCurrent(entity)
  },
  removeEntity: (id: string) => {
    const { deleteEntities }: TimelineStore = useTimeline.getState()
    deleteEntities([id])
    get().setCurrent(undefined)
  },
  setShowEntityList: (showEntityList: boolean) => {
    set({ showEntityList })
  }
}))
