import { FormSection } from "@/components/forms/FormSection"
import { getDefaultSettingsState, useSettings } from "@/controllers/settings"
import { FormSelect } from "../forms/FormSelect"
import { ComputeProvider } from "@/types"
import { FormInput } from "../forms/FormInput"
import { APP_NAME } from "@/lib/core/constants"
import { availableComputeProvidersForVideos } from "./constants"

export function SettingsSectionVideo() {
  const defaultSettings = getDefaultSettingsState()

  const videoProvider = useSettings(s => s.videoProvider)
  const setVideoProvider = useSettings(s => s.setVideoProvider)

  
  const huggingFaceModelForVideo = useSettings(s => s.huggingFaceModelForVideo)
  const setHuggingFaceModelForVideo = useSettings(s => s.setHuggingFaceModelForVideo)

  const replicateModelForVideo = useSettings(s => s.replicateModelForVideo)
  const setReplicateModelForVideo = useSettings(s => s.setReplicateModelForVideo)

  const falAiModelForVideo = useSettings(s => s.falAiModelForVideo)
  const setFalAiModelForVideo = useSettings(s => s.setFalAiModelForVideo)

  const modelsLabModelForVideo = useSettings(s => s.modelsLabModelForVideo)
  const setModelsLabModelForVideo = useSettings(s => s.setModelsLabModelForVideo)

  const videoRenderingStrategy = useSettings(s => s.videoRenderingStrategy)
  const setVideoRenderingStrategy = useSettings(s => s.setVideoRenderingStrategy)
  
  const maxVideosToGenerateInParallel = useSettings(s => s.maxVideosToGenerateInParallel)
  const setMaxVideosToGenerateInParallel = useSettings(s => s.setMaxVideosToGenerateInParallel)

  const comfyWorkflowForVideo = useSettings(s => s.comfyWorkflowForVideo)
  const setComfyWorkflowForVideo = useSettings(s => s.setComfyWorkflowForVideo)

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