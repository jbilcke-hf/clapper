import { ClapMediaOrientation } from "@aitube/clap"

import { ResolveRequest, StabilityAiImageSize } from "@/types"

export async function generateImage(request: ResolveRequest): Promise<string> {

  if (!request.settings.stabilityAiApiKey) {
    throw new Error(`StabilityAI.generateImage: cannot generate without a valid stabilityAiApiKey`)
  }

  if (!request.settings.stabilityAiModelForImage) {
    throw new Error(`StabilityAI.generateImage: cannot generate without a valid stabilityAiModelForImage`)
  }

  if (!request.prompts.image.positive) {
    throw new Error(`StabilityAI.generateImage: cannot generate without a valid positive prompt`)
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

  const body = new FormData()
  body.set("prompt", `${request.prompts.image.positive || ""}`)
  body.set("output_format", "jpeg") // "png"
  body.set("negative_prompt", `${request.prompts.image.negative || ""}`)
  body.set("aspect_ratio", `${aspectRatio || ""}`)

  const response = await fetch(`https://api.stability.ai/v2beta/${request.settings.stabilityAiModelForImage}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${request.settings.stabilityAiApiKey}`,
    },
    body,
    cache: "no-store"
  })

  console.log("response:", response)

  /*
  if (response.status === 200) {
    const buffer = Buffer.from(response.data)
    const rawAssetUrl = `data:image/${payload.output_format};base64,${buffer.toString('base64')}`
    return rawAssetUrl
  } else {
    throw new Error(`${response.status}: ${response.data.toString()}`);
  }
    */
   throw new Error("finish me")
}