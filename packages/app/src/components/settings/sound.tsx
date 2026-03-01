import { FormSection } from '@/components/forms'
import { getDefaultSettingsState, useSettings } from '@/services/settings'
import { FormComfyUIWorkflowSettings } from '../forms/FormComfyUIWorkflowSettings'
import { ClapWorkflow } from '@aitube/clap'

export function SettingsSectionSound() {
  const defaultSettings = getDefaultSettingsState()

  const comfyClapWorkflowForSound = useSettings((s) => s.comfyClapWorkflowForSound)
  const setComfyClapWorkflowForSound = useSettings(
    (s) => s.setComfyClapWorkflowForSound
  )

  const onChangeClapWorkflow = (clapWorkflowUpdated: ClapWorkflow) => {
    setComfyClapWorkflowForSound(clapWorkflowUpdated)
  }

  return (
    <div className="flex flex-col justify-between space-y-6">
      <FormSection label="Sound rendering">
        <p className="text-xs italic text-white/50">
          Configure a ComfyUI workflow for sound effects generation.
          Paste a ComfyUI API workflow JSON below, or use the workflow browser to find one.
        </p>
        <FormComfyUIWorkflowSettings
          label="Custom ComfyUI workflow for sound"
          className="pt-4"
          clapWorkflow={comfyClapWorkflowForSound}
          defaultClapWorkflow={defaultSettings.comfyClapWorkflowForSound}
          onChange={onChangeClapWorkflow}
        />
      </FormSection>
    </div>
  )
}
