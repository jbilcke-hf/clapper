import { StoreApi, UseBoundStore } from "zustand"
import { TimelineStore } from "@aitube/timeline"

import { BroadcastStore } from "./broadcast"
import { EditorStore } from "./editor"
import { MonitorStore } from "./monitor"
import { RendererStore } from "./renderer"

export type BroadcastController = UseBoundStore<StoreApi<BroadcastStore>>
export type EditorController = UseBoundStore<StoreApi<EditorStore>>
export type MonitorController = UseBoundStore<StoreApi<MonitorStore>>
export type RendererController = UseBoundStore<StoreApi<RendererStore>>
export type TimelineController = UseBoundStore<StoreApi<TimelineStore>>

// the controllers publicly available
// missing from this list are the settings and the plugins store itself
export type PublicControllers = {
  editor: EditorController
  monitor: MonitorController
  timeline: TimelineController
  renderer: RendererController
  broadcast: BroadcastController
}