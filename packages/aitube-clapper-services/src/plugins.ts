
import { PublicServices } from "./services"
import {
  ClapperPlugin,
  ClapperPluginMeta,
  ClapperPluginSettings,
} from "./plugin"

export type ClapperPluginApi = {
  /**
   * Provide some public controllers
   * 
   * @returns 
   */
  getServices: () => Promise<PublicServices>

  /**
   * Load the plugin settings saved by the user
   * 
   * (to the local storage usually)
   * @returns 
   */
  getSettings: () => Promise<ClapperPluginSettings>
}

export type PluginsState = {
  // list of plugins available for install
  availablePlugins: ClapperPluginMeta[]

  installedPlugins: Record<string, ClapperPlugin>
}

export type PluginsControls = {
  refreshAvailablePlugins: () => Promise<void>

  install: (id: string) => Promise<void>
  uninstall: (id: string) => Promise<void>

  pluginApiGetServices: (id: string) => Promise<PublicServices>
  pluginApiGetSettings: (id: string) => Promise<ClapperPluginSettings>

  connect: (plugin: ClapperPlugin) => Promise<ClapperPluginApi>
}

export type PluginsStore = PluginsState & PluginsControls