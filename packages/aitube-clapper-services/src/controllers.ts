import { StoreApi, UseBoundStore } from "zustand"
import { TimelineStore } from "@aitube/timeline"

import { BroadcastStore } from "./broadcast"
import { EditorStore } from "./editor"
import { MonitorStore } from "./monitor"
import { RendererStore } from "./renderer"
import { PluginsStore } from "./plugins"

export type BroadcastController = UseBoundStore<StoreApi<BroadcastStore>>
export type EditorController = UseBoundStore<StoreApi<EditorStore>>
export type MonitorController = UseBoundStore<StoreApi<MonitorStore>>
export type RendererController = UseBoundStore<StoreApi<RendererStore>>
export type TimelineController = UseBoundStore<StoreApi<TimelineStore>>
export type PluginsController = UseBoundStore<StoreApi<PluginsStore>>

export type PrivateControllers = {
  plugins: PluginsController
}

// the controllers publicly available
// missing from this list are the settings and the plugins store itself
export type PublicControllers = {
  editor: EditorController
  monitor: MonitorController
  timeline: TimelineController
  renderer: RendererController
  broadcast: BroadcastController
}

export type Controllers = PrivateControllers & PublicControllers