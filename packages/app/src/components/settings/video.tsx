import { FormArea, FormInput, FormSection } from '@/components/forms'
import { getDefaultSettingsState, useSettings } from '@/services/settings'

export function SettingsSectionVideo() {
  const defaultSettings = getDefaultSettingsState()

  const comfyWorkflowForVideo = useSettings((s) => s.comfyWorkflowForVideo)
  const setComfyWorkflowForVideo = useSettings(
    (s) => s.setComfyWorkflowForVideo
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

        <FormArea
          label="Custom ComfyUI workflow for video"
          value={comfyWorkflowForVideo}
          defaultValue={defaultSettings.comfyWorkflowForVideo}
          onChange={setComfyWorkflowForVideo}
          rows={8}
        />
      </FormSection>
    </div>
  )
}
