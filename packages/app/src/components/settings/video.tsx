import { FormInput, FormSection } from '@/components/forms'
import { getDefaultSettingsState, useSettings } from '@/services/settings'
import { FormComfyUIWorkflowSettings } from '../forms/FormComfyUIWorkflowSettings'
import { ClapWorkflow, ClapWorkflowCategory } from '@aitube/clap'

export function SettingsSectionVideo() {
  const defaultSettings = getDefaultSettingsState()
  const comfyClapWorkflow = useSettings((s) => s.comfyClapWorkflowForVideo)
  const setComfyWorkflowForVideo = useSettings(
    (s) => s.setComfyClapWorkflowForVideo
  )

  const videoPromptPrefix = useSettings((s) => s.videoPromptPrefix)
  const setVideoPromptPrefix = useSettings((s) => s.setVideoPromptPrefix)

  const videoPromptSuffix = useSettings((s) => s.videoPromptSuffix)
  const setVideoPromptSuffix = useSettings((s) => s.setVideoPromptSuffix)

  const videoNegativePrompt = useSettings((s) => s.videoNegativePrompt)
  const setVideoNegativePrompt = useSettings((s) => s.setVideoNegativePrompt)

  const maxVideosToGenerateInParallel = useSettings(
    (s) => s.maxVideosToGenerateInParallel
  )
  const setMaxVideosToGenerateInParallel = useSettings(
    (s) => s.setMaxVideosToGenerateInParallel
  )

  const onChangeClapWorkflow = (clapWorkflowUpdated: ClapWorkflow) => {
    setComfyWorkflowForVideo(clapWorkflowUpdated)
  }

  return (
    <div className="flex flex-col justify-between space-y-6">
      <FormSection label="Video rendering">
        <FormInput
          label="Number of videos to render in parallel"
          value={maxVideosToGenerateInParallel}
          defaultValue={defaultSettings.maxVideosToGenerateInParallel}
          onChange={setMaxVideosToGenerateInParallel}
        />

        <FormInput
          label="Default prompt prefix"
          value={videoPromptPrefix}
          defaultValue={defaultSettings.videoPromptPrefix}
          onChange={setVideoPromptPrefix}
        />

        <FormInput
          label="Default prompt suffix"
          value={videoPromptSuffix}
          defaultValue={defaultSettings.videoPromptSuffix}
          onChange={setVideoPromptSuffix}
        />

        <FormInput
          label="Default negative prompt"
          value={videoNegativePrompt}
          defaultValue={defaultSettings.videoNegativePrompt}
          onChange={setVideoNegativePrompt}
        />

        <FormComfyUIWorkflowSettings
          label="Custom ComfyUI workflow for video"
          className="pt-4"
          clapWorkflow={comfyClapWorkflow}
          defaultClapWorkflow={defaultSettings.comfyClapWorkflowForVideo}
          onChange={onChangeClapWorkflow}
        />
      </FormSection>
    </div>
  )
}
