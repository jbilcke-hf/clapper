import { HfInference, HfInferenceEndpoint } from '@huggingface/inference'

import { decodeOutput } from '@/lib/utils/decodeOutput'
import { ResolveRequest } from '@aitube/clapper-services'

export async function generateImage(request: ResolveRequest): Promise<string> {
  if (!request.settings.imageGenerationModel) {
    throw new Error(
      `HuggingFace.generateImage: cannot generate without a valid imageGenerationModel`
    )
  }

  if (!request.prompts.image.positive) {
    throw new Error(
      `HuggingFace.generateImage: cannot generate without a valid positive image prompt`
    )
  }

  if (!request.settings.huggingFaceApiKey) {
    throw new Error(
      `HuggingFace.generateImage: cannot generate without a valid huggingFaceApiKey`
    )
  }

  const hf: HfInferenceEndpoint = new HfInference(
    request.settings.huggingFaceApiKey
  )

  const blob: Blob = await hf.textToImage({
    model: request.settings.imageGenerationModel,
    inputs: request.prompts.image.positive,
    parameters: {
      height: request.meta.height,
      width: request.meta.width,
      /**
       * The number of denoising steps. More denoising steps usually lead to a higher quality image at the expense of slower inference.
       */
      // num_inference_steps?: number;
      /**
       * Guidance scale: Higher guidance scale encourages to generate images that are closely linked to the text `prompt`, usually at the expense of lower image quality.
       */
      // guidance_scale?: number;
    },
  })

  console.log('output from Hugging Face Inference API:', blob)

  throw new Error(`finish me`)
}
