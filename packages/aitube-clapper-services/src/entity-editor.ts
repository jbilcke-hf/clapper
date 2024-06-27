import { ClapEntity } from "@aitube/clap"

import { VersionControls, VersionedState } from "./version-control"

export type EntityEditorState = {

} & VersionedState<ClapEntity>

export type EntityEditorControls = {

} & VersionControls<ClapEntity>

export type EntityEditorStore = EntityEditorState & EntityEditorControls
