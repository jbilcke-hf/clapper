import { ClapMeta } from "@aitube/clap"

import { VersionControls, VersionedState } from "./version-control"

export type ProjectEditorState = {
  
} & VersionedState<ClapMeta>


export type ProjectEditorControls = {

} & VersionControls<ClapMeta>

export type ProjectEditorStore = ProjectEditorState & ProjectEditorControls
