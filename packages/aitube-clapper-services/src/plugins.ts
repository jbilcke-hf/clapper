
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
  getServices: () => PublicServices

  /**
   * Load the plugin settings saved by the user
   * 
   * (to the local storage usually)
   * @returns 
   */
  getSettings: () => ClapperPluginSettings
}

export type PluginsState = {
  // list of plugins available for install
  availablePlugins: ClapperPluginMeta[]

  installedPlugins: ClapperPlugin[]

  runningPlugins: ClapperPlugin[]
}

export type PluginsControls = {
  refreshAvailablePlugins: () => Promise<void>

  install: (plugin: ClapperPluginMeta) => Promise<void>
  uninstall: (plugin: ClapperPluginMeta) => Promise<void>

  pluginApiGetServices: (plugin: ClapperPlugin) => PublicServices
  pluginApiGetSettings: (plugin: ClapperPlugin) => ClapperPluginSettings

  connect: (plugin: ClapperPlugin) => Promise<ClapperPluginApi>
}

export type PluginsStore = PluginsState & PluginsControls