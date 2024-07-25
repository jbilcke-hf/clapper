export type FalaiWorkflow = {
  nodes: FalaiWorkflowNode[]
  edges: FalaiWorkflowEdge[]
  workflow: string
}

export type FalaiWorkflowNode = {
  id: string
  deletable: boolean
  type: string
  position: FalaiWorkflowNodePosition
  data: FalaiWorkflowNodeData
}

export type FalaiWorkflowNodePosition = {
  x: number
  y: number
}

export type FalaiWorkflowNodeData = {
  output?: Record<string, any>
  app?: string
  value?: any
}

export type FalaiWorkflowEdge = {
  id: string
  source: string
  sourceHandle: string
  target: string
  targetHandle: string
  type: string
}

// ---------

type FalaiWorkflowBaseEvent = {
  type: 'submit' | 'completion' | 'error' | 'output'
  node_id: string
}

export type FalaiWorkflowSubmitEvent = FalaiWorkflowBaseEvent & {
  type: 'submit'
  app_id: string
  request_id: string
}

export type FalaiWorkflowCompletionEvent<Output = any> =
  FalaiWorkflowBaseEvent & {
    type: 'completion'
    app_id: string
    output: Output
  }

export type FalaiWorkflowDoneEvent<Output = any> = FalaiWorkflowBaseEvent & {
  type: 'output'
  output: Output
}

export type FalaiWorkflowErrorEvent = FalaiWorkflowBaseEvent & {
  type: 'error'
  message: string
  error: any
}
