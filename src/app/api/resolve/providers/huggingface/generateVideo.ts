import { ResolveRequest } from "@/types"
import { callGradioApi } from "@/lib/hf/callGradioApi"

export async function generateVideo(request: ResolveRequest): Promise<string> {
  
  if (!request.settings.huggingFaceModelForVideo) {
    throw new Error(`HuggingFace.generateVideo: cannot generate without a valid huggingFaceModelForVideo`)
  }

  if (!request.prompts.video.image) {
    throw new Error(`HuggingFace.generateVideo: cannot generate without a valid input image prompt`)
  }

  if (!request.settings.huggingFaceApiKey) {
    throw new Error(`HuggingFace.generateVideo: cannot generate without a valid huggingFaceApiKey`)
  }

  // TODO pass a type to the template function
  const output = await callGradioApi({
    url: request.settings.huggingFaceModelForVideo,
    inputs: request.prompts.video,
    apiKey: request.settings.huggingFaceApiKey
  })

  console.log(`output from the Gradio API:`, output)

  throw new Error(`please finish me`)
}