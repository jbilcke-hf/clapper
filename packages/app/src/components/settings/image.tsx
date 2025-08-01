import { FormInput, FormSection, FormSwitch } from '@/components/forms'
import { getDefaultSettingsState, useSettings } from '@/services/settings'
import { FormComfyUIWorkflowSettings } from '../forms/FormComfyUIWorkflowSettings'
import { ClapWorkflow } from '@aitube/clap'

export function SettingsSectionImage() {
  const defaultSettings = getDefaultSettingsState()
  const comfyClapWorkflow = useSettings((s) => s.comfyClapWorkflowForImage)
  const setComfyClapWorkflow = useSettings(
    (s) => s.setComfyClapWorkflowForImage
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
  const onChangeComfyUiWorkflow = (clapWorkflowUpdated: ClapWorkflow) => {
    setComfyClapWorkflow(clapWorkflowUpdated)
  }

  return (
    <div className="flex flex-col justify-between space-y-6">
      <FormSection label="Image rendering">
        <FormSwitch
          label="Hide NFAA content (not for all audiences)"
          checked={!censorNotForAllAudiencesContent}
          onCheckedChange={setCensorNotForAllAudiencesContent}
        />
        <p className="text-xs text-white/50 italic">
          Note: API providers each have their own policies regarding NFAA.
          Don&apos;t use Clapper for illegal purposes.
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

        <FormComfyUIWorkflowSettings
          label="Custom ComfyUI workflow for images"
          className="pt-4"
          clapWorkflow={comfyClapWorkflow}
          defaultClapWorkflow={defaultSettings.comfyClapWorkflowForImage}
          onChange={onChangeComfyUiWorkflow}
        />
      </FormSection>
    </div>
  )
}
