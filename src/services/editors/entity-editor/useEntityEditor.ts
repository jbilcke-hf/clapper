import { create } from "zustand"
import { ClapEntity } from "@aitube/clap"
import { EntityEditorStore } from "@aitube/clapper-services"
import { useTimeline } from "@aitube/timeline"

import { getDefaultEntityEditorState } from "./getDefaultEntityEditorState"

export const useEntityEditor = create<EntityEditorStore>((set, get) => ({
  ...getDefaultEntityEditorState(),
  current: undefined,
  entities: [],
  setCurrent: (current?: ClapEntity) => set({ current }),
  selectEntity: (id: string) => {
    const entity = get().entities.find(e => e.id === id)
    set({ current: entity })
  },
  undo: () => {},
  redo: () => {},
  addEntity: (entity: ClapEntity) => {
    set(state => {
      const newEntities = [...state.entities, entity]
      const timelineState = useTimeline.getState()
      timelineState.setClap({
        ...timelineState.clap,
        entities: newEntities
      })
      return {
        entities: newEntities,
        current: entity
      }
    })
  },
  removeEntity: (id: string) => {
    set(state => {
      const newEntities = state.entities.filter(e => e.id !== id)
      const timelineState = useTimeline.getState()
      timelineState.setClap({
        ...timelineState.clap,
        entities: newEntities
      })
      return {
        entities: newEntities,
        current: state.current?.id === id ? undefined : state.current
      }
    })
  },
  updateEntity: (updatedEntity: ClapEntity) => {
    set(state => {
      const newEntities = state.entities.map(e => 
        e.id === updatedEntity.id ? updatedEntity : e
      )
      return {
        entities: newEntities,
        current: updatedEntity
      }
    })
    // Update the timeline state
    const timelineState = useTimeline.getState()
    timelineState.setClap({
      ...timelineState.clap,
      entities: get().entities
    })
  },
  loadEntities: (entities: ClapEntity[]) => {
    set({ entities, current: undefined })
  },
}))