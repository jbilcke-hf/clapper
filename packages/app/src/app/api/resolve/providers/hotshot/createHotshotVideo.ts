import {
  HotshotVideoGenerationParams,
  HotshotVideoGenerationResponse,
} from './types'

/**
 * Asynchronous function to initiate video generation using the Hotshot API.
 * @param apiKey - The API key for authentication.
 * @param params - The parameters for video generation.
 * @returns A promise that resolves to the video generation response.
 */
export async function createHotshotVideo(
  apiKey: string,
  params: HotshotVideoGenerationParams
): Promise<HotshotVideoGenerationResponse> {
  const baseUrl = 'https://hotshot.co'
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',

    // I think right now it's using cookies
    // 'X-API-Key': apiKey,
  }

  try {
    const response = await fetch(`${baseUrl}/api/v1/text-to-video/generate`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(params),
    })

    // note: at this stage normally we should connect to the queue using websockets
    // however since we are an API context and Hotshot is slow to generate,
    // a simply polling is probably more than enough
    // eg initial wait time of 20 seconds + check every 5 sec

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: HotshotVideoGenerationResponse = await response.json()
    return data
  } catch (error) {
    console.error('Error in video generation:', error)
    throw error
  }
}
