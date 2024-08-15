import { VideoGenerationParams, VideoGenerationResponse } from './types'

/**
 * Asynchronous function to initiate video generation using the PiAPI Dream Machine API.
 * @param apiKey - The API key for authentication.
 * @param params - The parameters for video generation.
 * @returns A promise that resolves to the video generation response.
 */
export async function createDreamMachineVideo(
  apiKey: string,
  params: VideoGenerationParams
): Promise<VideoGenerationResponse> {
  const baseUrl = 'https://api.piapi.ai'
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-API-Key': apiKey,
  }

  try {
    const response = await fetch(`${baseUrl}/api/luma/v1/video`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: VideoGenerationResponse = await response.json()
    return data
  } catch (error) {
    console.error('Error in video generation:', error)
    throw error
  }
}
