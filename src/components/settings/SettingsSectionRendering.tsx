import { FormSection } from "@/components/form/form-section"
import { useSettingsRendering } from "@/settings/rendering"

export function SettingsSectionRendering() {

  const comfyUiApiVendor = useSettingsRendering(s => s.comfyUiApiVendor)
  const comfyUiApiKey = useSettingsRendering(s => s.comfyUiApiKey)
  const storyboardRenderingStrategy = useSettingsRendering(s => s.storyboardRenderingStrategy)
  const videoRenderingStrategy = useSettingsRendering(s => s.videoRenderingStrategy)
  const maxNbAssetsToGenerateInParallel = useSettingsRendering(s => s.maxNbAssetsToGenerateInParallel)

  return (
    <div className="flex flex-col space-y-6 justify-between">
      <FormSection label="TODO">
        <p>TODO</p>
      </FormSection>
    </div>
  )
}