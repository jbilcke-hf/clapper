import { FormSection } from "@/components/form/form-section"
import { getDefaultSettingsRendering, useSettingsRendering } from "@/settings/rendering"

import { FormInput } from "../form/form-input"
import { ComputeProvider } from "@/types"
import { availableComputeProvidersForStoryboards } from "./constants"
import { FormSelect } from "../form/form-select"

export function SettingsSectionStoryboard() {
  const defaultSettings = getDefaultSettingsRendering()

  const storyboardProvider = useSettingsRendering(s => s.storyboardProvider)
  const setStoryboardProvider = useSettingsRendering(s => s.setStoryboardProvider)

  const huggingFaceModelForImage = useSettingsRendering(s => s.huggingFaceModelForImage)
  const setHuggingFaceModelForImage = useSettingsRendering(s => s.setHuggingFaceModelForImage)

  const replicateModelForImage = useSettingsRendering(s => s.replicateModelForImage)
  const setReplicateModelForImage = useSettingsRendering(s => s.setReplicateModelForImage)

  const falAiModelForImage = useSettingsRendering(s => s.falAiModelForImage)
  const setFalAiModelForImage = useSettingsRendering(s => s.setFalAiModelForImage)

  const modelsLabModelForImage = useSettingsRendering(s => s.modelsLabModelForImage)
  const setModelsLabModelForImage = useSettingsRendering(s => s.setModelsLabModelForImage)

  const maxStoryboardsToGenerateInParallel = useSettingsRendering(s => s.maxStoryboardsToGenerateInParallel)
  const setMaxStoryboardsToGenerateInParallel = useSettingsRendering(s => s.setMaxStoryboardsToGenerateInParallel)

  const comfyWorkflowForStoryboard = useSettingsRendering(s => s.comfyWorkflowForStoryboard)
  const setComfyWorkflowForStoryboard = useSettingsRendering(s => s.setComfyWorkflowForStoryboard)

  return (
    <div className="flex flex-col space-y-6 justify-between">
      <FormSection label="Storyboard rendering">
   
        <FormSelect<ComputeProvider>
          label="Storyboard provider"
          selectedItemId={storyboardProvider}
          selectedItemLabel={
            (availableComputeProvidersForStoryboards as any)[storyboardProvider]
            || ComputeProvider.NONE
          }
          items={Object.entries(availableComputeProvidersForStoryboards).map(([provider, label]) => ({
            id: provider,
            label,
            disabled: false,
            value: provider as ComputeProvider,
          }))}
          onSelect={setStoryboardProvider}
          horizontal
        />

        <FormInput
          label="Number of storyboards to render in parallel"
          value={maxStoryboardsToGenerateInParallel}
          defaultValue={defaultSettings.maxStoryboardsToGenerateInParallel}
          onChange={setMaxStoryboardsToGenerateInParallel}
        />
        
        {storyboardProvider.startsWith("COMFY_")
         ? <FormInput
          label="Default Comfy workflow template for storyboards"
          value={comfyWorkflowForStoryboard}
          defaultValue={defaultSettings.comfyWorkflowForStoryboard}
          onChange={setComfyWorkflowForStoryboard}
        />
        : // "proprietary" parameters
          <>
            {storyboardProvider === ComputeProvider.HUGGINGFACE && <FormInput
              label="HF Model ID (must be compatible with the Inference API)"
              value={huggingFaceModelForImage}
              defaultValue={defaultSettings.huggingFaceModelForImage}
              onChange={setHuggingFaceModelForImage}
            />}
            {storyboardProvider === ComputeProvider.REPLICATE && <FormInput
              label="Replicate.com model ID"
              value={replicateModelForImage}
              defaultValue={defaultSettings.replicateModelForImage}
              onChange={setReplicateModelForImage}
            />}
            {storyboardProvider === ComputeProvider.FALAI && <FormInput
              label="Fal.ai model ID"
              value={falAiModelForImage}
              defaultValue={defaultSettings.falAiModelForImage}
              onChange={setFalAiModelForImage}
            />}
            {storyboardProvider === ComputeProvider.MODELSLAB && <FormInput
              label="ModelsLab.com model ID"
              value={modelsLabModelForImage}
              defaultValue={defaultSettings.modelsLabModelForImage}
              onChange={setModelsLabModelForImage}
            />}
          </>}

      </FormSection>
    </div>
  )
}