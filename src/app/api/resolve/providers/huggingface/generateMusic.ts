import { HfInference, HfInferenceEndpoint } from '@huggingface/inference'

import { ResolveRequest } from '@aitube/clapper-services'

export async function generateMusic(request: ResolveRequest): Promise<string> {
  if (!request.settings.musicGenerationWorkflow.data) {
    throw new Error(
      `HuggingFace.generateMusic: cannot generate without a valid musicGenerationWorkflow`
    )
  }

  if (!request.prompts.music.positive) {
    throw new Error(
      `HuggingFace.generateMusic: cannot generate without a valid music prompt`
    )
  }

  if (!request.settings.huggingFaceApiKey) {
    throw new Error(
      `HuggingFace.generateMusic: cannot generate without a valid huggingFaceApiKey`
    )
  }

  const hf: HfInferenceEndpoint = new HfInference(
    request.settings.huggingFaceApiKey
  )

  /*
  hf.textToMusic doesn't exist yet!

  const blob: Blob = await hf.textToMusic({
    model: request.settings.musicGenerationWorkflow.data,
    inputs: request.prompts.music.positive,
  })

  console.log('output from Hugging Face Inference API:', blob)
  */

  throw new Error(`finish me`)
}
