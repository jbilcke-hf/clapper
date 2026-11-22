export type ComfyIcuApiRequestRunWorkflow = {
  workflow_id: string
  prompt: Record<string, any> | string
  files?: Record<string, any>
  accelerator?: string
}

export type ComfyIcuApiResponseWorkflowStatus = {
  id: string
  run_time?: number
  status: string
  name?: string
  created_at?: string
  output?: ComfyIcuWorkflowOutput[]
  outputs?: ComfyIcuWorkflowOutput[]
  message?: string
  error?: string
  project_id?: string
  api_key_id?: any
  device?: string
}

export type ComfyIcuWorkflowOutput = {
  filename: string
  url: string
  thumbnail_url?: string
}
