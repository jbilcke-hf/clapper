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
import { ReactWorkflowEdge, ReactWorkflowNode } from './types'
import { useWorkflowEditor } from '@/services/editors'

import { glifs } from './samples/glif'
import { glifToReactWorkflow } from './formats/glif/glifToReactWorkflow'
import { useTheme } from '@/services'

const nodeTypes = {
  custom: NodeView,
}

export function ReactFlowCanvas() {
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
      colorMode={theme.colorMode}
      style={{
        backgroundColor:
          theme.workflow.bgColor || theme.defaultBgColor || '#000000',
      }}
      proOptions={{
        // Since a workflow can be shown inside a tiny panel, we need to free up visual space.
        // As a consequence I have hidden the React Flow attribution.
        // Doing so is acceptable by their terms, since at the time of writing
        // Clapper is a non-commercial project that doesn't belong to any organization.
        //
        // for more information about React Flow licensing and attribution:
        //
        //  "If you start making money using React Flow or use it in an organization in the future,
        //  we would ask that you re-add the attribution or sign up for one of our subscriptions."
        //
        // https://reactflow.dev/learn/troubleshooting/remove-attribution
        hideAttribution: true,
      }}
    >
      <MiniMap
        nodeStrokeWidth={3}
        pannable
        zoomable
        className="translate-x-14 translate-y-12 scale-50"
      />
      <Controls />
    </ReactFlow>
  )
}
