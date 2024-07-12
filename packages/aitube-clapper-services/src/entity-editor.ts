import { ClapEntity } from "@aitube/clap"

import { VersionControls, VersionedState } from "./version-control"

export type EntityEditorState = {
  draft?: ClapEntity
  showEntityList: boolean
} & VersionedState<ClapEntity>

export type EntityEditorControls = {
  setDraft: (draft?: ClapEntity) => void
  selectEntity: (id: string) => void
  addEntity: (entity: ClapEntity) => void
  removeEntity: (id: string) => void
  setShowEntityList: (showEntityList: boolean) => void
} & VersionControls<ClapEntity>

export type EntityEditorStore = EntityEditorState & EntityEditorControls
