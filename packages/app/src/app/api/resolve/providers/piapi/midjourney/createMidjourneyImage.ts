import { ImageCreationParams, ImageCreationResponse } from './types'

/**
 * Asynchronous function to create an image using the PiAPI Midjourney API.
 * @param apiKey - The API key for authentication.
 * @param params - The parameters for image creation.
 * @returns A promise that resolves to the image creation response.
 */
export async function createMidjourneyImage(
  apiKey: string,
  params: ImageCreationParams
): Promise<ImageCreationResponse> {
  const baseUrl = 'https://api.piapi.ai'
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-API-KEY': apiKey,
  }

  try {
    const response = await fetch(`${baseUrl}/mj/v2/imagine`, {
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
