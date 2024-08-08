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
  availableWorkflows: ClapWorkflow[]
} & VersionState<ClapWorkflow>

export type WorkflowEditorControls = {
  updateAvailableWorkflows: () => Promise<void>
} & VersionControls<ClapWorkflow>

export type WorkflowEditorStore = WorkflowEditorState & WorkflowEditorControls
