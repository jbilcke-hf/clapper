import { ClapInputField } from "@aitube/clap/dist/types"

import { VersionControls, VersionState } from "./version-control"

export type Filter = {
  id: string
  label: string
  parameters: Array<ClapInputField>
  shader: string // WGSL shader code for the filter
}

export type FilterParams = Record<string, string | number | boolean> 

export type FilterWithParams = {
  filter: Filter
  parameters: FilterParams
}

export type FilterEditorState = {
  isEnabled: boolean
  availableFilters: Filter[]
  activeFilters: FilterWithParams[]
}& VersionState<FilterWithParams[]>

export type FilterEditorControls = {
  runFilterPipeline: (input: string) => Promise<string>

  setEnabled: (isEnabled: boolean) => void

  // later we can have functions like addFilter()
  // which could be used by the plugin engine to add filters
} & VersionControls<FilterWithParams[]>

export type FilterEditorStore = FilterEditorState & FilterEditorControls