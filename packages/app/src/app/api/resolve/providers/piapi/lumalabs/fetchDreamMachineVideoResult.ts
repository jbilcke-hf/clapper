import { VideoFetchResponse } from './types'

/**
 * Asynchronous function to fetch the result of a Dream Machine video generation task.
 * @param apiKey - The API key for authentication.
 * @param taskId - The ID of the task to fetch.
 * @returns A promise that resolves to the fetch response.
 */
export async function fetchDreamMachineVideoResult(
  apiKey: string,
  taskId: string
): Promise<VideoFetchResponse> {
  const baseUrl = 'https://api.piapi.ai'
  const headers = {
    Accept: 'application/json',
    'X-API-Key': apiKey,
  }

  try {
    const response = await fetch(`${baseUrl}/api/luma/v1/video/${taskId}`, {
      method: 'GET',
      headers: headers,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: VideoFetchResponse = await response.json()
    return data
  } catch (error) {
    console.error('Error in fetching video result:', error)
    throw error
  }
}
