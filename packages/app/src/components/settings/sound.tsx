import { FormSection } from '@/components/forms'
import { FormComfyUIWorkflowSettings } from '@/components/forms/FormComfyUIWorkflowSettings'
import { getDefaultSettingsState, useSettings } from '@/services/settings'

export function SettingsSectionSound() {
  const defaultSettings = getDefaultSettingsState()

  const comfyClapWorkflowForSound = useSettings(
    (s) => s.comfyClapWorkflowForSound
  )
  const setComfyClapWorkflowForSound = useSettings(
    (s) => s.setComfyClapWorkflowForSound
  )

  return (
    <div className="flex flex-col justify-between space-y-6">
      <FormSection label="Sound rendering">
        <FormComfyUIWorkflowSettings
          label="Custom ComfyUI workflow for sound"
          className="mt-2"
          clapWorkflow={comfyClapWorkflowForSound}
          defaultClapWorkflow={defaultSettings.comfyClapWorkflowForSound}
          onChange={setComfyClapWorkflowForSound}
        />
      </FormSection>
    </div>
  )
}
