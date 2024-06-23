import { FormSection } from "@/components/forms/FormSection"
import { getDefaultSettingsState, useSettings } from "@/controllers/settings"
import { ComputeProvider } from "@/types"

import { FormSelect } from "../forms/FormSelect"
import { availableComputeProvidersForVoice, computeProviderShortNames } from "./constants"
import { FormInput } from "../forms/FormInput"

export function SettingsSectionVoice() {
  const defaultSettings = getDefaultSettingsState()
  
  const voiceProvider = useSettings(s => s.voiceProvider)
  const setVoiceProvider = useSettings(s => s.setVoiceProvider)

  /*
  const huggingFaceModelForVoice = useSettings(s => s.huggingFaceModelForVoice)
  const setHuggingFaceModelForVoice = useSettings(s => s.setHuggingFaceModelForVoice)

  const replicateModelForVoice = useSettings(s => s.replicateModelForVoice)
  const setReplicateModelForVoice = useSettings(s => s.setReplicateModelForVoice)

  const falAiModelForVoice = useSettings(s => s.falAiModelForVoice)
  const setFalAiModelForVoice = useSettings(s => s.setFalAiModelForVoice)

  const modelsLabModelForVoice = useSettings(s => s.modelsLabModelForVoice)
  const setModelsLabModelForVoice = useSettings(s => s.setModelsLabModelForVoice)
  */

  const comfyWorkflowForVoice = useSettings(s => s.comfyWorkflowForVoice)
  const setComfyWorkflowForVoice = useSettings(s => s.setComfyWorkflowForVoice)

  return (
    <div className="flex flex-col space-y-6 justify-between">
      <FormSection label="Voice rendering">

        <FormSelect<ComputeProvider>
          label="Voice provider"
          selectedItemId={voiceProvider}
          selectedItemLabel={
            computeProviderShortNames[voiceProvider]
            || ComputeProvider.NONE
          }
          items={availableComputeProvidersForVoice.map(provider => ({
            id: provider,
            label: computeProviderShortNames[provider] || "(missing name)",
            disabled: false,
            value: provider,
          }))}
          onSelect={setVoiceProvider}
          horizontal
        />
     {voiceProvider.startsWith("COMFY_")
         ? <FormInput
          label="Default Comfy workflow template for voice"
          value={comfyWorkflowForVoice}
          defaultValue={defaultSettings.comfyWorkflowForVoice}
          onChange={setComfyWorkflowForVoice}
        />
        : // "proprietary" parameters
          null /* <>
            {voiceProvider === ComputeProvider.HUGGINGFACE && <FormInput
              label="HF Model ID (must be compatible with the Inference API)"
              value={huggingFaceModelForVoice}
              defaultValue={defaultSettings.huggingFaceModelForVoice}
              onChange={setHuggingFaceModelForVoice}
            />}
            {voiceProvider === ComputeProvider.REPLICATE && <FormInput
              label="Replicate.com model ID"
              value={replicateModelForVoice}
              defaultValue={defaultSettings.replicateModelForVoice}
              onChange={setReplicateModelForVoice}
            />}
            {voiceProvider === ComputeProvider.FALAI && <FormInput
              label="Fal.ai model ID"
              value={falAiModelForVoice}
              defaultValue={defaultSettings.falAiModelForVoice}
              onChange={setFalAiModelForVoice}
            />}
            {voiceProvider === ComputeProvider.MODELSLAB && <FormInput
              label="ModelsLab.com model ID"
              value={modelsLabModelForVoice}
              defaultValue={defaultSettings.modelsLabModelForVoice}
              onChange={setModelsLabModelForVoice}
            />}
          </>
          */}
      </FormSection>
    </div>
  )
}