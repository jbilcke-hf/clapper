import { ResolveRequest } from '@aitube/clapper-services'
import { callGradioApi } from '@/lib/hf/callGradioApi'

export async function generateVideo(request: ResolveRequest): Promise<string> {
  if (!request.settings.videoGenerationWorkflow.data) {
    throw new Error(
      `HuggingFace.generateVideo: cannot generate without a valid videoGenerationWorkflow.data`
    )
  }

  if (!request.prompts.video.image) {
    throw new Error(
      `HuggingFace.generateVideo: cannot generate without a valid input image prompt`
    )
  }

  if (!request.settings.huggingFaceApiKey) {
    throw new Error(
      `HuggingFace.generateVideo: cannot generate without a valid huggingFaceApiKey`
    )
  }

  // TODO pass a type to the template function
  const assetUrl = await callGradioApi<string>({
    url: request.settings.videoGenerationWorkflow.data,
    inputs: request.prompts.video,
    apiKey: request.settings.huggingFaceApiKey,
  })

  return assetUrl
}
