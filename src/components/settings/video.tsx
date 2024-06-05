import { FormSection } from "@/components/form/form-section"
import { getDefaultSettingsRendering, useSettingsRendering } from "@/settings/rendering"
import { FormSelect } from "../form/form-select"
import { ComputeProvider } from "@/types"
import { FormInput } from "../form/form-input"
import { APP_NAME } from "@/lib/core/constants"
import { availableComputeProvidersForVideos } from "./constants"

export function SettingsSectionVideo() {
  const defaultSettings = getDefaultSettingsRendering()

  const videoProvider = useSettingsRendering(s => s.videoProvider)
  const setVideoProvider = useSettingsRendering(s => s.setVideoProvider)

  
  const huggingFaceModelForVideo = useSettingsRendering(s => s.huggingFaceModelForVideo)
  const setHuggingFaceModelForVideo = useSettingsRendering(s => s.setHuggingFaceModelForVideo)

  const replicateModelForVideo = useSettingsRendering(s => s.replicateModelForVideo)
  const setReplicateModelForVideo = useSettingsRendering(s => s.setReplicateModelForVideo)

  const falAiModelForVideo = useSettingsRendering(s => s.falAiModelForVideo)
  const setFalAiModelForVideo = useSettingsRendering(s => s.setFalAiModelForVideo)

  const modelsLabModelForVideo = useSettingsRendering(s => s.modelsLabModelForVideo)
  const setModelsLabModelForVideo = useSettingsRendering(s => s.setModelsLabModelForVideo)

  const videoRenderingStrategy = useSettingsRendering(s => s.videoRenderingStrategy)
  const setVideoRenderingStrategy = useSettingsRendering(s => s.setVideoRenderingStrategy)
  
  const maxVideosToGenerateInParallel = useSettingsRendering(s => s.maxVideosToGenerateInParallel)
  const setMaxVideosToGenerateInParallel = useSettingsRendering(s => s.setMaxVideosToGenerateInParallel)

  const comfyWorkflowForVideo = useSettingsRendering(s => s.comfyWorkflowForVideo)
  const setComfyWorkflowForVideo = useSettingsRendering(s => s.setComfyWorkflowForVideo)

  return (
    <div className="flex flex-col space-y-6 justify-between">
      <FormSection label="Video rendering">

        <FormSelect<ComputeProvider>
          label="Video provider"
          selectedItemId={videoProvider}
          selectedItemLabel={
            (availableComputeProvidersForVideos as any)[videoProvider]
            || ComputeProvider.NONE
          }
          items={Object.entries(availableComputeProvidersForVideos).map(([provider, label]) => ({
            id: provider,
            label,
            disabled: false,
            value: provider as ComputeProvider,
          }))}
          onSelect={setVideoProvider}
          horizontal
        />

        <FormInput
          label="Number of videos to render in parallel"
          value={maxVideosToGenerateInParallel}
          defaultValue={defaultSettings.maxVideosToGenerateInParallel}
          onChange={setMaxVideosToGenerateInParallel}
        />

      {videoProvider.startsWith("COMFY_")
         ? <FormInput
          label="Default Comfy workflow template for videos"
          value={comfyWorkflowForVideo}
          defaultValue={defaultSettings.comfyWorkflowForVideo}
          onChange={setComfyWorkflowForVideo}
        />
        : // "proprietary" parameters
          <>
            {videoProvider === ComputeProvider.HUGGINGFACE && <FormInput
              label="HF Model ID (must be compatible with the Inference API)"
              value={huggingFaceModelForVideo}
              defaultValue={defaultSettings.huggingFaceModelForVideo}
              onChange={setHuggingFaceModelForVideo}
            />}
            {videoProvider === ComputeProvider.REPLICATE && <FormInput
              label="Replicate.com model ID"
              value={replicateModelForVideo}
              defaultValue={defaultSettings.replicateModelForVideo}
              onChange={setReplicateModelForVideo}
            />}
            {videoProvider === ComputeProvider.FALAI && <FormInput
              label="Fal.ai model ID"
              value={falAiModelForVideo}
              defaultValue={defaultSettings.falAiModelForVideo}
              onChange={setFalAiModelForVideo}
            />}
            {videoProvider === ComputeProvider.MODELSLAB && <FormInput
              label="ModelsLab.com model ID"
              value={modelsLabModelForVideo}
              defaultValue={defaultSettings.modelsLabModelForVideo}
              onChange={setModelsLabModelForVideo}
            />}
          </>}

      </FormSection>
    </div>
  )
}