import { FormArea, FormSection } from '@/components/forms'
import { getDefaultSettingsState, useSettings } from '@/services/settings'

export function SettingsSectionVoice() {
  const defaultSettings = getDefaultSettingsState()

  const comfyWorkflowForVoice = useSettings((s) => s.comfyWorkflowForVoice)
  const setComfyWorkflowForVoice = useSettings(
    (s) => s.setComfyWorkflowForVoice
  )

  return (
    <div className="flex flex-col justify-between space-y-6">
      <FormSection label="Voice rendering">
        <FormArea
          label="Custom ComfyUI workflows for voice"
          value={comfyWorkflowForVoice}
          defaultValue={defaultSettings.comfyWorkflowForVoice}
          onChange={setComfyWorkflowForVoice}
          rows={8}
        />
      </FormSection>
    </div>
  )
}
