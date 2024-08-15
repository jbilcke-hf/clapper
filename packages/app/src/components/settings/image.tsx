import { FormSection } from '@/components/forms/FormSection'
import { getDefaultSettingsState, useSettings } from '@/services/settings'

import { FormInput } from '../forms/FormInput'

export function SettingsSectionImage() {
  const defaultSettings = getDefaultSettingsState()

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

  return (
    <div className="flex flex-col justify-between space-y-6">
      <FormSection label="Image rendering">
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
      </FormSection>
    </div>
  )
}
