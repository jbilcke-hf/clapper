import { useMemo } from 'react'
import { ClapWorkflow, ClapWorkflowCategory } from '@aitube/clap'

import { FormSection } from '@/components/forms'
import { useSettings } from '@/services/settings'
import { defaultWorkflowForMusic } from '@/services/settings/workflows/music'
import { convertComfyUiWorkflowApiToClapWorkflow } from '@/app/api/resolve/providers/comfyui/convertComfyUiWorkflowApiToClapWorkflow'
import { FormComfyUIWorkflowSettings } from '../forms/FormComfyUIWorkflowSettings'

export function SettingsSectionMusic() {
  const comfyWorkflowForMusic = useSettings((s) => s.comfyWorkflowForMusic)
  const setComfyWorkflowForMusic = useSettings(
    (s) => s.setComfyWorkflowForMusic
  )

  const comfyClapWorkflow = useMemo(() => {
    if (
      comfyWorkflowForMusic &&
      comfyWorkflowForMusic.trim() &&
      comfyWorkflowForMusic.trim() !== '{}'
    ) {
      try {
        return convertComfyUiWorkflowApiToClapWorkflow(
          comfyWorkflowForMusic,
          ClapWorkflowCategory.MUSIC_GENERATION
        )
      } catch {}
    }
    return defaultWorkflowForMusic
  }, [comfyWorkflowForMusic])

  const onChangeComfyUiWorkflow = (updated: ClapWorkflow) => {
    setComfyWorkflowForMusic(updated.data)
  }

  return (
    <div className="flex flex-col justify-between space-y-6">
      <FormSection label="Music rendering">
        <FormComfyUIWorkflowSettings
          label="Custom ComfyUI workflow for music"
          className="pt-4"
          clapWorkflow={comfyClapWorkflow}
          defaultClapWorkflow={defaultWorkflowForMusic}
          onChange={onChangeComfyUiWorkflow}
        />
      </FormSection>
    </div>
  )
}
