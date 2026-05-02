'use client'

import React, { useMemo } from 'react'

interface ComfyWorkflowGraphPreviewProps {
  workflowData: string
  maxNodes?: number
  width?: number
  height?: number
}

interface GraphNode {
  id: string
  class_type: string
  title?: string
  inputs: Record<string, any>
}

interface GraphEdge {
  from: string
  to: string
  fromOutput?: number
  toInput?: string
}

/**
 * A simple React component that renders a ComfyUI workflow graph
 * as a visual node graph preview.
 * 
 * This parses the ComfyUI API JSON format and renders nodes and edges
 * in a simplified visual representation.
 */
export function ComfyWorkflowGraphPreview({
  workflowData,
  maxNodes = 20,
  width = 400,
  height = 300,
}: ComfyWorkflowGraphPreviewProps) {
  const { nodes, edges } = useMemo(() => {
    try {
      return parseWorkflowGraph(workflowData, maxNodes)
    } catch {
      return { nodes: [], edges: [] }
    }
  }, [workflowData, maxNodes])

  if (!nodes.length) {
    return (
      <div className="flex items-center justify-center text-gray-400 text-sm bg-gray-50 dark:bg-gray-800 rounded-md" style={{ width, height }}>
        <span>No workflow data to preview</span>
      </div>
    )
  }

  // Simple SVG-based graph visualization
  const nodeRadius = 30
  const nodeSpacingX = 140
  const nodeSpacingY = 70
  const padding = 20

  // Calculate positions using a simple layered layout
  const layout = calculateLayout(nodes, edges, width, height, padding, nodeSpacingX, nodeSpacingY)

  return (
    <div className="comfy-workflow-preview overflow-hidden rounded-md border border-gray-200 dark:border-gray-700" style={{ width, height }}>
      <svg width={width} height={height} className="bg-gray-50 dark:bg-gray-900">
        {/* Draw edges */}
        {edges.map((edge, i) => {
          const fromPos = layout[edge.from]
          const toPos = layout[edge.to]
          if (!fromPos || !toPos) return null

          return (
            <g key={`edge-${i}`}>
              <line
                x1={fromPos.x + nodeRadius}
                y1={fromPos.y}
                x2={toPos.x - nodeRadius}
                y2={toPos.y}
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeDasharray="4,2"
                opacity={0.6}
              />
              <circle
                cx={toPos.x - nodeRadius}
                cy={toPos.y}
                r="3"
                fill="#94a3b8"
              />
            </g>
          )
        })}

        {/* Draw nodes */}
        {nodes.map((node) => {
          const pos = layout[node.id]
          if (!pos) return null

          // Color based on node type
          const fillColor = getNodeColor(node.class_type)

          return (
            <g key={node.id}>
              <rect
                x={pos.x - nodeRadius}
                y={pos.y - 16}
                width={nodeRadius * 2}
                height={32}
                rx="6"
                ry="6"
                fill={fillColor}
                stroke="#475569"
                strokeWidth="1"
                opacity={0.9}
              />
              <text
                x={pos.x}
                y={pos.y + 4}
                textAnchor="middle"
                fill="white"
                fontSize="10"
                fontFamily="monospace"
                className="select-none"
              >
                {truncateText(node.title || node.class_type, 16)}
              </text>
              {/* Node ID label */}
              <text
                x={pos.x}
                y={pos.y + 30}
                textAnchor="middle"
                fill="#64748b"
                fontSize="8"
                fontFamily="monospace"
                className="select-none"
              >
                {node.id}
              </text>
            </g>
          )
        })}

        {/* Legend */}
        <text x={8} y={height - 8} fill="#94a3b8" fontSize="9" fontFamily="monospace">
          {nodes.length} nodes · {edges.length} connections
        </text>
      </svg>
    </div>
  )
}

function parseWorkflowGraph(
  workflowData: string,
  maxNodes: number
): { nodes: GraphNode[]; edges: GraphEdge[] } {
  if (!workflowData) {
    return { nodes: [], edges: [] }
  }

  let data: Record<string, any>
  try {
    data = JSON.parse(workflowData)
  } catch {
    return { nodes: [], edges: [] }
  }

  // Handle both API format and full workflow format
  const entries = Object.entries(data).slice(0, maxNodes)
  const nodes: GraphNode[] = []
  const edges: GraphEdge[] = []

  for (const [id, nodeData] of entries) {
    const node = nodeData as any
    nodes.push({
      id,
      class_type: node.class_type || 'Unknown',
      title: node._meta?.title || node.class_type || 'Unknown',
      inputs: node.inputs || {},
    })

    // Extract connections from inputs
    if (node.inputs) {
      for (const [inputName, value] of Object.entries(node.inputs)) {
        if (Array.isArray(value) && value.length >= 2) {
          edges.push({
            from: String(value[0]),
            to: id,
            fromOutput: Number(value[1]),
            toInput: inputName,
          })
        }
      }
    }
  }

  return { nodes, edges }
}

function calculateLayout(
  nodes: GraphNode[],
  edges: GraphEdge[],
  width: number,
  height: number,
  padding: number,
  nodeSpacingX: number,
  nodeSpacingY: number
): Record<string, { x: number; y: number }> {
  const layout: Record<string, { x: number; y: number }> = {}
  
  if (nodes.length === 0) return layout

  // Build adjacency map for topological sort
  const inDegree: Record<string, number> = {}
  const adjList: Record<string, string[]> = {}
  
  for (const node of nodes) {
    inDegree[node.id] = 0
    adjList[node.id] = []
  }
  
  for (const edge of edges) {
    if (adjList[edge.from]) {
      adjList[edge.from].push(edge.to)
    }
    if (inDegree[edge.to] !== undefined) {
      inDegree[edge.to]++
    }
  }

  // Topological sort using Kahn's algorithm
  const queue: string[] = []
  for (const [id, degree] of Object.entries(inDegree)) {
    if (degree === 0) {
      queue.push(id)
    }
  }

  const sorted: string[] = []
  while (queue.length > 0) {
    const nodeId = queue.shift()!
    sorted.push(nodeId)
    for (const neighbor of adjList[nodeId] || []) {
      inDegree[neighbor]--
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor)
      }
    }
  }

  // If we couldn't sort all nodes (cycles or missing nodes), just use order from input
  const orderedIds = sorted.length === nodes.length ? sorted : nodes.map((n) => n.id)

  // Simple grid-like layout
  const cols = Math.max(1, Math.floor((width - padding * 2) / nodeSpacingX))
  
  orderedIds.forEach((id, index) => {
    const col = index % cols
    const row = Math.floor(index / cols)
    layout[id] = {
      x: padding + col * nodeSpacingX + nodeSpacingX / 2,
      y: padding + row * nodeSpacingY + nodeSpacingY / 2,
    }
  })

  return layout
}

function getNodeColor(classType: string): string {
  // Categorize common ComfyUI node types
  if (/checkpoint|load|input|image|video|audio/i.test(classType)) {
    return '#3b82f6' // blue - input/load nodes
  }
  if (/sampler|ksampler|sample/i.test(classType)) {
    return '#8b5cf6' // purple - sampling nodes
  }
  if (/encode|decode|clip|vae/i.test(classType)) {
    return '#10b981' // green - encode/decode
  }
  if (/save|output|preview/i.test(classType)) {
    return '#f59e0b' // amber - output nodes
  }
  if (/lora|controlnet|adapter|inpaint/i.test(classType)) {
    return '#ec4899' // pink - conditioning nodes
  }
  if (/upscale|resize|latent/i.test(classType)) {
    return '#06b6d4' // cyan - transformation nodes
  }
  return '#64748b' // gray - default
}

function truncateText(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen - 3) + '...'
}
