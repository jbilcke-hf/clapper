import {
  FormArea,
  FormInput,
  FormSection,
  FormSwitch,
} from '@/components/forms'
import { getDefaultSettingsState, useSettings } from '@/services/settings'

export function SettingsSectionImage() {
  const defaultSettings = getDefaultSettingsState()

  const comfyWorkflowForImage = useSettings((s) => s.comfyWorkflowForImage)
  const setComfyWorkflowForImage = useSettings(
    (s) => s.setComfyWorkflowForImage
  )

  const imagePromptPrefix = useSettings((s) => s.imagePromptPrefix)
  const setImagePromptPrefix = useSettings((s) => s.setImagePromptPrefix)

  const imagePromptSuffix = useSettings((s) => s.imagePromptSuffix)
  const setImagePromptSuffix = useSettings((s) => s.setImagePromptSuffix)

  const imageNegativePrompt = useSettings((s) => s.imageNegativePrompt)
  const setImageNegativePrompt = useSettings((s) => s.setImageNegativePrompt)

  const maxImagesToGenerateInParallel = useSettings(
    (s) => s.maxImagesToGenerateInParallel
  )
  const setMaxImagesToGenerateInParallel = useSettings(
    (s) => s.setMaxImagesToGenerateInParallel
  )

  const censorNotForAllAudiencesContent = useSettings(
    (s) => s.censorNotForAllAudiencesContent
  )
  const setCensorNotForAllAudiencesContent = useSettings(
    (s) => s.setCensorNotForAllAudiencesContent
  )

  return (
    <div className="flex flex-col justify-between space-y-6">
      <FormSection label="Image rendering">
        <FormSwitch
          label="Hide NFAA content (not for all audiences)"
          checked={!censorNotForAllAudiencesContent}
          onCheckedChange={setCensorNotForAllAudiencesContent}
        />
        <p>
          Note: the request will be sent to the compute providers, which may or
          may not censor the output.
        </p>

        <FormInput
          label="Number of images to render in parallel (not used yet)"
          value={maxImagesToGenerateInParallel}
          defaultValue={defaultSettings.maxImagesToGenerateInParallel}
          onChange={setMaxImagesToGenerateInParallel}
        />

        <FormInput
          label="Default prompt prefix"
          value={imagePromptPrefix}
          defaultValue={defaultSettings.imagePromptPrefix}
          onChange={setImagePromptPrefix}
        />

        <FormInput
          label="Default prompt suffix"
          value={imagePromptSuffix}
          defaultValue={defaultSettings.imagePromptSuffix}
          onChange={setImagePromptSuffix}
        />

        <FormInput
          label="Default negative prompt"
          value={imageNegativePrompt}
          defaultValue={defaultSettings.imageNegativePrompt}
          onChange={setImageNegativePrompt}
        />

        <FormArea
          label="Custom ComfyUI workflow for images"
          value={comfyWorkflowForImage}
          defaultValue={defaultSettings.comfyWorkflowForImage}
          onChange={setComfyWorkflowForImage}
          rows={8}
        />
      </FormSection>
    </div>
  )
}
