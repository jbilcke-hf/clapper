import { FormSection } from '@/components/forms'
import { FormComfyUIWorkflowSettings } from '@/components/forms/FormComfyUIWorkflowSettings'
import { getDefaultSettingsState, useSettings } from '@/services/settings'

export function SettingsSectionMusic() {
  const defaultSettings = getDefaultSettingsState()

  const comfyClapWorkflowForMusic = useSettings(
    (s) => s.comfyClapWorkflowForMusic
  )
  const setComfyClapWorkflowForMusic = useSettings(
    (s) => s.setComfyClapWorkflowForMusic
  )

  return (
    <div className="flex flex-col justify-between space-y-6">
      <FormSection label="Music rendering">
        <FormComfyUIWorkflowSettings
          label="Custom ComfyUI workflow for music"
          className="mt-2"
          clapWorkflow={comfyClapWorkflowForMusic}
          defaultClapWorkflow={defaultSettings.comfyClapWorkflowForMusic}
          onChange={setComfyClapWorkflowForMusic}
        />
      </FormSection>
    </div>
  )
}
