import { FormSection } from "@/components/forms/FormSection"
import { getDefaultSettingsState, useSettings } from "@/controllers/settings"
import { ComputeProvider } from "@/types"

import { FormSelect } from "../forms/FormSelect"
import { availableComputeProvidersForSpeech } from "./constants"
import { FormInput } from "../forms/FormInput"

export function SettingsSectionSpeech() {
  const defaultSettings = getDefaultSettingsState()
  
  const speechProvider = useSettings(s => s.speechProvider)
  const setSpeechProvider = useSettings(s => s.setSpeechProvider)

  const huggingFaceModelForSpeech = useSettings(s => s.huggingFaceModelForSpeech)
  const setHuggingFaceModelForSpeech = useSettings(s => s.setHuggingFaceModelForSpeech)

  const replicateModelForSpeech = useSettings(s => s.replicateModelForSpeech)
  const setReplicateModelForSpeech = useSettings(s => s.setReplicateModelForSpeech)

  const falAiModelForSpeech = useSettings(s => s.falAiModelForSpeech)
  const setFalAiModelForSpeech = useSettings(s => s.setFalAiModelForSpeech)

  const modelsLabModelForSpeech = useSettings(s => s.modelsLabModelForSpeech)
  const setModelsLabModelForSpeech = useSettings(s => s.setModelsLabModelForSpeech)

  const comfyWorkflowForSpeech = useSettings(s => s.comfyWorkflowForSpeech)
  const setComfyWorkflowForSpeech = useSettings(s => s.setComfyWorkflowForSpeech)

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