import { useMemo } from 'react'
import { ClapWorkflow, ClapWorkflowCategory } from '@aitube/clap'

import { FormSection } from '@/components/forms'
import { useSettings } from '@/services/settings'
import { defaultWorkflowForSound } from '@/services/settings/workflows/sound'
import { convertComfyUiWorkflowApiToClapWorkflow } from '@/app/api/resolve/providers/comfyui/convertComfyUiWorkflowApiToClapWorkflow'
import { FormComfyUIWorkflowSettings } from '../forms/FormComfyUIWorkflowSettings'

export function SettingsSectionSound() {
  const comfyWorkflowForSound = useSettings((s) => s.comfyWorkflowForSound)
  const setComfyWorkflowForSound = useSettings(
    (s) => s.setComfyWorkflowForSound
  )

  const comfyClapWorkflow = useMemo(() => {
    if (
      comfyWorkflowForSound &&
      comfyWorkflowForSound.trim() &&
      comfyWorkflowForSound.trim() !== '{}'
    ) {
      try {
        return convertComfyUiWorkflowApiToClapWorkflow(
          comfyWorkflowForSound,
          ClapWorkflowCategory.SOUND_GENERATION
        )
      } catch {}
    }
    return defaultWorkflowForSound
  }, [comfyWorkflowForSound])

  const onChangeComfyUiWorkflow = (updated: ClapWorkflow) => {
    setComfyWorkflowForSound(updated.data)
  }

  return (
    <div className="flex flex-col justify-between space-y-6">
      <FormSection label="Sound rendering">
        <FormComfyUIWorkflowSettings
          label="Custom ComfyUI workflow for sound"
          className="pt-4"
          clapWorkflow={comfyClapWorkflow}
          defaultClapWorkflow={defaultWorkflowForSound}
          onChange={onChangeComfyUiWorkflow}
        />
      </FormSection>
    </div>
  )
}
