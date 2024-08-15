import { ClapMeta } from "@aitube/clap"

import { VersionControls, VersionState } from "./version-control"

export type ProjectEditorState = {
  
} & VersionState<ClapMeta>


export type ProjectEditorControls = {

} & VersionControls<ClapMeta>

export type ProjectEditorStore = ProjectEditorState & ProjectEditorControls
