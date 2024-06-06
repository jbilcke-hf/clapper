import { FormSection } from "@/components/forms/FormSection"
import { getDefaultSettingsState, useSettings } from "@/controllers/settings"

import { FormInput } from "../forms/FormInput"
import { ComputeProvider } from "@/types"
import { availableComputeProvidersForStoryboards } from "./constants"
import { FormSelect } from "../forms/FormSelect"

export function SettingsSectionStoryboard() {
  const defaultSettings = getDefaultSettingsState()

  const storyboardProvider = useSettings(s => s.storyboardProvider)
  const setStoryboardProvider = useSettings(s => s.setStoryboardProvider)

  const huggingFaceModelForImage = useSettings(s => s.huggingFaceModelForImage)
  const setHuggingFaceModelForImage = useSettings(s => s.setHuggingFaceModelForImage)

  const replicateModelForImage = useSettings(s => s.replicateModelForImage)
  const setReplicateModelForImage = useSettings(s => s.setReplicateModelForImage)

  const falAiModelForImage = useSettings(s => s.falAiModelForImage)
  const setFalAiModelForImage = useSettings(s => s.setFalAiModelForImage)

  const modelsLabModelForImage = useSettings(s => s.modelsLabModelForImage)
  const setModelsLabModelForImage = useSettings(s => s.setModelsLabModelForImage)

  const maxStoryboardsToGenerateInParallel = useSettings(s => s.maxStoryboardsToGenerateInParallel)
  const setMaxStoryboardsToGenerateInParallel = useSettings(s => s.setMaxStoryboardsToGenerateInParallel)

  const comfyWorkflowForStoryboard = useSettings(s => s.comfyWorkflowForStoryboard)
  const setComfyWorkflowForStoryboard = useSettings(s => s.setComfyWorkflowForStoryboard)

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