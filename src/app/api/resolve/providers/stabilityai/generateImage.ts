import { ClapMediaOrientation } from '@aitube/clap'

import { ResolveRequest, StabilityAiImageSize } from '@aitube/clapper-services'

export async function generateImage(request: ResolveRequest): Promise<string> {
  if (!request.settings.stabilityAiApiKey) {
    throw new Error(
      `StabilityAI.generateImage: cannot generate without a valid stabilityAiApiKey`
    )
  }

  if (!request.settings.imageGenerationModel) {
    throw new Error(
      `StabilityAI.generateImage: cannot generate without a valid stabilityAiModelForImage`
    )
  }

  if (!request.prompts.image.positive) {
    throw new Error(
      `StabilityAI.generateImage: cannot generate without a valid positive prompt`
    )
  }

  const aspectRatio =
    request.meta.orientation === ClapMediaOrientation.SQUARE
      ? StabilityAiImageSize.SQUARE
      : request.meta.orientation === ClapMediaOrientation.PORTRAIT
        ? StabilityAiImageSize.PORTRAIT_9_16
        : StabilityAiImageSize.LANDSCAPE_16_9

  // what's cool about the ultra model is its capacity to take in
  // very large prompts, up to 10000 characters apparently?

  // To control the weight of a given word use the format (word:weight),
  // where word is the word you'd like to control the weight of and weight
  // is a value between 0 and 1.
  // For example: The sky was a crisp (blue:0.3) and (green:0.8) would
  // convey a sky that was blue and green, but more green than blue.

  const output_format = 'jpeg'
  const body = new FormData()
  body.set('prompt', `${request.prompts.image.positive || ''}`)
  body.set('output_format', output_format) // "png"
  body.set('negative_prompt', `${request.prompts.image.negative || ''}`)
  body.set('aspect_ratio', `${aspectRatio || ''}`)

  const response = await fetch(
    `https://api.stability.ai/v2beta/${request.settings.imageGenerationModel}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${request.settings.stabilityAiApiKey}`,
        Accept: 'image/*',
      },
      body,
      cache: 'no-store',
    }
  )

  if (response.status === 200) {
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const rawAssetUrl = `data:image/${output_format};base64,${buffer.toString('base64')}`
    return rawAssetUrl
  } else {
    const data = await response.json()
    throw new Error(`${response.status}: ${data.errors}`)
  }
}
