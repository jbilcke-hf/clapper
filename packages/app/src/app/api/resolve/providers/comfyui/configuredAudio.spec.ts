// @vitest-environment jsdom
import { beforeEach, expect, it, vi } from 'vitest'
import { ClapWorkflowCategory } from '@aitube/clap'
import { readConfiguredComfyWorkflow } from './convertComfyUiWorkflowApiToClapWorkflow'
vi.hoisted(() => {
  const values = new Map<string, string>()
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => values.get(key) || null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
    },
  })
})

vi.mock('@aitube/timeline', () => ({
  parseRenderingStrategy: (value: unknown) => value,
  RenderingStrategy: {},
}))
vi.mock('@/lib/utils', () => ({
  getValidBoolean: (value: unknown) => value,
  getValidString: (value: unknown) => value,
}))
vi.mock('@/services/settings/getDefaultSettingsState', () => ({
  getDefaultSettingsState: () => ({
    comfyWorkflowForVoice: '{}',
    comfyWorkflowForSound: '{}',
    comfyWorkflowForMusic: '{}',
    voiceGenerationWorkflow: '',
    soundGenerationWorkflow: '',
    musicGenerationWorkflow: '',
  }),
}))
import { useSettings } from '@/services/settings/useSettings'
const raw = {
  '1': { class_type: 'Text', inputs: { text: 'old text' } },
  '2': { class_type: 'SaveAudio', inputs: { audio: ['1', 0] } },
}
beforeEach(() => {
  useSettings.setState({
    voiceGenerationWorkflow: '',
    soundGenerationWorkflow: '',
    musicGenerationWorkflow: '',
  })
})
it.each(['Voice', 'Sound', 'Music'] as const)(
  'updates the selected custom %s workflow with edited input mappings',
  (name) => {
    const category =
      ClapWorkflowCategory[
        `${name.toUpperCase()}_GENERATION` as keyof typeof ClapWorkflowCategory
      ]
    const workflow = readConfiguredComfyWorkflow(JSON.stringify(raw), category)!
    const field =
      `${name.toLowerCase()}GenerationWorkflow` as 'voiceGenerationWorkflow'
    useSettings.setState({ [field]: JSON.stringify(workflow) })
    workflow.inputValues['@clapper/prompt'] = {
      id: '@clapper/null',
      label: 'Unset',
    }
    workflow.data = workflow.data.replace('old text', 'new text')
    useSettings
      .getState()
      [`setComfyWorkflowFor${name}`](JSON.stringify(workflow))
    const selected = JSON.parse(useSettings.getState()[field])
    expect(selected.inputValues['@clapper/prompt'].id).toBe('@clapper/null')
    expect(JSON.parse(selected.data)['1'].inputs.text).toBe('new text')
  }
)
it('keeps an unrelated selected provider when editing local ComfyUI settings', () => {
  const other = JSON.stringify({ id: 'other://provider' })
  useSettings.setState({ voiceGenerationWorkflow: other })
  useSettings.getState().setComfyWorkflowForVoice(JSON.stringify(raw))
  expect(useSettings.getState().voiceGenerationWorkflow).toBe(other)
})
it('clears a selected custom workflow when its settings are cleared', () => {
  const workflow = readConfiguredComfyWorkflow(
    JSON.stringify(raw),
    ClapWorkflowCategory.VOICE_GENERATION
  )!
  useSettings.setState({ voiceGenerationWorkflow: JSON.stringify(workflow) })
  useSettings.getState().setComfyWorkflowForVoice('{}')
  expect(useSettings.getState().voiceGenerationWorkflow).toBe('')
})
