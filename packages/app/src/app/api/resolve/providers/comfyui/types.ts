export enum ClapperComfyUiInputIds {
  PROMPT = '@clapper/prompt',
  NEGATIVE_PROMPT = '@clapper/negative/prompt',
  WIDTH = '@clapper/width',
  HEIGHT = '@clapper/height',
  SEED = '@clapper/seed',
  IMAGE = '@clapper/image',
  OUTPUT = '@clapper/output',
  NULL = '@clapper/null',
}

export type NodeRawData = {
  inputs?: Record<string, unknown>
  class_type?: string
  _meta?: {
    title: string
  }
}

export type NodeData = NodeRawData & {
  id: string
}

export type ComfyUIWorkflowApiJson = Record<string, NodeRawData>

export type INPUT_TYPES = 'string' | 'number'

export type ComfyUiWorkflowApiNodeInput = {
  id: string
  // Infered primitive type of the input based on its value
  type: INPUT_TYPES
  name: string
  value: any
  node: {
    id: string
    name?: string
    type?: string
  }
}
