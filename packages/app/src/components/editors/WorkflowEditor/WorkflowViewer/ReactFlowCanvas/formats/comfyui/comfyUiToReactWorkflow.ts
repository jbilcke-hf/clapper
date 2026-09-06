import {
  ReactWorkflow,
  ReactWorkflowEdge,
  ReactWorkflowNode,
} from '../../types'

type ComfyUiWorkflowApiJson = Record<
  string,
  {
    class_type?: string
    inputs?: Record<string, unknown>
    _meta?: {
      title?: string
    }
  }
>

export function comfyUiToReactWorkflow(
  workflow: ComfyUiWorkflowApiJson
): ReactWorkflow {
  const nodeIds = Object.keys(workflow)
  const columns = 4
  const nodes: ReactWorkflowNode[] = nodeIds.map((nodeId, index) => {
    const node = workflow[nodeId]
    return {
      id: nodeId,
      type: 'custom',
      position: {
        x: (index % columns) * 240,
        y: Math.floor(index / columns) * 140,
      },
      data: {
        name: node?._meta?.title || node?.class_type || nodeId,
        label: node?.class_type || nodeId,
      },
    }
  })

  const edges: ReactWorkflowEdge[] = []

  Object.entries(workflow).forEach(([targetNodeId, node]) => {
    Object.entries(node.inputs || {}).forEach(([inputName, value]) => {
      if (!isComfyUiLink(value)) return
      const sourceNodeId = value[0]
      edges.push({
        id: `${sourceNodeId}-${targetNodeId}-${inputName}`,
        source: sourceNodeId,
        target: targetNodeId,
        label: inputName,
      })
    })
  })

  return {
    nodes,
    edges,
  }
}

function isComfyUiLink(value: unknown): value is [string, number] {
  return (
    Array.isArray(value) &&
    value.length >= 2 &&
    typeof value[0] === 'string' &&
    typeof value[1] === 'number'
  )
}
