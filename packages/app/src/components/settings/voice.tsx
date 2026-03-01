import { FormSection } from '@/components/forms'
import { getDefaultSettingsState, useSettings } from '@/services/settings'
import { FormComfyUIWorkflowSettings } from '../forms/FormComfyUIWorkflowSettings'
import { ClapWorkflow } from '@aitube/clap'

export function SettingsSectionVoice() {
  const defaultSettings = getDefaultSettingsState()

  const comfyClapWorkflowForVoice = useSettings((s) => s.comfyClapWorkflowForVoice)
  const setComfyClapWorkflowForVoice = useSettings(
    (s) => s.setComfyClapWorkflowForVoice
  )

  const onChangeClapWorkflow = (clapWorkflowUpdated: ClapWorkflow) => {
    setComfyClapWorkflowForVoice(clapWorkflowUpdated)
  }

  return (
    <div className="flex flex-col justify-between space-y-6">
      <FormSection label="Voice rendering">
        <p className="text-xs italic text-white/50">
          Configure a ComfyUI workflow for voice/speech generation.
          Paste a ComfyUI API workflow JSON below, or use the workflow browser to find one.
        </p>
        <FormComfyUIWorkflowSettings
          label="Custom ComfyUI workflow for voice"
          className="pt-4"
          clapWorkflow={comfyClapWorkflowForVoice}
          defaultClapWorkflow={defaultSettings.comfyClapWorkflowForVoice}
          onChange={onChangeClapWorkflow}
        />
      </FormSection>
    </div>
  )
}
