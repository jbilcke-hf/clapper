import { Node, Edge } from '@xyflow/react'

export type ReactWorkflowNode = Node & {
  id: string
  type: string
  position?: ReactWorkflowNodePosition
  // size?: WorkflowNodeSize
  data?: ReactWorkflowNodeData
}

export type ReactWorkflowNodePosition = {
  x: number
  y: number
}

/*
export type WorkflowNodeSize = {
  width?: number
  height?: number
}
*/

export type ReactWorkflowNodeData = {
  label?: string
} & Record<string, any>

export type ReactWorkflowEdge = Edge & {}

export type ReactWorkflow = {
  nodes: ReactWorkflowNode[]
  edges: ReactWorkflowEdge[]
}
