import { ClapTimelineTheme } from "@aitube/timeline"
import { SettingsCategory } from "./base-types"
import { ProjectCreationWizardStep } from "./types"


export type UIThemeName = "lavender" | "backstage" | "midnight" | "mythril" | "flix" | "lore" | "mocha" | string

/**
 * TODO:
 * 
 * - more colors for Monaco editor
 * 
 * - change shadcn/ui colors
 * 
 * - timeline CSS filter is a quick hack to get a hue,
 *   instead (or in addition to it) we could pass color parameters
 * 
 * - handle light and dark themes
 * 
 */
export type UITheme = {
  id: UIThemeName
  label: string
  author: string
  description: string
  defaultBgColor?: string
  defaultTextColor?: string
  defaultPrimaryColor?: string
  defaultBorderColor?: string
  logoColor?: string
  editorBgColor?: string
  editorCursorColor?: string
  editorTextColor?: string
  editorMenuBgColor?: string
  editorMenuTextColor?: string
  editorBorderColor?: string

  // background color of the video preview monitor
  monitorBgColor?: string

  // text of the elapsed/total duration counter in the video preview monitor
  monitorSecondaryTextColor?: string
  monitorPrimaryTextColor?: string

  assistantBgColor?: string
  assistantUserBgColor?: string
  assistantRobotBgColor?: string
  assistantUserTextColor?: string
  assistantRobotTextColor?: string

  timeline: ClapTimelineTheme
}

export type UIState = {
  showWelcomeScreen: boolean
  hasBetaAccess: boolean
  themeName: UIThemeName
  showApiKeys: boolean
  showSettings: SettingsCategory
  showImporter: boolean
  showTimeline: boolean
  showExplorer: boolean
  showVideoPlayer: boolean
  showAssistant: boolean
  showFPS: boolean
  followCursor: boolean
  editorFontSize: number

  projectCreationWizardStep: ProjectCreationWizardStep
}

export type UIControls = {
  setShowWelcomeScreen: (showWelcomeScreen: boolean) => void
  setHasBetaAccess: (hasBetaAccess: boolean) => void
  setThemeName: (themeName: UIThemeName) => void
  applyThemeToComponents: () => void
  getTheme: () => UITheme
  setShowApiKeys: (showApiKeys: boolean) => void
  setShowSettings: (showSettings: SettingsCategory) => void
  setShowImporter: (showImporter: boolean) => void
  setShowTimeline: (showTimeline: boolean) => void
  setShowExplorer: (showExplorer: boolean) => void
  setShowVideoPlayer: (showVideoPlayer: boolean) => void
  setShowAssistant: (showAssistant: boolean) => void
  setShowFPS: (showFPS: boolean) => void
  setFollowCursor: (followCursor: boolean) => void
  setEditorFontSize: (editorFontSize: number) => void
  setProjectCreationWizardStep: (projectCreationWizardStep: ProjectCreationWizardStep) => void
}

export type UIStore =
  UIState &
  UIControls