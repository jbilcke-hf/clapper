import { FormSection } from "@/components/form/form-section"
import { getDefaultSettingsRendering, useSettingsRendering } from "@/settings/rendering"
import { ComputeProvider } from "@/types"

import { FormSelect } from "../form/form-select"
import { availableComputeProvidersForMusic } from "./constants"
import { FormInput } from "../form/form-input"

export function SettingsSectionMusic() {
  const defaultSettings = getDefaultSettingsRendering()
  
  const musicProvider = useSettingsRendering(s => s.musicProvider)
  const setMusicProvider = useSettingsRendering(s => s.setMusicProvider)

  const huggingFaceModelForMusic = useSettingsRendering(s => s.huggingFaceModelForMusic)
  const setHuggingFaceModelForMusic = useSettingsRendering(s => s.setHuggingFaceModelForMusic)

  const replicateModelForMusic = useSettingsRendering(s => s.replicateModelForMusic)
  const setReplicateModelForMusic = useSettingsRendering(s => s.setReplicateModelForMusic)

  const falAiModelForMusic = useSettingsRendering(s => s.falAiModelForMusic)
  const setFalAiModelForMusic = useSettingsRendering(s => s.setFalAiModelForMusic)

  const modelsLabModelForMusic = useSettingsRendering(s => s.modelsLabModelForMusic)
  const setModelsLabModelForMusic = useSettingsRendering(s => s.setModelsLabModelForMusic)

  const comfyWorkflowForMusic = useSettingsRendering(s => s.comfyWorkflowForMusic)
  const setComfyWorkflowForMusic = useSettingsRendering(s => s.setComfyWorkflowForMusic)

  return (
    <div className="flex flex-col space-y-6 justify-between">
      <FormSection label="Music rendering">

        <FormSelect<ComputeProvider>
          label="Music provider"
          selectedItemId={musicProvider}
          selectedItemLabel={
            (availableComputeProvidersForMusic as any)[musicProvider]
            || ComputeProvider.NONE
          }
          items={Object.entries(availableComputeProvidersForMusic).map(([provider, label]) => ({
            id: provider,
            label,
            disabled: false,
            value: provider as ComputeProvider,
          }))}
          onSelect={setMusicProvider}
          horizontal
        />
     {musicProvider.startsWith("COMFY_")
         ? <FormInput
          label="Default Comfy workflow template for music"
          value={comfyWorkflowForMusic}
          defaultValue={defaultSettings.comfyWorkflowForMusic}
          onChange={setComfyWorkflowForMusic}
        />
        : // "proprietary" parameters
          <>
            {musicProvider === ComputeProvider.HUGGINGFACE && <FormInput
              label="HF Model ID (must be compatible with the Inference API)"
              value={huggingFaceModelForMusic}
              defaultValue={defaultSettings.huggingFaceModelForMusic}
              onChange={setHuggingFaceModelForMusic}
            />}
            {musicProvider === ComputeProvider.REPLICATE && <FormInput
              label="Replicate.com model ID"
              value={replicateModelForMusic}
              defaultValue={defaultSettings.replicateModelForMusic}
              onChange={setReplicateModelForMusic}
            />}
            {musicProvider === ComputeProvider.FALAI && <FormInput
              label="Fal.ai model ID"
              value={falAiModelForMusic}
              defaultValue={defaultSettings.falAiModelForMusic}
              onChange={setFalAiModelForMusic}
            />}
            {musicProvider === ComputeProvider.MODELSLAB && <FormInput
              label="ModelsLab.com model ID"
              value={modelsLabModelForMusic}
              defaultValue={defaultSettings.modelsLabModelForMusic}
              onChange={setModelsLabModelForMusic}
            />}
          </>}
      </FormSection>
    </div>
  )
}