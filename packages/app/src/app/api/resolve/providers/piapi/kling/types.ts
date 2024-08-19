/**
 * Represents the parameters for the Kling video generation request.
 */
export type KlingVideoGenerationParams = {
  prompt: string
  negative_prompt?: string
  creativity?: number
  duration?: number
  aspect_ratio: string
  professional_mode?: boolean
  image_url?: string
  tail_image_url?: string
  camera?: {
    type?: string
    horizontal?: number
    vertical?: number
    zoom?: number
    tilt?: number
    pan?: number
    roll?: number
  }
}

/**
 * Represents the response from the Kling video generation request.
 */
export type KlingVideoGenerationResponse = {
  code: number
  data: {
    task_id: string
  }
  message: string
}

/**
 * Represents the response from the Kling fetch video result request.
 */
export type KlingVideoFetchResponse = {
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
    task: {
      id: number
      userId: number
      type: string
      status: number
      taskInfo: {
        arguments: Array<{ name: string; value: string }>
        inputs: Array<{
          inputType: string
          name: string
          url: string
          blobStorage: any
          token: any
        }>
        type: string
      }
      favored: boolean
      deleted: boolean
      createTime: number
      updateTime: number
    }
    works: Array<{
      workId: number
      workItemId: number
      taskId: number
      userId: number
      type: string
      status: number
      contentType: string
      resource: {
        resource: string
        resourceWithoutWatermark: string
        height: number
        width: number
        duration: number
      }
      cover: {
        resource: string
        height: number
        width: number
        duration: number
      }
      starNum: number
      reportNum: number
      createTime: number
      taskInfo: {
        arguments: Array<{ name: string; value: string }>
        inputs: Array<{
          inputType: string
          name: string
          url: string
          blobStorage: any
          token: any
        }>
        type: string
      }
      selfAttitude: string
      selfComment: {
        tags: Array<any>
        content: string
      }
      favored: boolean
      publishStatus: string
      deleted: boolean
    }>
  }
  message: string
}
