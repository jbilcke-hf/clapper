import { FormSection } from "@/components/form/form-section"
import { getDefaultSettingsRendering, useSettingsRendering } from "@/settings/rendering"
import { ComputeProvider } from "@/types"

import { FormSelect } from "../form/form-select"
import { availableComputeProvidersForSound } from "./constants"
import { FormInput } from "../form/form-input"

export function SettingsSectionSound() {
  const defaultSettings = getDefaultSettingsRendering()

  const soundProvider = useSettingsRendering(s => s.soundProvider)
  const setSoundProvider = useSettingsRendering(s => s.setSoundProvider)

  const huggingFaceModelForSound = useSettingsRendering(s => s.huggingFaceModelForSound)
  const setHuggingFaceModelForSound = useSettingsRendering(s => s.setHuggingFaceModelForSound)

  const replicateModelForSound = useSettingsRendering(s => s.replicateModelForSound)
  const setReplicateModelForSound = useSettingsRendering(s => s.setReplicateModelForSound)

  const falAiModelForSound = useSettingsRendering(s => s.falAiModelForSound)
  const setFalAiModelForSound = useSettingsRendering(s => s.setFalAiModelForSound)

  const modelsLabModelForSound = useSettingsRendering(s => s.modelsLabModelForSound)
  const setModelsLabModelForSound = useSettingsRendering(s => s.setModelsLabModelForSound)

  const comfyWorkflowForSound = useSettingsRendering(s => s.comfyWorkflowForSound)
  const setComfyWorkflowForSound = useSettingsRendering(s => s.setComfyWorkflowForSound)

  return (
    <div className="flex flex-col space-y-6 justify-between">
      <FormSection label="Sound rendering">

        <FormSelect<ComputeProvider>
          label="Sound provider"
          selectedItemId={soundProvider}
          selectedItemLabel={
            (availableComputeProvidersForSound as any)[soundProvider]
            || ComputeProvider.NONE
          }
          items={Object.entries(availableComputeProvidersForSound).map(([provider, label]) => ({
            id: provider,
            label,
            disabled: false,
            value: provider as ComputeProvider,
          }))}
          onSelect={setSoundProvider}
          horizontal
        />
     {soundProvider.startsWith("COMFY_")
         ? <FormInput
          label="Default Comfy workflow template for sound"
          value={comfyWorkflowForSound}
          defaultValue={defaultSettings.comfyWorkflowForSound}
          onChange={setComfyWorkflowForSound}
        />
        : // "proprietary" parameters
          <>
            {soundProvider === ComputeProvider.HUGGINGFACE && <FormInput
              label="HF Model ID (must be compatible with the Inference API)"
              value={huggingFaceModelForSound}
              defaultValue={defaultSettings.huggingFaceModelForSound}
              onChange={setHuggingFaceModelForSound}
            />}
            {soundProvider === ComputeProvider.REPLICATE && <FormInput
              label="Replicate.com model ID"
              value={replicateModelForSound}
              defaultValue={defaultSettings.replicateModelForSound}
              onChange={setReplicateModelForSound}
            />}
            {soundProvider === ComputeProvider.FALAI && <FormInput
              label="Fal.ai model ID"
              value={falAiModelForSound}
              defaultValue={defaultSettings.falAiModelForSound}
              onChange={setFalAiModelForSound}
            />}
            {soundProvider === ComputeProvider.MODELSLAB && <FormInput
              label="ModelsLab.com model ID"
              value={modelsLabModelForSound}
              defaultValue={defaultSettings.modelsLabModelForSound}
              onChange={setModelsLabModelForSound}
            />}
          </>}
      </FormSection>
    </div>
  )
}