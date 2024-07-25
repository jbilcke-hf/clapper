import { GlifWorkflow } from './types'

import {
  ReactWorkflow,
  ReactWorkflowEdge,
  ReactWorkflowNode,
} from '../../types'

export function glifToReactWorkflow(glif: GlifWorkflow): ReactWorkflow {
  const nodes: ReactWorkflowNode[] = glif.data.nodes.map((node, i) => ({
    id: node.name,
    type: 'custom',
    data: node,
    position: { x: 0, y: i * 100 },
  }))

  const edges: ReactWorkflowEdge[] = []

  for (let i = 0; i < nodes.length; i++) {
    const source = `${nodes[i]?.id || ''}`
    const target = `${nodes[i + 1]?.id || ''}`
    if (!source || !target) {
      continue
    }
    if (source === target) {
      continue
    }

    edges.push({
      id: `${source}->${target}`,
      source,
      target,
    })
  }

  return { nodes, edges }
}
