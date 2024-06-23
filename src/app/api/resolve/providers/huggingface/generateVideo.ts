import { ResolveRequest } from "@/types"
import { callGradioApi } from "@/lib/hf/callGradioApi"

export async function generateVideo(request: ResolveRequest): Promise<string> {
  
  if (!request.settings.videoGenerationModel) {
    throw new Error(`HuggingFace.generateVideo: cannot generate without a valid videoGenerationModel`)
  }

  if (!request.prompts.video.image) {
    throw new Error(`HuggingFace.generateVideo: cannot generate without a valid input image prompt`)
  }

  if (!request.settings.huggingFaceApiKey) {
    throw new Error(`HuggingFace.generateVideo: cannot generate without a valid huggingFaceApiKey`)
  }

  // TODO pass a type to the template function
  const assetUrl = await callGradioApi<string>({
    url: request.settings.videoGenerationModel,
    inputs: request.prompts.video,
    apiKey: request.settings.huggingFaceApiKey
  })

  return assetUrl
}