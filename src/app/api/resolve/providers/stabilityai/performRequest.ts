
import axios from "axios"
import FormData from "form-data"

import { decodeOutput } from "@/lib/utils/decodeOutput"
import { StabilityAiImageSize } from "@/types"

export async function performRequest({
  positivePrompt,
  negativePrompt,
  modelName,
  imageSize,
  apiKey
}: {
  positivePrompt: string
  negativePrompt: string
  modelName: string
  imageSize: StabilityAiImageSize
  apiKey: string
}): Promise<string> {
    
  const payload = {
    prompt: positivePrompt,
    output_format: "jpeg", // "webp",
    negative_prompt: negativePrompt,
    aspect_ratio: imageSize,


          
    // string (GenerationMode)
    // Default: text-to-image
    // Enum: image-to-image text-to-image
    // Controls whether this is a text-to-image or image-to-image generation, which affects which parameters are required:

    // text-to-image requires only the prompt parameter
    // image-to-image requires the prompt, image, and strength parameters
    // mode: "text-to-image",

    // "stable-image/generate/sd3" supports this option:
    // model: "", // the model to use ("SD3 Medium", "SD3 Large", or "SD3 Large Turbo")
  };

  const response = await axios.postForm(
    `https://api.stability.ai/v2beta/${modelName}`,
    axios.toFormData(payload, new FormData()),
    {
      validateStatus: undefined,
      responseType: "arraybuffer",
      headers: { 
        Authorization: `Bearer ${apiKey}`, 
        Accept: "image/*" 
      },
    },
  )

  if (response.status === 200) {
    console.log("response.data: ", response.data)
    const buffer = Buffer.from(response.data)
    const rawAssetUrl = `data:image/${payload.output_format};base64,${buffer.toString('base64')}`
    const assetUrl = await decodeOutput(rawAssetUrl)
    return assetUrl
  } else {
    throw new Error(`${response.status}: ${response.data.toString()}`);
  }
}