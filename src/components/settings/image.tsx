import { FormSection } from "@/components/forms/FormSection"
import { getDefaultSettingsState, useSettings } from "@/services/settings"

import { FormInput } from "../forms/FormInput"
import { ComputeProvider } from "@/types"
import { availableComputeProvidersForImages, computeProviderShortNames } from "./constants"
import { FormSelect } from "../forms/FormSelect"

export function SettingsSectionImage() {
  const defaultSettings = getDefaultSettingsState()

  const imageProvider = useSettings(s => s.imageProvider)
  const setImageProvider = useSettings(s => s.setImageProvider)

  /*
  to deprecate I think - or replace by defaultHuggingFaceModelForXXXX
  const huggingFaceModelForImage = useSettings(s => s.huggingFaceModelForImage)
  const setHuggingFaceModelForImage = useSettings(s => s.setHuggingFaceModelForImage)

  const replicateModelForImage = useSettings(s => s.replicateModelForImage)
  const setReplicateModelForImage = useSettings(s => s.setReplicateModelForImage)

  const falAiModelForImage = useSettings(s => s.falAiModelForImage)
  const setFalAiModelForImage = useSettings(s => s.setFalAiModelForImage)

  const modelsLabModelForImage = useSettings(s => s.modelsLabModelForImage)
  const setModelsLabModelForImage = useSettings(s => s.setModelsLabModelForImage)
  */

  const imagePromptPrefix = useSettings(s => s.imagePromptPrefix)
  const setImagePromptPrefix = useSettings(s => s.setImagePromptPrefix)

  const imagePromptSuffix = useSettings(s => s.imagePromptSuffix)
  const setImagePromptSuffix = useSettings(s => s.setImagePromptSuffix)

  const imageNegativePrompt = useSettings(s => s.imageNegativePrompt)
  const setImageNegativePrompt = useSettings(s => s.setImageNegativePrompt)

  const maxImagesToGenerateInParallel = useSettings(s => s.maxImagesToGenerateInParallel)
  const setMaxImagesToGenerateInParallel = useSettings(s => s.setMaxImagesToGenerateInParallel)

  const comfyWorkflowForImage = useSettings(s => s.comfyWorkflowForImage)
  const setComfyWorkflowForImage = useSettings(s => s.setComfyWorkflowForImage)

  return (
    <div className="flex flex-col space-y-6 justify-between">
      <FormSection label="Image rendering">
   

        <FormSelect<ComputeProvider>
          label="Image provider"
          selectedItemId={imageProvider}
          selectedItemLabel={
            computeProviderShortNames[imageProvider]
            || ComputeProvider.NONE
          }
          items={availableComputeProvidersForImages.map(provider => ({
            id: provider,
            label: computeProviderShortNames[provider] || "(missing name)",
            disabled: false,
            value: provider,
          }))}
          onSelect={setImageProvider}
          horizontal
        />

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

        {imageProvider.startsWith("COMFY_")
         ? <>
          <FormInput
            label="Default Comfy workflow template for images"
            value={comfyWorkflowForImage}
            defaultValue={defaultSettings.comfyWorkflowForImage}
            onChange={setComfyWorkflowForImage}
          />

         </>
        : // "proprietary" parameters
          null/*
          <>
            {imageProvider === ComputeProvider.HUGGINGFACE && <FormInput
              label="HF Model ID (must be compatible with the Inference API)"
              value={huggingFaceModelForImage}
              defaultValue={defaultSettings.huggingFaceModelForImage}
              onChange={setHuggingFaceModelForImage}
            />}
            {imageProvider === ComputeProvider.REPLICATE && <FormInput
              label="Replicate.com model ID"
              value={replicateModelForImage}
              defaultValue={defaultSettings.replicateModelForImage}
              onChange={setReplicateModelForImage}
            />}
            {imageProvider === ComputeProvider.FALAI && <FormInput
              label="Fal.ai model ID"
              value={falAiModelForImage}
              defaultValue={defaultSettings.falAiModelForImage}
              onChange={setFalAiModelForImage}
            />}
            {imageProvider === ComputeProvider.MODELSLAB && <FormInput
              label="ModelsLab.com model ID"
              value={modelsLabModelForImage}
              defaultValue={defaultSettings.modelsLabModelForImage}
              onChange={setModelsLabModelForImage}
            />}
          </>
          */
          }

      </FormSection>
    </div>
  )
}