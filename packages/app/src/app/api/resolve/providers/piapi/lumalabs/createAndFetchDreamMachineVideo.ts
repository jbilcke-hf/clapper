import { createDreamMachineVideo } from './createDreamMachineVideo'
import { fetchDreamMachineVideoResult } from './fetchDreamMachineVideoResult'
import { VideoFetchResponse, VideoGenerationParams } from './types'

/**
 * Asynchronous function to create a video and wait for the result.
 * @param apiKey - The API key for authentication.
 * @param params - The parameters for video generation.
 * @param maxAttempts - Maximum number of fetch attempts (default: 60).
 * @param delayMs - Delay between fetch attempts in milliseconds (default: 5000).
 * @returns A promise that resolves to the final fetch response.
 */
export async function createAndFetchDreamMachineVideo(
  apiKey: string,
  params: VideoGenerationParams,
  maxAttempts: number = 60,
  delayMs: number = 5000
): Promise<VideoFetchResponse> {
  const creationResponse = await createDreamMachineVideo(apiKey, params)

  let attempts = 0
  while (attempts < maxAttempts) {
    const fetchResponse = await fetchDreamMachineVideoResult(
      apiKey,
      creationResponse.data.task_id
    )

    if (
      fetchResponse.data.status === 'finished' ||
      fetchResponse.data.generation.state === 'completed'
    ) {
      return fetchResponse
    }

    if (
      fetchResponse.data.status === 'failed' ||
      fetchResponse.data.generation.state === 'failed'
    ) {
      throw new Error('Video generation failed')
    }

    attempts++
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }

  throw new Error('Max attempts reached, video generation timed out')
}

// Example usage
// const apiKey = 'your-api-key-here';
// const params: VideoGenerationParams = {
//   prompt: "a cute puppy",
//   expand_prompt: false,
//   image_url: "https://example.com/image.jpg"
// };
//
// createAndFetchDreamMachineVideo(apiKey, params)
//   .then(result => console.log(result))
//   .catch(error => console.error(error));
