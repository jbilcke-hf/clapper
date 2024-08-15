import {
  ProjectCreationWizardStep,
  SettingsCategory,
  UIState,
  UIWindowLayout,
} from '@aitube/clapper-services'

export function getDefaultUIState(): UIState {
  const state: UIState = {
    isTopMenuOpen: false,
    showWelcomeScreen: true,
    hasBetaAccess: false,
    themeName: 'backstage',
    showApiKeys: false,
    showSettings: SettingsCategory.NONE,
    showImporter: false,
    showTimeline: true,
    showExplorer: false,
    showVideoPlayer: true,
    showAssistant: false,
    showFPS: false,
    followCursor: false,
    editorFontSize: 12,
    windowLayout: UIWindowLayout.GRID,
    projectCreationWizardStep: ProjectCreationWizardStep.NONE,
  }

  return state
}
