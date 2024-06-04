import { FormSection } from "@/components/form/form-section"
import { useSettingsRendering } from "@/settings/rendering"
import { FormSelect } from "../form/form-select"
import { ComfyVendor } from "@/types"
import { FormInput } from "../form/form-input"
import { APP_NAME } from "@/lib/core/constants"

export function SettingsSectionRendering() {

  const comfyUiApiVendor = useSettingsRendering(s => s.comfyUiApiVendor)
  const setComfyUiApiVendor = useSettingsRendering(s => s.setComfyUiApiVendor)
  
  const comfyUiApiKey = useSettingsRendering(s => s.comfyUiApiKey)
  const setComfyUiApiKey = useSettingsRendering(s => s.setComfyUiApiKey)

  const storyboardRenderingStrategy = useSettingsRendering(s => s.storyboardRenderingStrategy)
  const setStoryboardRenderingStrategy = useSettingsRendering(s => s.setStoryboardRenderingStrategy)
  
  const videoRenderingStrategy = useSettingsRendering(s => s.videoRenderingStrategy)
  const setVideoRenderingStrategy = useSettingsRendering(s => s.setVideoRenderingStrategy)
  
  const maxNbAssetsToGenerateInParallel = useSettingsRendering(s => s.maxNbAssetsToGenerateInParallel)
  const setMaxNbAssetsToGenerateInParallel = useSettingsRendering(s => s.setMaxNbAssetsToGenerateInParallel)

  const availableComfyUiApiVendors = {
    [ComfyVendor.NONE]: "No provider",
    // [ComfyVendor.REPLICATE]: "Replicate",
    // [ComfyVendor.HUGGINGFACE]: "HuggingFace",
    // [ComfyVendor.CUSTOM]: "Custom server",
  }
  
  return (
    <div className="flex flex-col space-y-6 justify-between">
      <FormSection label="Rendering service provider">
        <FormSelect<ComfyVendor>
            label="Service provider for ComfyUI"
            selectedItemId={comfyUiApiVendor}
            selectedItemLabel={
              (availableComfyUiApiVendors as any)[comfyUiApiVendor]
              || ComfyVendor.NONE
            }
            items={Object.entries(availableComfyUiApiVendors).map(([vendor, label]) => ({
              id: vendor,
              label,
              disabled: (vendor as ComfyVendor) === ComfyVendor.HUGGINGFACE || (vendor as ComfyVendor) === ComfyVendor.CUSTOM,
              value: vendor as ComfyVendor,
            }))}
            onSelect={setComfyUiApiVendor}
            horizontal
          />

          {comfyUiApiVendor === ComfyVendor.REPLICATE && (
            <>
              <FormInput
                label="Replicate API key"
                value={comfyUiApiKey}
                defaultValue={""}
                onChange={setComfyUiApiKey}
              />
              <p className="italic text-sm text-stone-500">
               Note: preferences and credentials are stored inside your browser local storage. {APP_NAME} uses them to perform API calls on your behalf, then forget them immediately.
              </p>
            </>
          )}
      </FormSection>
    </div>
  )
}