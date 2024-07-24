import { ClapWorkflow } from "@aitube/clap"

import { VersionControls, VersionedState } from "./version-control"

export type WorkflowEditorState = {

} & VersionedState<ClapWorkflow>

export type WorkflowEditorControls = {
  
} & VersionControls<ClapWorkflow>

export type WorkflowEditorStore = WorkflowEditorState & WorkflowEditorControls
