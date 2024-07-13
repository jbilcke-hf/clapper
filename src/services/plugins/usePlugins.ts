"use client"

import { create } from "zustand"
import { ClapperPlugin, ClapperPluginApi, ClapperPluginMeta, PluginsStore, PublicServices } from "@aitube/clapper-services"
import { useTimeline } from "@aitube/timeline"

import { getDefaultPluginsState } from "./getDefaultPluginsState"
import { useScriptEditor } from "../editors/script-editor/useScriptEditor"
import { useMonitor } from "../monitor/useMonitor"
import { useTasks } from "@/components/tasks/useTasks"
import { useRenderer } from "../renderer"
import { useBroadcast } from "../broadcast/useBroadcast"
import { useResolver } from "../resolver/useResolver"
import { useAssistant } from "../assistant/useAssistant"
import { useAudio } from "../audio/useAudio"
import { useUI } from "../ui"
import { fetchAndRun } from "./fetchAndRun"
import { useEditors, useEntityEditor, useProjectEditor, useSegmentEditor } from "../editors"
import { useSimulator } from "../simulator/useSimulator"
import { useIO } from "../io/useIO"
import { useMic } from "../mic/useMic"

export const usePlugins = create<PluginsStore>((set, get) => ({
  ...getDefaultPluginsState(),

  refreshAvailablePlugins: async () => {
    // TODO fetch the plugins from somewhere,
    // eg github, a .json file,
    // clapper.app/plugins.json etc

    set({
      availablePlugins: [
        //
      ]
    })
  },

  install: async (id: string) => {
    const { availablePlugins } = get()
    const plugin = availablePlugins.find(p => p.id === id)
    if (!plugin) { throw new Error(`couldn't find plugin "${id}"`) }

    await fetchAndRun(plugin.assetUrl)
  },
  uninstall: async (id: string) => {
    // TODO
  },

  pluginApiGetServices: async (id: string): Promise<PublicServices> => {
    return {
      audio: useAudio,
      assistant: useAssistant,
      mic: useMic,
      segmentEditor: useSegmentEditor,
      entityEditor: useEntityEditor,
      projectEditor: useProjectEditor,
      scriptEditor: useScriptEditor,
      editors: useEditors,
      monitor: useMonitor,
      tasks: useTasks,
      timeline: useTimeline,
      renderer: useRenderer,
      resolver: useResolver,
      broadcast: useBroadcast,
      simulator: useSimulator,
      ui: useUI,
      io: useIO,
    }
  },
  pluginApiGetSettings: async (id: string) => {
    return []
  },

  connect: async (plugin: ClapperPlugin) => {
    const api: ClapperPluginApi = {
      getServices: async (): Promise<PublicServices> => {
        return get().pluginApiGetServices(plugin.meta.id)
      },
      getSettings: async () => {
        return get().pluginApiGetSettings(plugin.meta.id)
      },
    }
    return api
  }
}));

if (typeof window !== "undefined") {

  (window as any).usePlugins = usePlugins;

  // plugins will have to execute:
  // usePlugins.getState().connect(<...>)
  (window as any).installPlugin = async (plugin: ClapperPlugin) => {
    return usePlugins.getState().connect(plugin)
  };
}

