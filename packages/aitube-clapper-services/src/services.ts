import { StoreApi, UseBoundStore } from "zustand"
import { TimelineStore } from "@aitube/timeline"

import { AssistantStore } from "./assistant"
import { MicStore } from "./mic"
import { BroadcastStore } from "./broadcast"
import { SegmentEditorStore } from "./segment-editor"
import { EntityEditorStore } from "./entity-editor"
import { ProjectEditorStore } from "./project-editor"
import { ScriptEditorStore } from "./script-editor"
import { WorkflowEditorStore } from "./workflow-editor"
import { EditorsStore } from "./editors"
import { MonitorStore } from "./monitor"
import { RendererStore } from "./renderer"
import { ResolverStore } from "./resolver"
import { PluginsStore } from "./plugins"
import { AudioStore } from "./audio"
import { SettingsStore } from "./settings"
import { SimulatorStore } from "./simulator"
import { TasksStore } from "./tasks"
import { UIStore } from "./ui"
import { IOStore } from "./io"
import { FiltersStore } from "./filters"

export type AssistantService = UseBoundStore<StoreApi<AssistantStore>>
export type MicService = UseBoundStore<StoreApi<MicStore>>
export type AudioService = UseBoundStore<StoreApi<AudioStore>>
export type BroadcastService = UseBoundStore<StoreApi<BroadcastStore>>
export type SegmentEditorService = UseBoundStore<StoreApi<SegmentEditorStore>>
export type EntityEditorService = UseBoundStore<StoreApi<EntityEditorStore>>
export type ProjectEditorService = UseBoundStore<StoreApi<ProjectEditorStore>>
export type ScriptEditorService = UseBoundStore<StoreApi<ScriptEditorStore>>
export type WorkflowEditorService = UseBoundStore<StoreApi<WorkflowEditorStore>>
export type EditorsService = UseBoundStore<StoreApi<EditorsStore>>
export type FiltersService = UseBoundStore<StoreApi<FiltersStore>>
export type MonitorService = UseBoundStore<StoreApi<MonitorStore>>
export type RendererService = UseBoundStore<StoreApi<RendererStore>>
export type ResolverService = UseBoundStore<StoreApi<ResolverStore>>
export type SettingsService = UseBoundStore<StoreApi<SettingsStore>>
export type SimulatorService = UseBoundStore<StoreApi<SimulatorStore>>
export type TasksService = UseBoundStore<StoreApi<TasksStore>>
export type TimelineService = UseBoundStore<StoreApi<TimelineStore>>
export type PluginsService = UseBoundStore<StoreApi<PluginsStore>>
export type UIService = UseBoundStore<StoreApi<UIStore>>
export type IOService = UseBoundStore<StoreApi<IOStore>>

export type PrivateServices = {
  plugins: PluginsService
  settings: SettingsService
}

// the controllers publicly available
// missing from this list are the settings and the plugins store itself
export type PublicServices = {
  assistant: AssistantService
  mic: MicService
  audio: AudioService
  tasks: TasksService
  segmentEditor: SegmentEditorService
  entityEditor: EntityEditorService
  projectEditor: ProjectEditorService
  scriptEditor: ScriptEditorService
  workflowEditor: WorkflowEditorService
  editors: EditorsService
  filters: FiltersService
  monitor: MonitorService
  timeline: TimelineService
  renderer: RendererService
  resolver: ResolverService
  broadcast: BroadcastService
  simulator: SimulatorService
  ui: UIService
  io: IOService
}

export type Services = PrivateServices & PublicServices