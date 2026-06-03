import { useEffect, useMemo } from 'react'
import {
  Controls,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from '@xyflow/react'

import '@xyflow/react/dist/base.css'

import { comfyUiToReactWorkflow } from '../editors/WorkflowEditor/WorkflowViewer/ReactFlowCanvas/formats/comfyui/comfyUiToReactWorkflow'
import { NodeView } from '../editors/WorkflowEditor/WorkflowViewer/ReactFlowCanvas/NodeView'
import {
  ReactWorkflowEdge,
  ReactWorkflowNode,
} from '../editors/WorkflowEditor/WorkflowViewer/ReactFlowCanvas/types'
import { useTheme } from '@/services'

const nodeTypes = {
  custom: NodeView,
}

export function ComfyUIWorkflowGraphPreview({
  workflow,
}: {
  workflow: string
}) {
  const theme = useTheme()
  const reactWorkflow = useMemo(() => {
    try {
      return comfyUiToReactWorkflow(JSON.parse(workflow))
    } catch {
      return {
        nodes: [],
        edges: [],
      }
    }
  }, [workflow])

  const [nodes, setNodes, onNodesChange] = useNodesState<ReactWorkflowNode>(
    reactWorkflow.nodes
  )
  const [edges, setEdges, onEdgesChange] = useEdgesState<ReactWorkflowEdge>(
    reactWorkflow.edges
  )

  useEffect(() => {
    setNodes(reactWorkflow.nodes)
    setEdges(reactWorkflow.edges)
  }, [reactWorkflow.edges, reactWorkflow.nodes, setEdges, setNodes])

  return (
    <div className="h-80 w-full overflow-hidden rounded-md border border-neutral-100/10">
      <ReactFlow<ReactWorkflowNode>
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes as any}
        fitView
        className="bg-transparent"
        colorMode={theme.colorMode}
        style={{
          backgroundColor:
            theme.workflow.bgColor || theme.defaultBgColor || '#000000',
        }}
        proOptions={{
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
    </div>
  )
}
