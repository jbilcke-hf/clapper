import { FormSection } from '@/components/forms'
import { getDefaultSettingsState, useSettings } from '@/services/settings'
import { FormComfyUIWorkflowSettings } from '../forms/FormComfyUIWorkflowSettings'
import { ClapWorkflow } from '@aitube/clap'

export function SettingsSectionMusic() {
  const defaultSettings = getDefaultSettingsState()

  const comfyClapWorkflowForMusic = useSettings((s) => s.comfyClapWorkflowForMusic)
  const setComfyClapWorkflowForMusic = useSettings(
    (s) => s.setComfyClapWorkflowForMusic
  )

  const onChangeClapWorkflow = (clapWorkflowUpdated: ClapWorkflow) => {
    setComfyClapWorkflowForMusic(clapWorkflowUpdated)
  }

  return (
    <div className="flex flex-col justify-between space-y-6">
      <FormSection label="Music rendering">
        <p className="text-xs italic text-white/50">
          Configure a ComfyUI workflow for music generation.
          Paste a ComfyUI API workflow JSON below, or use the workflow browser to find one.
        </p>
        <FormComfyUIWorkflowSettings
          label="Custom ComfyUI workflow for music"
          className="pt-4"
          clapWorkflow={comfyClapWorkflowForMusic}
          defaultClapWorkflow={defaultSettings.comfyClapWorkflowForMusic}
          onChange={onChangeClapWorkflow}
        />
      </FormSection>
    </div>
  )
}
