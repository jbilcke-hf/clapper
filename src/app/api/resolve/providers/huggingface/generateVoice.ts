import { HfInference, HfInferenceEndpoint } from "@huggingface/inference"

import { ResolveRequest } from "@/types"

export async function generateVoice(request: ResolveRequest): Promise<string> {
  
  if (!request.settings.voiceGenerationModel) {
    throw new Error(`HuggingFace.generateVoice: cannot generate without a valid voiceGenerationModel`)
  }

  if (!request.prompts.voice.positive) {
    throw new Error(`HuggingFace.generateVoice: cannot generate without a valid voice prompt`)
  }

  if (!request.settings.huggingFaceApiKey) {
    throw new Error(`HuggingFace.generateVoice: cannot generate without a valid huggingFaceApiKey`)
  }

  const hf: HfInferenceEndpoint = new HfInference(request.settings.huggingFaceApiKey)
  
  const blob: Blob = await hf.textToSpeech({
    model: request.settings.voiceGenerationModel,
    inputs: request.prompts.voice.positive,
  })

  console.log("output from Hugging Face Inference API:", blob)

  throw new Error(`finish me`)
}