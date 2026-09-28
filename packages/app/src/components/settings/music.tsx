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

export function SettingsSectionMusic() {
  const value = useSettings((s) => s.comfyWorkflowForMusic)
  const setValue = useSettings((s) => s.setComfyWorkflowForMusic)
  const workflow = useMemo(
    () =>
      readConfiguredComfyWorkflow(
        value,
        ClapWorkflowCategory.MUSIC_GENERATION
      ) ||
      ({
        id: 'comfyui://settings.comfyWorkflowForMusic',
        label: 'Custom Music Workflow',
        description: '',
        tags: [],
        author: 'You',
        thumbnailUrl: '',
        nonCommercial: false,
        engine: ClapWorkflowEngine.COMFYUI_WORKFLOW,
        provider: ClapWorkflowProvider.COMFYUI,
        category: ClapWorkflowCategory.MUSIC_GENERATION,
        data: '{}',
        schema: '',
        inputFields: [],
        inputValues: {},
      } satisfies ClapWorkflow),
    [value]
  )
  return (
    <FormSection label="Music rendering">
      <FormComfyUIWorkflowSettings
        label="Custom ComfyUI workflow for music"
        clapWorkflow={workflow}
        defaultClapWorkflow={workflow}
        className="mt-4"
        onChange={(updated) => setValue(JSON.stringify(updated))}
      />
    </FormSection>
  )
}
