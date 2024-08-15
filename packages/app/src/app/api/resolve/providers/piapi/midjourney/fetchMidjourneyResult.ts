import { FetchResponse } from './types'

/**
 * Asynchronous function to fetch the result of a Midjourney task.
 * @param apiKey - The API key for authentication.
 * @param taskId - The ID of the task to fetch.
 * @returns A promise that resolves to the fetch response.
 */
export async function fetchMidjourneyResult(
  apiKey: string,
  taskId: string
): Promise<FetchResponse> {
  const baseUrl = 'https://api.piapi.ai'
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-API-KEY': apiKey,
  }

  try {
    const response = await fetch(`${baseUrl}/mj/v2/fetch`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ task_id: taskId }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: FetchResponse = await response.json()
    return data
  } catch (error) {
    console.error('Error in fetching result:', error)
    throw error
  }
}
