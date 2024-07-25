export type GlifWorkflow = {
  id: string
  name: string
  imageUrl: any
  description: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  output: string
  outputType: string
  forkedFromId: string
  featuredAt: any
  userId: string
  completedSpellRunCount: number
  averageDuration: number
  user: GlifWorkflowUser
  _count: GlifWorkflowCount
  spheres: any[]
  data: GlifWorkflowData
}

export type GlifWorkflowUser = {
  id: string
  name: string
  image: string
  username: string
}

export type GlifWorkflowCount = {
  likes: number
  comments: number
}

export type GlifWorkflowData = {
  nodes: GlifWorkflowNode[]
}

export type GlifWorkflowNode = {
  name: string
  type: string
  params: GlifWorkflowParams
}

// or we use a Record<string, any>
export interface GlifWorkflowParams {
  label?: string | null
  value?: string | null
  source?: string | null
  options?: string[] | null
  randomize?: boolean | null
  id?: string
  inputValues?: string[] | null
  model?: string | null
  prompt?: string | null
  jsonMode?: boolean | null
  maxTokens?: number | null
  temperature?: number | null
  systemPrompt?: string | null
  paths?: Record<string, GlifWorkflowPath> | null
  seed?: string | number | null
  fixSeed?: boolean | null
}

export type GlifWorkflowPath = {
  path: string
  fallback: any
}
