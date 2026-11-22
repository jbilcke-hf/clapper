import {
  ComfyUIWorkflowApiGraph,
  isComfyUiGuiWorkflow,
  sanitizeJsonObject,
} from '@/app/api/resolve/providers/comfyui/graph'
import { ComfyUIWorkflowApiJson } from '@/app/api/resolve/providers/comfyui/types'
import {
  ReactWorkflow,
  ReactWorkflowEdge,
  ReactWorkflowNode,
} from '../../types'
import { ComfyuiWorkflow } from './types'

export function comfyUiToReactWorkflow(
  workflowInput: string | ComfyUIWorkflowApiJson | ComfyuiWorkflow
): ReactWorkflow {
  try {
    const raw =
      typeof workflowInput === 'string'
        ? sanitizeJsonObject(JSON.parse(workflowInput))
        : sanitizeJsonObject(workflowInput)

    if (!raw || typeof raw !== 'object') {
      return { nodes: [], edges: [] }
    }

    // Handle ComfyUI GUI workflow format ({ nodes: [...], links: [...] })
    if (isComfyUiGuiWorkflow(raw)) {
      const gui = raw as ComfyuiWorkflow
      const guiNodes = Array.isArray(gui.nodes) ? gui.nodes : []
      const guiLinks = Array.isArray(gui.links) ? gui.links : []

      const nodes: ReactWorkflowNode[] = guiNodes.map((node, idx) => {
        const posX = Array.isArray(node.pos)
          ? Number(node.pos[0] ?? idx * 240)
          : Number((node.pos as Record<string, number>)?.['0'] ?? idx * 240)
        const posY = Array.isArray(node.pos)
          ? Number(node.pos[1] ?? 0)
          : Number((node.pos as Record<string, number>)?.['1'] ?? 0)
        const title = String(node.title || node.type || `Node ${node.id}`)

        return {
          id: String(node.id),
          type: 'custom',
          position: { x: posX, y: posY },
          data: {
            name: title,
            label: title,
            classType: String(node.type || ''),
          },
        }
      })

      const nodeIdSet = new Set(nodes.map((n) => n.id))
      const edges: ReactWorkflowEdge[] = []

      for (const link of guiLinks) {
        if (!Array.isArray(link) || link.length < 5) continue
        const [linkId, sourceId, , targetId, , linkType] = link
        const source = String(sourceId)
        const target = String(targetId)
        if (!nodeIdSet.has(source) || !nodeIdSet.has(target)) continue
        edges.push({
          id: `link-${linkId}-${source}->${target}`,
          source,
          target,
          label: linkType ? String(linkType) : undefined,
        })
      }

      return { nodes, edges }
    }

    // Handle ComfyUI API workflow format (Record<nodeId, NodeRawData>)
    const graph = new ComfyUIWorkflowApiGraph(raw as ComfyUIWorkflowApiJson)
    const { adjList, dependencyList } = graph.getGraphData()
    const nodesDict = graph.getNodesDict()
    const nodeIds = Object.keys(nodesDict)

    // Compute topological layer depths for visual layout
    const depthByNode: Record<string, number> = {}
    const computeDepth = (
      nodeId: string,
      visiting = new Set<string>()
    ): number => {
      if (depthByNode[nodeId] !== undefined) return depthByNode[nodeId]
      if (visiting.has(nodeId)) return 0
      visiting.add(nodeId)
      const deps = dependencyList[nodeId] || []
      let maxParentDepth = -1
      for (const dep of deps) {
        if (nodesDict[dep.from]) {
          maxParentDepth = Math.max(
            maxParentDepth,
            computeDepth(dep.from, visiting)
          )
        }
      }
      visiting.delete(nodeId)
      const depth = maxParentDepth + 1
      depthByNode[nodeId] = depth
      return depth
    }

    for (const nodeId of nodeIds) {
      computeDepth(nodeId)
    }

    const columnsByDepth: Record<number, number> = {}
    const nodes: ReactWorkflowNode[] = nodeIds.map((nodeId) => {
      const node = nodesDict[nodeId]
      const depth = depthByNode[nodeId] || 0
      const colIndex = columnsByDepth[depth] || 0
      columnsByDepth[depth] = colIndex + 1

      const title = String(
        node._meta?.title || node.class_type || `Node ${nodeId}`
      )

      return {
        id: String(nodeId),
        type: 'custom',
        position: {
          x: colIndex * 240,
          y: depth * 120,
        },
        data: {
          name: title,
          label: title,
          classType: String(node.class_type || ''),
          inputs: node.inputs || {},
        },
      }
    })

    const edges: ReactWorkflowEdge[] = []
    for (const sourceId of Object.keys(adjList)) {
      const targetDeps = dependencyList
      for (const targetId of adjList[sourceId] || []) {
        const matchingInputs = (targetDeps[targetId] || []).filter(
          (d) => d.from === sourceId
        )
        if (matchingInputs.length > 0) {
          for (const match of matchingInputs) {
            edges.push({
              id: `${sourceId}->${targetId}:${match.inputName}`,
              source: String(sourceId),
              target: String(targetId),
              label: match.inputName,
            })
          }
        } else {
          edges.push({
            id: `${sourceId}->${targetId}`,
            source: String(sourceId),
            target: String(targetId),
          })
        }
      }
    }

    return { nodes, edges }
  } catch {
    return { nodes: [], edges: [] }
  }
}
