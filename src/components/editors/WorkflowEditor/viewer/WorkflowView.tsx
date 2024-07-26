import React, { useCallback, useEffect } from 'react'
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  OnConnect,
  Node,
  Edge,
} from '@xyflow/react'

import '@xyflow/react/dist/base.css'

import { NodeView } from './NodeView'
import { ReactWorkflowEdge, ReactWorkflowNode } from '../types'
import { useWorkflowEditor } from '@/services/editors'

import { glifs } from '../samples/glif'
import { glifToReactWorkflow } from '../specialized/glif/glifToReactWorkflow'
import { useTheme } from '@/services'

const nodeTypes = {
  custom: NodeView,
}

export function WorkflowView() {
  const theme = useTheme()
  const current = useWorkflowEditor((s) => s.current)
  const [nodes, setNodes, onNodesChange] = useNodesState<ReactWorkflowNode>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<ReactWorkflowEdge>([])

  useEffect(() => {
    const { nodes, edges } = glifToReactWorkflow(glifs[0])
    setNodes(nodes)
    setEdges(edges)
  }, [])

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  )

  return (
    <ReactFlow<ReactWorkflowNode>
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes as any}
      fitView
      className="bg-transparent"
      // TODO: the "light" / "dark" string should be
      // defined in the theme, eg. colorMode={theme.mode}
      colorMode="dark"
      style={{
        backgroundColor:
          theme.workflow.bgColor || theme.defaultBgColor || '#000000',
      }}
    >
      <MiniMap nodeStrokeWidth={3} pannable zoomable className="scale-75" />
      <Controls />
    </ReactFlow>
  )
}
