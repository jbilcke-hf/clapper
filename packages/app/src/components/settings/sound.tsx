import { FormArea, FormSection } from '@/components/forms'
import { getDefaultSettingsState, useSettings } from '@/services/settings'

export function SettingsSectionSound() {
  const defaultSettings = getDefaultSettingsState()

  const comfyWorkflowForSound = useSettings((s) => s.comfyWorkflowForSound)
  const setComfyWorkflowForSound = useSettings(
    (s) => s.setComfyWorkflowForSound
  )

  return (
    <div className="flex flex-col justify-between space-y-6">
      <FormSection label="Sound rendering">
        <FormArea
          label="Custom ComfyUI workflows for sound"
          value={comfyWorkflowForSound}
          defaultValue={defaultSettings.comfyWorkflowForSound}
          onChange={setComfyWorkflowForSound}
          rows={8}
        />
      </FormSection>
    </div>
  )
}
