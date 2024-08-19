import { createKlingVideo } from './createKlingVideo'
import { fetchKlingVideoResult } from './fetchKlingVideoResult'
import { KlingVideoFetchResponse, KlingVideoGenerationParams } from './types'

/**
 * Asynchronous function to create a Kling video and wait for the result.
 * @param apiKey - The API key for authentication.
 * @param params - The parameters for video generation.
 * @param maxAttempts - Maximum number of fetch attempts (default: 60).
 * @param delayMs - Delay between fetch attempts in milliseconds (default: 5000).
 * @returns A promise that resolves to the final fetch response.
 */
export async function createAndFetchKlingVideo(
  apiKey: string,
  params: KlingVideoGenerationParams,
  maxAttempts: number = 60,
  delayMs: number = 5000
): Promise<KlingVideoFetchResponse> {
  const creationResponse = await createKlingVideo(apiKey, params)

  let attempts = 0
  while (attempts < maxAttempts) {
    const fetchResponse = await fetchKlingVideoResult(
      apiKey,
      creationResponse.data.task_id
    )

    if (fetchResponse.data.status === 'finished') {
      return fetchResponse
    }

    if (fetchResponse.data.status === 'failed') {
      throw new Error('Video generation failed')
    }

    attempts++
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }

  throw new Error('Max attempts reached, video generation timed out')
}

// Example usage
// const apiKey = 'your-api-key-here';
// const params: KlingVideoGenerationParams = {
//   prompt: "a cute puppy",
//   negative_prompt: "",
//   creativity: 0.5,
//   duration: 5,
//   aspect_ratio: "16:9",
//   professional_mode: false
// };
//
// createAndFetchKlingVideo(apiKey, params)
//   .then(result => console.log(result))
//   .catch(error => console.error(error));
