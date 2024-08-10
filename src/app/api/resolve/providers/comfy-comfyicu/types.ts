export type ComfyIcuApiRequestRunWorkflow = {
  workflow_id: string
  prompt: string
  files: Record<string, any>
}

export type ComfyIcuApiResponseWorkflowStatus = {
  id: string
  run_time?: number
  status: string
  name?: string
  created_at: string
  output?: ComfyIcuWorkflowOutput[]
  project_id: string
  api_key_id: any
  device?: string
}

export type ComfyIcuWorkflowOutput = {
  filename: string
  url: string
  thumbnail_url: string
}

