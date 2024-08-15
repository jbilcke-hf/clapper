/**
 * Represents the parameters for the image creation request.
 */
export type ImageCreationParams = {
  prompt: string
  skip_prompt_check?: boolean
  process_mode?: 'relax' | 'fast' | 'turbo'
  aspect_ratio?: string
  webhook_endpoint?: string
  webhook_secret?: string
  bot_id?: number
}

/**
 * Represents the response from the image creation request.
 */
export type ImageCreationResponse = {
  task_id: string
  status: string
  message: string
}

/**
 * Represents the task result in the fetch response.
 */
export type TaskResult = {
  discord_image_url?: string
  image_url?: string
  image_urls?: string[]
  permanent_url?: string
  task_progress?: number
  intermediate_image_urls?: string[] | null
  image_id?: string
  seed?: string
  result_message_id?: string
  quota_used?: number
  credit?: number
  message?: string
  warning?: string
  error_messages?: string[]
  need_retry?: boolean
  actions?: string[]
}

/**
 * Represents the response from the fetch request.
 */
export type FetchResponse = {
  task_id: string
  status: string
  process_time: number
  retry_count: number
  meta: {
    account_id: string
    task_type: string
    process_mode: string
    created_at: number
    created_at_utc: string
    started_at: number
    started_at_utc: string
    ended_at: number
    ended_at_utc: string
    [key: string]: any // For other possible meta fields
  }
  task_result: TaskResult
}
