import { ClapEntity } from "@aitube/clap"

import { VersionControls, VersionedState } from "./version-control"

export type EntityEditorState = {

} & VersionedState<ClapEntity>

export type EntityEditorControls = {
  selectEntity: (id: string) => void
  addEntity: (entity: ClapEntity) => void
  removeEntity: (id: string) => void
  updateEntity: (updatedEntity: ClapEntity) => void
  loadEntities: (entities: ClapEntity[]) => void
} & VersionControls<ClapEntity>

export type EntityEditorStore = EntityEditorState & EntityEditorControls
