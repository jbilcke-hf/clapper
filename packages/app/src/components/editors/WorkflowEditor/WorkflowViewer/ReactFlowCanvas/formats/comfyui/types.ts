export type ComfyuiWorkflow = {
  extra: {
    ds: {
      scale: number
      offset: { '0': number; '1': number }
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
  title?: string | null
  pos: Record<string, number> | number[]
  mode: number
  size: { '0': number; '1': number }
  type: string
  color?: string | null
  bgcolor?: string | null
  locked?: boolean
  flags: {
    collapsed?: boolean | null
  }
  order: number
  inputs?: ComfyuiWorkflowNodeInput[]
  outputs?: ComfyuiWorkflowNodeOutput[]
  properties: Record<string, any>
  widgets_values?: any | null
}

export type ComfyuiWorkflowNodeInput = {
  link?: number | null
  dir?: number | null
  name: string
  type: string
  label?: string | null
  widget?: {
    name: string
  } | null
  slot_index?: number | null
}

export type ComfyuiWorkflowNodeOutput = {
  name: string
  type: string
  label?: string | null
  links?: number[] | null
  shape?: number | null
  slot_index?: number | null
}

export type ComfyuiWorkflowGroup = {
  color: string
  title: string
  locked: boolean
  bounding: number[]
  font_size: number
}
