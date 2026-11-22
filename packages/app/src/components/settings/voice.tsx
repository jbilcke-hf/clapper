import { useMemo } from 'react'
import { ClapWorkflow, ClapWorkflowCategory } from '@aitube/clap'

import { FormSection } from '@/components/forms'
import { useSettings } from '@/services/settings'
import { defaultWorkflowForVoice } from '@/services/settings/workflows/voice'
import { convertComfyUiWorkflowApiToClapWorkflow } from '@/app/api/resolve/providers/comfyui/convertComfyUiWorkflowApiToClapWorkflow'
import { FormComfyUIWorkflowSettings } from '../forms/FormComfyUIWorkflowSettings'

export function SettingsSectionVoice() {
  const comfyWorkflowForVoice = useSettings((s) => s.comfyWorkflowForVoice)
  const setComfyWorkflowForVoice = useSettings(
    (s) => s.setComfyWorkflowForVoice
  )

  const comfyClapWorkflow = useMemo(() => {
    if (
      comfyWorkflowForVoice &&
      comfyWorkflowForVoice.trim() &&
      comfyWorkflowForVoice.trim() !== '{}'
    ) {
      try {
        return convertComfyUiWorkflowApiToClapWorkflow(
          comfyWorkflowForVoice,
          ClapWorkflowCategory.VOICE_GENERATION
        )
      } catch {}
    }
    return defaultWorkflowForVoice
  }, [comfyWorkflowForVoice])

  const onChangeComfyUiWorkflow = (updated: ClapWorkflow) => {
    setComfyWorkflowForVoice(updated.data)
  }

  return (
    <div className="flex flex-col justify-between space-y-6">
      <FormSection label="Voice rendering">
        <FormComfyUIWorkflowSettings
          label="Custom ComfyUI workflow for voice"
          className="pt-4"
          clapWorkflow={comfyClapWorkflow}
          defaultClapWorkflow={defaultWorkflowForVoice}
          onChange={onChangeComfyUiWorkflow}
        />
      </FormSection>
    </div>
  )
}
