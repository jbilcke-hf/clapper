import { FormSection } from '@/components/forms'
import { FormComfyUIWorkflowSettings } from '@/components/forms/FormComfyUIWorkflowSettings'
import { getDefaultSettingsState, useSettings } from '@/services/settings'

export function SettingsSectionVoice() {
  const defaultSettings = getDefaultSettingsState()

  const comfyClapWorkflowForVoice = useSettings(
    (s) => s.comfyClapWorkflowForVoice
  )
  const setComfyClapWorkflowForVoice = useSettings(
    (s) => s.setComfyClapWorkflowForVoice
  )

  return (
    <div className="flex flex-col justify-between space-y-6">
      <FormSection label="Voice rendering">
        <FormComfyUIWorkflowSettings
          label="Custom ComfyUI workflow for voice"
          className="mt-2"
          clapWorkflow={comfyClapWorkflowForVoice}
          defaultClapWorkflow={defaultSettings.comfyClapWorkflowForVoice}
          onChange={setComfyClapWorkflowForVoice}
        />
      </FormSection>
    </div>
  )
}
