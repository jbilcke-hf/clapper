import { StoreApi, UseBoundStore } from "zustand"

export enum ClapperPluginCategory {
  THEME = "THEME",
  IMPORTER = "IMPORTER",
  EXPORTER = "EXPORTER",
  RESOLVER = "RESOLVER"
}

export enum ClapperPluginSettingType {
  STRING = "STRING",
  NUMBER = "NUMBER",
  BOOLEAN = "BOOLEAN"
}

export type ClapperPluginSettingBase = {
  key: string
  label: string
}
export type ClapperPluginSettingString = {
  value: string
  defaultValue: string
  type: ClapperPluginSettingType.STRING
}
export type ClapperPluginSettingNumber = {
  value: number
  defaultValue: number
  type: ClapperPluginSettingType.NUMBER
}
export type ClapperPluginSettingBoolean = {
  value: boolean
  defaultValue: boolean
  type: ClapperPluginSettingType.BOOLEAN
}
export type ClapperPluginSetting =
ClapperPluginSettingBase &
  (
    ClapperPluginSettingString |
    ClapperPluginSettingNumber |
    ClapperPluginSettingBoolean
  )

export type ClapperPluginSettings = ClapperPluginSetting[]

export type ClapperPluginMeta = {
  // a lowercase alphabetical name (letters and digits only)
  // used to uniquely identify the plugin
  id: string

  // a human-readable name
  label: string

  // a list of categories
  categories: ClapperPluginCategory[]

  // a list of settings for this plugin
  settings: ClapperPluginSetting[]

  // the purpose of the plugin
  description: string

  // semver of the plugin
  version: string

  licence: string
  author: string

  // project or company website
  website: string

  // direct URL to the .js file for fetch and injection
  assetUrl: string
}

export type BaseClapperPluginStore = {}

export type ClapperPluginService = UseBoundStore<StoreApi<BaseClapperPluginStore>>

export type ClapperPlugin = {
  meta: ClapperPluginMeta
  controller: ClapperPluginService
}
