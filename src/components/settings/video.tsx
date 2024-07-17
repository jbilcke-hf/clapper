import { FormSection } from '@/components/forms/FormSection'
import { getDefaultSettingsState, useSettings } from '@/services/settings'
import { FormSelect } from '../forms/FormSelect'
import { ComputeProvider } from '@aitube/clapper-services'
import { FormInput } from '../forms/FormInput'
import { APP_NAME } from '@/lib/core/constants'
import {
  availableComputeProvidersForVideos,
  computeProviderShortNames,
} from './constants'

export function SettingsSectionVideo() {
  const defaultSettings = getDefaultSettingsState()

  /*
  const huggingFaceModelForVideo = useSettings(s => s.huggingFaceModelForVideo)
  const setHuggingFaceModelForVideo = useSettings(s => s.setHuggingFaceModelForVideo)

  const replicateModelForVideo = useSettings(s => s.replicateModelForVideo)
  const setReplicateModelForVideo = useSettings(s => s.setReplicateModelForVideo)

  const falAiModelForVideo = useSettings(s => s.falAiModelForVideo)
  const setFalAiModelForVideo = useSettings(s => s.setFalAiModelForVideo)

  const modelsLabModelForVideo = useSettings(s => s.modelsLabModelForVideo)
  const setModelsLabModelForVideo = useSettings(s => s.setModelsLabModelForVideo)
  */

  const videoPromptPrefix = useSettings((s) => s.videoPromptPrefix)
  const setVideoPromptPrefix = useSettings((s) => s.setVideoPromptPrefix)

  const videoPromptSuffix = useSettings((s) => s.videoPromptSuffix)
  const setVideoPromptSuffix = useSettings((s) => s.setVideoPromptSuffix)

  const videoNegativePrompt = useSettings((s) => s.videoNegativePrompt)
  const setVideoNegativePrompt = useSettings((s) => s.setVideoNegativePrompt)

  const videoProvider = useSettings((s) => s.videoProvider)
  const setVideoProvider = useSettings((s) => s.setVideoProvider)
  const videoGenerationModel = useSettings((s) => s.videoGenerationModel)
  const setVideoGenerationModel = useSettings((s) => s.setVideoGenerationModel)

  const videoUpscalingProvider = useSettings((s) => s.videoUpscalingProvider)
  const setVideoUpscalingProvider = useSettings(
    (s) => s.setVideoUpscalingProvider
  )
  const videoUpscalingModel = useSettings((s) => s.videoUpscalingModel)
  const setVideoUpscalingModel = useSettings((s) => s.setVideoUpscalingModel)

  const videoDepthProvider = useSettings((s) => s.videoDepthProvider)
  const setVideoDepthProvider = useSettings((s) => s.setVideoDepthProvider)
  const videoDepthModel = useSettings((s) => s.videoDepthModel)
  const setVideoDepthModel = useSettings((s) => s.setVideoDepthModel)

  const videoSegmentationProvider = useSettings(
    (s) => s.videoSegmentationProvider
  )
  const setVideoSegmentationProvider = useSettings(
    (s) => s.setVideoSegmentationProvider
  )
  const videoSegmentationModel = useSettings((s) => s.videoSegmentationModel)
  const setVideoSegmentationModel = useSettings(
    (s) => s.setVideoSegmentationModel
  )

  const videoRenderingStrategy = useSettings((s) => s.videoRenderingStrategy)
  const setVideoRenderingStrategy = useSettings(
    (s) => s.setVideoRenderingStrategy
  )

  const maxVideosToGenerateInParallel = useSettings(
    (s) => s.maxVideosToGenerateInParallel
  )
  const setMaxVideosToGenerateInParallel = useSettings(
    (s) => s.setMaxVideosToGenerateInParallel
  )

  const comfyWorkflowForVideo = useSettings((s) => s.comfyWorkflowForVideo)
  const setComfyWorkflowForVideo = useSettings(
    (s) => s.setComfyWorkflowForVideo
  )

  return (
    <div className="flex flex-col justify-between space-y-6">
      <FormSection label="Video rendering">
        <FormSelect<ComputeProvider>
          label="Video provider"
          selectedItemId={videoProvider}
          selectedItemLabel={
            computeProviderShortNames[videoProvider] || ComputeProvider.NONE
          }
          items={availableComputeProvidersForVideos.map((provider) => ({
            id: provider,
            label: computeProviderShortNames[provider] || '(missing name)',
            disabled: false,
            value: provider,
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

        <FormInput
          label="Default prompt prefix"
          value={videoPromptPrefix}
          defaultValue={defaultSettings.videoPromptPrefix}
          onChange={setVideoPromptPrefix}
        />

        <FormInput
          label="Default prompt suffix"
          value={videoPromptSuffix}
          defaultValue={defaultSettings.videoPromptSuffix}
          onChange={setVideoPromptSuffix}
        />

        <FormInput
          label="Default negative prompt"
          value={videoNegativePrompt}
          defaultValue={defaultSettings.videoNegativePrompt}
          onChange={setVideoNegativePrompt}
        />

        {
          videoProvider.startsWith('COMFY_') ? (
            <FormInput
              label="Default Comfy workflow template for videos (not used yet)"
              value={comfyWorkflowForVideo}
              defaultValue={defaultSettings.comfyWorkflowForVideo}
              onChange={setComfyWorkflowForVideo}
            />
          ) : // "proprietary" parameters
          null /* <>
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
          </>
          */
        }
      </FormSection>
    </div>
  )
}
