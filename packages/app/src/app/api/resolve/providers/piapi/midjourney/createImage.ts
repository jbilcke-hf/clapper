import { createMidjourneyImage } from './createMidjourneyImage'
import { fetchMidjourneyResult } from './fetchMidjourneyResult'
import { FetchResponse, ImageCreationParams } from './types'

/**
 * Asynchronous function to create an image and wait for the result.
 * @param apiKey - The API key for authentication.
 * @param params - The parameters for image creation.
 * @param maxAttempts - Maximum number of fetch attempts (default: 10).
 * @param delayMs - Delay between fetch attempts in milliseconds (default: 5000).
 * @returns A promise that resolves to the final fetch response.
 */
export async function createImage(
  apiKey: string,
  params: ImageCreationParams,
  maxAttempts: number = 10,
  delayMs: number = 5000
): Promise<FetchResponse> {
  const creationResponse = await createMidjourneyImage(apiKey, params)

  let attempts = 0
  while (attempts < maxAttempts) {
    const fetchResponse = await fetchMidjourneyResult(
      apiKey,
      creationResponse.task_id
    )

    if (fetchResponse.status === 'finished') {
      return fetchResponse
    }

    if (fetchResponse.status === 'failed') {
      throw new Error('Image creation failed')
    }

    attempts++
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }

  throw new Error('Max attempts reached, image creation timed out')
}

// Example usage
// const apiKey = 'your-api-key-here';
// const params: ImageCreationParams = {
//   prompt: "a mountain",
//   process_mode: "fast",
//   aspect_ratio: "1:1"
// };
//
// createAndFetchMidjourneyImage(apiKey, params)
//   .then(result => console.log(result))
//   .catch(error => console.error(error));
