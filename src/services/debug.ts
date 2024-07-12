import { useTasks } from "@/components/tasks/useTasks"
import { useAssistant } from "./assistant/useAssistant"
import { useAudio } from "./audio/useAudio"
import { useBroadcast } from "./broadcast/useBroadcast"
import { useEditors, useEntityEditor, useProjectEditor, useScriptEditor, useSegmentEditor } from "./editors"
import { useIO } from "./io/useIO"
import { useMetrics } from "./metrics/useMetrics"
import { useMonitor } from "./monitor/useMonitor"
import { useRenderer } from "./renderer/useRenderer"
import { useResolver } from "./resolver/useResolver"
import { useSettings } from "./settings/useSettings"
import { useSimulator } from "./simulator/useSimulator"
import { useUI } from "./ui/useUI"

// those are just used for developer convenience
// to help debug things in the chrome developer console
if (typeof window !== "undefined") {
  const w = window as any
  w.useTasks = useTasks
  w.useAssistant = useAssistant
  w.useAudio = useAudio
  w.useBroadcast = useBroadcast
  w.useEditors = useEditors
  w.useEntityEditor = useEntityEditor
  w.useProjectEditor = useProjectEditor
  w.useScriptEditor = useScriptEditor
  w.useSegmentEditor = useSegmentEditor
  w.useIO = useIO
  w.useMetrics = useMetrics
  w.useMonitor = useMonitor
  w.useRenderer = useRenderer
  w.useResolver = useResolver
  w.useSettings = useSettings
  w.useSimulator = useSimulator
  w.useUI = useUI
}
