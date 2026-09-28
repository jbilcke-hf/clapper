import { useMemo } from 'react'
import {
  ClapWorkflowCategory,
  ClapWorkflowEngine,
  ClapWorkflowProvider,
  ClapWorkflow,
} from '@aitube/clap'
import { FormSection } from '@/components/forms'
import { FormComfyUIWorkflowSettings } from '@/components/forms/FormComfyUIWorkflowSettings'
import { useSettings } from '@/services/settings'
import { readConfiguredComfyWorkflow } from '@/app/api/resolve/providers/comfyui/convertComfyUiWorkflowApiToClapWorkflow'

export function SettingsSectionVoice() {
  const value = useSettings((s) => s.comfyWorkflowForVoice)
  const setValue = useSettings((s) => s.setComfyWorkflowForVoice)
  const workflow = useMemo(
    () =>
      readConfiguredComfyWorkflow(
        value,
        ClapWorkflowCategory.VOICE_GENERATION
      ) ||
      ({
        id: 'comfyui://settings.comfyWorkflowForVoice',
        label: 'Custom Voice Workflow',
        description: '',
        tags: [],
        author: 'You',
        thumbnailUrl: '',
        nonCommercial: false,
        engine: ClapWorkflowEngine.COMFYUI_WORKFLOW,
        provider: ClapWorkflowProvider.COMFYUI,
        category: ClapWorkflowCategory.VOICE_GENERATION,
        data: '{}',
        schema: '',
        inputFields: [],
        inputValues: {},
      } satisfies ClapWorkflow),
    [value]
  )
  return (
    <FormSection label="Voice rendering">
      <FormComfyUIWorkflowSettings
        label="Custom ComfyUI workflow for voice"
        clapWorkflow={workflow}
        defaultClapWorkflow={workflow}
        className="mt-4"
        onChange={(updated) => setValue(JSON.stringify(updated))}
      />
    </FormSection>
  )
}
