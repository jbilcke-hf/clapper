/**
 * Represents the parameters for the image creation request.
 */
export type ImageCreationParams = {
  prompt: string
  negativePrompt?: string
  model?: string
  width?: number
  height?: number
  steps?: number
  guidance?: number
  seed?: number
  scheduler?: string
  outputFormat?: string
}

/**
 * Represents the response from the image creation request.
 */
export type ImageCreationResponse = {
  id: string
  createdAt: string
  updatedAt: string
  prompt: string
  negativePrompt: string | null
  model: string
  width: number
  height: number
  steps: number
  guidance: number
  seed: number
  scheduler: string
  status: string
  error: string | null
  progress: number
  outputFormat: string
  output: string | null
  nsfw: boolean
  user: {
    id: string
    username: string
  }
}
