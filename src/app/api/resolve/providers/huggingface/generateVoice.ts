import { HfInference, HfInferenceEndpoint } from '@huggingface/inference'

import { ResolveRequest } from '@aitube/clapper-services'

export async function generateVoice(request: ResolveRequest): Promise<string> {
  if (!request.settings.voiceGenerationWorkflow.data) {
    throw new Error(
      `HuggingFace.generateVoice: cannot generate without a valid voiceGenerationWorkflow`
    )
  }

  if (!request.prompts.voice.positive) {
    throw new Error(
      `HuggingFace.generateVoice: cannot generate without a valid voice prompt`
    )
  }

  if (!request.settings.huggingFaceApiKey) {
    throw new Error(
      `HuggingFace.generateVoice: cannot generate without a valid huggingFaceApiKey`
    )
  }

  const hf: HfInferenceEndpoint = new HfInference(
    request.settings.huggingFaceApiKey
  )

  const blob: Blob = await hf.textToSpeech({
    model: request.settings.voiceGenerationWorkflow.data,
    inputs: request.prompts.voice.positive,
  })

  console.log('output from Hugging Face Inference API:', blob)

  throw new Error(`finish me`)
}
