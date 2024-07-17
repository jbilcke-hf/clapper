import { sleep } from '@/lib/utils/sleep'
import { ResolveRequest } from '@aitube/clapper-services'

export async function generateVideo(request: ResolveRequest): Promise<string> {
  if (!request.settings.stabilityAiApiKey) {
    throw new Error(
      `StabilityAI.generateVideo: cannot generate without a valid stabilityAiApiKey`
    )
  }

  if (!request.settings.videoGenerationModel) {
    throw new Error(
      `StabilityAI.generateVideo: cannot generate without a valid videoGenerationModel`
    )
  }

  if (!request.prompts.video.image) {
    throw new Error(
      `StabilityAI.generateVideo: cannot generate without a valid image input`
    )
  }

  // what's cool about the ultra model is its capacity to take in
  // very large prompts, up to 10000 characters apparently?

  // To control the weight of a given word use the format (word:weight),
  // where word is the word you'd like to control the weight of and weight
  // is a value between 0 and 1.
  // For example: The sky was a crisp (blue:0.3) and (green:0.8) would
  // convey a sky that was blue and green, but more green than blue.

  const body = new FormData()

  // Supported Formats: jpeg, png
  // Supported Dimensions: 1024x576, 576x1024, 768x768

  // "Please ensure that the source image is in the correct format and dimensions"
  body.set('image', `${request.prompts.video.image || ''}`)

  const response = (await fetch(
    `https://api.stability.ai/v2beta/image-to-video`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${request.settings.stabilityAiApiKey}`,
      },
      body,
      cache: 'no-store',
    }
  )) as unknown as { data: { id: number } }

  const generationId = response?.data?.id
  if (!generationId) {
    throw new Error(`StabilityAI failed to give us a valid response.data.id`)
  }

  console.log('Generation ID:', generationId)

  let pollingCount = 0
  do {
    // This is normally a fast model, so let's check every 4 seconds
    await sleep(10000)

    const res = await fetch(
      `https://api.stability.ai/v2beta/image-to-video/result/${generationId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${request.settings.stabilityAiApiKey}`,
          Accept: 'video/*', // Use 'application/json' to receive base64 encoded JSON
        },
        cache: 'no-store',
      }
    )

    if (res.status === 200) {
      try {
        const response = (await res.json()) as any
        const errors = `${response?.errors || ''}`
        if (errors) {
          throw new Error(errors)
        }
        return response.output.pop()
      } catch (err) {
        console.error('res.json() error:', err)
      }
    }

    pollingCount++

    // To prevent indefinite polling, we can stop after a certain number
    if (pollingCount >= 40) {
      throw new Error('Request timed out.')
    }
  } while (true)

  throw new Error('finish me')
}
