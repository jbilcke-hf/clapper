import { FormSection } from "@/components/form/form-section"
import { getDefaultSettingsRendering, useSettingsRendering } from "@/settings/rendering"
import { FormSelect } from "../form/form-select"
import { ComfyIcuAccelerator } from "@/types"
import { FormInput } from "../form/form-input"
import { APP_NAME } from "@/lib/core/constants"
import { availableComfyIcuAccelerators } from "./constants"

export function SettingsSectionProvider() {
  const defaultSettings = getDefaultSettingsRendering()

  const replicateApiKey = useSettingsRendering(s => s.replicateApiKey)
  const setReplicateApiKey = useSettingsRendering(s => s.setReplicateApiKey)

  const comfyIcuApiKey = useSettingsRendering(s => s.comfyIcuApiKey)
  const setComfyIcuApiKey = useSettingsRendering(s => s.setComfyIcuApiKey)

  const comfyIcuAccelerator = useSettingsRendering(s => s.comfyIcuAccelerator)
  const setComfyIcuAccelerator = useSettingsRendering(s => s.setComfyIcuAccelerator)

  const huggingFaceApiKey = useSettingsRendering(s => s.huggingFaceApiKey)
  const setHuggingFaceApiKey = useSettingsRendering(s => s.setHuggingFaceApiKey)

  const falAiApiKey = useSettingsRendering(s => s.falAiApiKey)
  const setFalAiApiKey = useSettingsRendering(s => s.setFalAiApiKey)

  const modelsLabApiKey = useSettingsRendering(s => s.modelsLabApiKey)
  const setModelsLabApiKey = useSettingsRendering(s => s.setModelsLabApiKey)

  return (
    <div className="flex flex-col space-y-6 justify-between">
      <FormSection label="Compute providers">

      <p className="italic text-sm text-stone-500 max-w-80">
          Note: preferences and credentials are stored inside your browser local storage.<br/>{APP_NAME} uses them to perform API calls on your behalf, but forgets them immediately.
        </p>
        
        <FormInput
          label="Hugging Face API key"
          value={huggingFaceApiKey}
          defaultValue={""}
          onChange={setHuggingFaceApiKey}
          type="password"
        />

        <FormInput
          label="Replicate API key"
          value={replicateApiKey}
          defaultValue={defaultSettings.replicateApiKey}
          onChange={setReplicateApiKey}
          type="password"
        />
        <FormInput
          label="Comfy.icu API key"
          value={comfyIcuApiKey}
          defaultValue={defaultSettings.comfyIcuApiKey}
          onChange={setComfyIcuApiKey}
          type="password"
        />

        <FormSelect<ComfyIcuAccelerator>
          label="Comfy.icu hardware accelerator"
          selectedItemId={comfyIcuAccelerator}
          selectedItemLabel={
            (availableComfyIcuAccelerators as any)[comfyIcuAccelerator]
            || ComfyIcuAccelerator.L4
          }
          items={Object.entries(availableComfyIcuAccelerators).map(([accelerator, label]) => ({
            id: accelerator,
            label,
            disabled: false,
            value: accelerator as ComfyIcuAccelerator,
          }))}
          onSelect={setComfyIcuAccelerator}
          horizontal
        />

        <FormInput
          label="Fal.ai API Key"
          value={falAiApiKey}
          defaultValue={defaultSettings.falAiApiKey}
          onChange={setFalAiApiKey}
          type="password"
        />

        <FormInput
          label="ModelsLab API Key"
          value={modelsLabApiKey}
          defaultValue={defaultSettings.modelsLabApiKey}
          onChange={setModelsLabApiKey}
          type="password"
        />

      </FormSection>
    </div>
  )
}