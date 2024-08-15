import { ImageCreationParams, ImageCreationResponse } from './types'

/**
 * Asynchronous function to create an image using the LetzAI API.
 * @param apiKey - The API key for authentication.
 * @param params - The parameters for image creation.
 * @returns A promise that resolves to the image creation result.
 */
export async function callCreateImage(
  apiKey: string,
  params: ImageCreationParams
): Promise<ImageCreationResponse> {
  const baseUrl = 'https://api.letz.ai'
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  }

  try {
    const response = await fetch(`${baseUrl}/images`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: ImageCreationResponse = await response.json()
    return data
  } catch (error) {
    console.error('Error in image creation:', error)
    throw error
  }
}

// Example usage
// const apiKey = 'your-api-key-here';
// const params: ImageCreationParams = {
//   prompt: "A beautiful sunset over a calm ocean",
//   model: "sd_xl_base_1.0",
//   width: 1024,
//   height: 1024,
//   steps: 30,
//   guidance: 7.5,
//   outputFormat: "png"
// };
//
// callCreateImage(apiKey, params)
//   .then(result => console.log(result))
//   .catch(error => console.error(error));
