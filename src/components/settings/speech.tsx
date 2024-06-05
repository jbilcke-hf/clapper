import { FormSection } from "@/components/form/form-section"
import { getDefaultSettingsRendering, useSettingsRendering } from "@/settings/rendering"
import { ComputeProvider } from "@/types"

import { FormSelect } from "../form/form-select"
import { availableComputeProvidersForSpeech } from "./constants"
import { FormInput } from "../form/form-input"

export function SettingsSectionSpeech() {
  const defaultSettings = getDefaultSettingsRendering()
  
  const speechProvider = useSettingsRendering(s => s.speechProvider)
  const setSpeechProvider = useSettingsRendering(s => s.setSpeechProvider)

  const huggingFaceModelForSpeech = useSettingsRendering(s => s.huggingFaceModelForSpeech)
  const setHuggingFaceModelForSpeech = useSettingsRendering(s => s.setHuggingFaceModelForSpeech)

  const replicateModelForSpeech = useSettingsRendering(s => s.replicateModelForSpeech)
  const setReplicateModelForSpeech = useSettingsRendering(s => s.setReplicateModelForSpeech)

  const falAiModelForSpeech = useSettingsRendering(s => s.falAiModelForSpeech)
  const setFalAiModelForSpeech = useSettingsRendering(s => s.setFalAiModelForSpeech)

  const modelsLabModelForSpeech = useSettingsRendering(s => s.modelsLabModelForSpeech)
  const setModelsLabModelForSpeech = useSettingsRendering(s => s.setModelsLabModelForSpeech)

  const comfyWorkflowForSpeech = useSettingsRendering(s => s.comfyWorkflowForSpeech)
  const setComfyWorkflowForSpeech = useSettingsRendering(s => s.setComfyWorkflowForSpeech)

  return (
    <div className="flex flex-col space-y-6 justify-between">
      <FormSection label="Speech rendering">

        <FormSelect<ComputeProvider>
          label="Speech provider"
          selectedItemId={speechProvider}
          selectedItemLabel={
            (availableComputeProvidersForSpeech as any)[speechProvider]
            || ComputeProvider.NONE
          }
          items={Object.entries(availableComputeProvidersForSpeech).map(([provider, label]) => ({
            id: provider,
            label,
            disabled: false,
            value: provider as ComputeProvider,
          }))}
          onSelect={setSpeechProvider}
          horizontal
        />
     {speechProvider.startsWith("COMFY_")
         ? <FormInput
          label="Default Comfy workflow template for speech"
          value={comfyWorkflowForSpeech}
          defaultValue={defaultSettings.comfyWorkflowForSpeech}
          onChange={setComfyWorkflowForSpeech}
        />
        : // "proprietary" parameters
          <>
            {speechProvider === ComputeProvider.HUGGINGFACE && <FormInput
              label="HF Model ID (must be compatible with the Inference API)"
              value={huggingFaceModelForSpeech}
              defaultValue={defaultSettings.huggingFaceModelForSpeech}
              onChange={setHuggingFaceModelForSpeech}
            />}
            {speechProvider === ComputeProvider.REPLICATE && <FormInput
              label="Replicate.com model ID"
              value={replicateModelForSpeech}
              defaultValue={defaultSettings.replicateModelForSpeech}
              onChange={setReplicateModelForSpeech}
            />}
            {speechProvider === ComputeProvider.FALAI && <FormInput
              label="Fal.ai model ID"
              value={falAiModelForSpeech}
              defaultValue={defaultSettings.falAiModelForSpeech}
              onChange={setFalAiModelForSpeech}
            />}
            {speechProvider === ComputeProvider.MODELSLAB && <FormInput
              label="ModelsLab.com model ID"
              value={modelsLabModelForSpeech}
              defaultValue={defaultSettings.modelsLabModelForSpeech}
              onChange={setModelsLabModelForSpeech}
            />}
          </>}
      </FormSection>
    </div>
  )
}