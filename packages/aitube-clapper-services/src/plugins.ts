
import { PublicControllers } from "./controllers"
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
  getControllers: () => PublicControllers

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

  getPluginControllers: (plugin: ClapperPlugin) => PublicControllers
  getPluginSettings: (plugin: ClapperPlugin) => ClapperPluginSettings

  install: (plugin: ClapperPlugin) => Promise<void>
  uninstall: (plugin: ClapperPlugin) => Promise<void>
}

export type PluginsStore = PluginsState & PluginsControls