/**
 * Represents the parameters for the video generation request.
 */
export type VideoGenerationParams = {
  model: string
  request_id?: string
  user_id?: string
} & (
  | {
      prompt?: string
    }
  | {
      image_url?: string
    }
)

/**
 * Represents the response from the video generation request.
 */
export type VideoGenerationResponse = {
  request_id: string
  id: string
  model: string
  task_status: 'PROCESSING' | 'SUCCESS' | 'FAIL'
}

/**
 * Represents the video result in the task result query.
 */
export type VideoResult = {
  url: string
  cover_image_url: string
}

/**
 * Represents the response from the task result query.
 */
export type TaskResultResponse = {
  model: string
  video_result: VideoResult[]
  task_status: 'PROCESSING' | 'SUCCESS' | 'FAIL'
  request_id: string
  id: string
}
