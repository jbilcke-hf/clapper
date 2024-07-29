import { ClapInputField } from "@aitube/clap/dist/types"

import { VersionControls, VersionState } from "./version-control"

export type Filter = {
  id: string
  label: string
  parameters: Array<ClapInputField>
  shader: string // WGSL shader code for the filter
}

export type FilterEditorState = {
  availableFilters: Filter[]
}& VersionState<string>

export type FilterEditorControls = {
  applyFilters: (input: string) => Promise<string>

  // later we can have functions like addFilter()
  // which could be used by the plugin engine to add filters
} & VersionControls<string>

export type FilterEditorStore = FilterEditorState & FilterEditorControls