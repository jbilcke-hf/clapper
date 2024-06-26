
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

  installedPlugins: ClapperPluginMeta[]

  runningPlugins: ClapperPluginMeta[]
}

export type PluginsControls = {
  refreshAvailablePlugins: () => Promise<void>

  getPluginServices: (plugin: ClapperPlugin) => PublicServices
  getPluginSettings: (plugin: ClapperPlugin) => ClapperPluginSettings

  install: (plugin: ClapperPlugin) => Promise<void>
  uninstall: (plugin: ClapperPlugin) => Promise<void>
}

export type PluginsStore = PluginsState & PluginsControls