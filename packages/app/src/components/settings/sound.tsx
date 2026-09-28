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

export function SettingsSectionSound() {
  const value = useSettings((s) => s.comfyWorkflowForSound)
  const setValue = useSettings((s) => s.setComfyWorkflowForSound)
  const workflow = useMemo(
    () =>
      readConfiguredComfyWorkflow(
        value,
        ClapWorkflowCategory.SOUND_GENERATION
      ) ||
      ({
        id: 'comfyui://settings.comfyWorkflowForSound',
        label: 'Custom Sound Workflow',
        description: '',
        tags: [],
        author: 'You',
        thumbnailUrl: '',
        nonCommercial: false,
        engine: ClapWorkflowEngine.COMFYUI_WORKFLOW,
        provider: ClapWorkflowProvider.COMFYUI,
        category: ClapWorkflowCategory.SOUND_GENERATION,
        data: '{}',
        schema: '',
        inputFields: [],
        inputValues: {},
      } satisfies ClapWorkflow),
    [value]
  )
  return (
    <FormSection label="Sound rendering">
      <FormComfyUIWorkflowSettings
        label="Custom ComfyUI workflow for sound"
        clapWorkflow={workflow}
        defaultClapWorkflow={workflow}
        className="mt-4"
        onChange={(updated) => setValue(JSON.stringify(updated))}
      />
    </FormSection>
  )
}
