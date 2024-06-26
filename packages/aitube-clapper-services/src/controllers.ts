import { StoreApi, UseBoundStore } from "zustand"
import { TimelineStore } from "@aitube/timeline"

import { BroadcastStore } from "./broadcast"
import { EditorStore } from "./editor"
import { MonitorStore } from "./monitor"
import { RendererStore } from "./renderer"
import { PluginsStore } from "./plugins"
import { AudioStore } from "./audio"
import { TasksStore } from "./tasks"

export type AudioController = UseBoundStore<StoreApi<AudioStore>>
export type BroadcastController = UseBoundStore<StoreApi<BroadcastStore>>
export type EditorController = UseBoundStore<StoreApi<EditorStore>>
export type MonitorController = UseBoundStore<StoreApi<MonitorStore>>
export type RendererController = UseBoundStore<StoreApi<RendererStore>>
export type TasksController = UseBoundStore<StoreApi<TasksStore>>
export type TimelineController = UseBoundStore<StoreApi<TimelineStore>>
export type PluginsController = UseBoundStore<StoreApi<PluginsStore>>

export type PrivateControllers = {
  plugins: PluginsController
}

// the controllers publicly available
// missing from this list are the settings and the plugins store itself
export type PublicControllers = {
  audio: AudioController
  tasks: TasksController
  editor: EditorController
  monitor: MonitorController
  timeline: TimelineController
  renderer: RendererController
  broadcast: BroadcastController
}

export type Controllers = PrivateControllers & PublicControllers