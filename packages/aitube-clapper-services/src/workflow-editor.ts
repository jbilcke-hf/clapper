import { ClapWorkflow } from "@aitube/clap"

import { VersionControls, VersionState } from "./version-control"

export type WorkflowEditorTheme = {
  bgColor?: string;
  node: {
    bgColor?: string;
    borderColor?: string;
    textPrimaryColor?: string;
    textSecondaryColor?: string;
    radius?: string;
  }
  handle: {
    inputColor?: string;
    outputColor?: string;
  }
}

export type WorkflowEditorState = {

} & VersionState<ClapWorkflow>

export type WorkflowEditorControls = {
  
} & VersionControls<ClapWorkflow>

export type WorkflowEditorStore = WorkflowEditorState & WorkflowEditorControls
