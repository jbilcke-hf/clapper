import { PluginsState } from '@aitube/clapper-services'

export function getDefaultPluginsState(): PluginsState {
  const state: PluginsState = {
    availablePlugins: [],
    installedPlugins: {},
  }

  return state
}
