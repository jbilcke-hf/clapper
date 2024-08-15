import {
  TaskResultResponse,
  VideoGenerationParams,
  VideoGenerationResponse,
} from './types'

/**
 * Asynchronous function to generate a video using the CogVideoX API and retrieve the result.
 * @param apiKey - The API key for authentication.
 * @param params - The parameters for video generation.
 * @returns A promise that resolves to the video generation result.
 */
export async function callCogVideoX(
  apiKey: string,
  params: VideoGenerationParams
): Promise<TaskResultResponse> {
  const baseUrl = 'https://open.bigmodel.cn/api/paas/v4'
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  }

  try {
    // Step 1: Initialize video generation
    const generationResponse = await fetch(`${baseUrl}/videos/generations`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(params),
    })

    if (!generationResponse.ok) {
      throw new Error(`HTTP error! status: ${generationResponse.status}`)
    }

    const generationData: VideoGenerationResponse =
      await generationResponse.json()
    const { id } = generationData

    // Step 2: Poll for the task result
    let taskResult: TaskResultResponse
    do {
      const resultResponse = await fetch(`${baseUrl}/async-result/${id}`, {
        method: 'GET',
        headers: headers,
      })

      if (!resultResponse.ok) {
        throw new Error(`HTTP error! status: ${resultResponse.status}`)
      }

      taskResult = await resultResponse.json()

      if (taskResult.task_status === 'PROCESSING') {
        // Wait for 5 seconds before polling again
        await new Promise((resolve) => setTimeout(resolve, 5000))
      }
    } while (taskResult.task_status === 'PROCESSING')

    return taskResult
  } catch (error) {
    console.error('Error in video generation:', error)
    throw error
  }
}

// Example usage
// const apiKey = 'your-api-key-here';
// const params: VideoGenerationParams = {
//   model: 'cogvideox',
//   prompt: 'Peter Rabbit drives a small car, wandering on the road, with a face full of happiness and joy.'
// };
//
// generateVideo(apiKey, params)
//   .then(result => console.log(result))
//   .catch(error => console.error(error));
