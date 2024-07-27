export type ComfyuiWorkflow = {
  extra: {
    ds: {
      scale: number
      offset: number[]
    }
  }
  links: [number, number, number, number, number, string][]
  nodes: ComfyuiWorkflowNode[]
  config: Record<string, any>
  groups: ComfyuiWorkflowGroup[]
  version: number
  last_link_id: number
  last_node_id: number
}

export type ComfyuiWorkflowNode = {
  id: number
  pos: number[]
  mode: number
  size: number[]
  type: string
  color?: string
  flags: {
    collapsed?: boolean
  }
  order: number
  inputs?: ComfyuiWorkflowNodeInput[]
  outputs?: ComfyuiWorkflowNodeOutput[]
  properties: Record<string, any>
  widgets_values?: any[]
}

export type ComfyuiWorkflowNodeInput = {
  link?: number
  name: string
  type: string
  label?: string
  widget?: {
    name: string
  }
  slot_index?: number
}

export type ComfyuiWorkflowNodeOutput = {
  name: string
  type: string
  label?: string
  links?: number[]
  shape: number
  slot_index?: number
}

export type ComfyuiWorkflowGroup = {
  color: string
  title: string
  locked: boolean
  bounding: number[]
  font_size: number
}
