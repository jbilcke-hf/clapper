/**
 * Represents the parameters for the video generation request.
 */
export type VideoGenerationParams = {
  prompt: string
  expand_prompt: boolean
  image_url?: string
  image_end_url?: string
  loop?: boolean
}

/**
 * Represents the response from the video generation request.
 */
export type VideoGenerationResponse = {
  code: number
  data: {
    task_id: string
  }
  message: string
}

/**
 * Represents the response from the fetch video result request.
 */
export type VideoFetchResponse = {
  code: number
  data: {
    task_id: string
    input: string
    status: string
    metadata: {
      created_at: string
      started_at: string
      ended_at: string
      quota_frozen: number
      quota_usage: number
    }
    generation: {
      id: string
      prompt: string
      state: string
      created_at: string
      video: string | null
      like: string | null
      estimate_wait_seconds: number | null
    }
  }
  message: string
}
