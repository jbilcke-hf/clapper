import {
  builtinProviderCredentialsStabilityai,
  clapperApiKeyToUseBuiltinCredentials,
} from '@/app/api/globalSettings'
import { base64DataUriToBlob } from '@/lib/utils/base64DataUriToBlob'
import { ResolveRequest } from '@aitube/clapper-services'
import sharp from 'sharp'

const TAG = `StabilityAI.generateVideo`

type StabilityAIVImageToVideoStartGenerationResponse = {
  id: string
  name?: string
  errors?: string[]
}

enum StabilityAIVImageToVideoFetchhGenerationFinishReason {
  SUCCESS = 'SUCCESS',
  CONTENT_FILTERED = 'CONTENT_FILTERED',
}

type StabilityAIVImageToVideoFetchGenerationResponse = {
  video: string
  finish_reason: StabilityAIVImageToVideoFetchhGenerationFinishReason
  seed: number
  errors?: string[]
}

export async function generateVideo(request: ResolveRequest): Promise<string> {
  if (!request.settings.videoGenerationWorkflow.data) {
    throw new Error(
      `${TAG}: cannot generate without a valid videoGenerationWorkflow`
    )
  }

  if (!request.prompts.video.image) {
    throw new Error(`${TAG}: cannot generate without a valid image input`)
  }

  let apiKey = request.settings.stabilityAiApiKey

  if (!apiKey) {
    if (clapperApiKeyToUseBuiltinCredentials) {
      if (
        request.settings.clapperApiKey !== clapperApiKeyToUseBuiltinCredentials
      ) {
        throw new Error(`Missing API key for "Stability.ai"`)
      } else {
        // user has a valid Clapper API key, so they are allowed to use the built-in credentials
        apiKey = builtinProviderCredentialsStabilityai
      }
    } else {
      // no Clapper API key is defined, so we give free access to the built-in credentials
      apiKey = builtinProviderCredentialsStabilityai
    }
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
  body.set('image', await getRequestImage(request))

  const response = await fetch(
    `https://api.stability.ai/v2beta/image-to-video`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body,
      cache: 'no-store',
    }
  )

  if (response.status == 200) {
    const { id }: StabilityAIVImageToVideoStartGenerationResponse =
      await response.json()
    console.log(TAG, `Generation ID: ${id}`)
    const result = await pollGenerationResult(
      id,
      request.settings.stabilityAiApiKey
    )
    console.log(TAG, 'Video was successfully generated.', result.length)
    return result
  } else {
    const { errors }: StabilityAIVImageToVideoStartGenerationResponse =
      await response.json()
    if (errors) {
      throw new Error(`${TAG}: ${errors.join('\n')}`)
    }
    throw new Error(`${TAG}: Unexpected error`)
  }
}

/**
 * Extracts the image from the request and resizes
 * it based on the supported dimensions of StabilityAI
 */
async function getRequestImage(request: ResolveRequest) {
  const supportedDimensions = [`1024x576`, `576x1024`, `768x768`]
  let imageBlob = base64DataUriToBlob(`${request.prompts.video.image || ''}`)
  const imageBuffer = Buffer.from(await imageBlob.arrayBuffer())
  const { width, height } = await sharp(imageBuffer).metadata()
  const dimensions = `${width}x${height}`
  if (!(dimensions in supportedDimensions)) {
    console.log(
      TAG,
      `Unsupported dimensions ${width}x${height}, resizing to 1024x576 ...`
    )
    const resizedImageBuffer = await sharp(imageBuffer)
      .resize({
        width: 1024,
        height: 576,
        fit: 'cover',
        position: 'center',
      })
      .toBuffer()
    imageBlob = new Blob([resizedImageBuffer], { type: 'image/jpeg' })
  }
  return imageBlob
}

async function pollGenerationResult(
  generationId: string,
  apiKey: string,
  maxPollingCount = 40,
  intervalMs = 10000
): Promise<string> {
  console.log(TAG, `Polling generation result width id = ${generationId} ...`)
  return new Promise((resolve, reject) => {
    let pollingCount = 0
    const intervalId = setInterval(async () => {
      try {
        const res = await fetch(
          `https://api.stability.ai/v2beta/image-to-video/result/${generationId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${apiKey}`,
              Accept: 'application/json; type=video/mp4', // Use 'video/*' to receive raw bytes
            },
            cache: 'no-store',
          }
        )

        if (res.status === 202) {
          return pollingCount++
        }

        try {
          const {
            video,
            errors,
            finish_reason,
          }: StabilityAIVImageToVideoFetchGenerationResponse = await res.json()
          if (res.status > 200) {
            throw new Error(errors?.join('\n'))
          }
          if (
            finish_reason !==
            StabilityAIVImageToVideoFetchhGenerationFinishReason.SUCCESS
          ) {
            console.log('finish_reason:', finish_reason)
            throw new Error('Content filtered')
          }
          resolve(`data:video/mp4;base64,${video}`)
        } catch (err) {
          console.error(TAG, err)
          if (res.status < 500) {
            reject(err)
          }
        } finally {
          if (res.status < 500) {
            return clearInterval(intervalId)
          } else {
            pollingCount++
          }
        }

        if (pollingCount >= maxPollingCount) {
          clearInterval(intervalId)
          reject(new Error(`${TAG}: Request timed out.`))
        }
      } catch (error) {
        clearInterval(intervalId)
        reject(error)
      }
    }, intervalMs)
  })
}
