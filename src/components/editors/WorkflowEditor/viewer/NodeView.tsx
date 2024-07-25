import React, { memo } from 'react'
import { Handle, Position } from '@xyflow/react'

import { ReactWorkflowNode } from '../types'

function NodeComponent({ data }: ReactWorkflowNode) {
  return (
    <div className="rounded-md border-2 border-stone-400 bg-stone-50 px-4 py-2 shadow-md">
      <div className="flex flex-col">
        <div className="text-lg font-bold text-gray-950">
          {data?.name || ''}
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="w-16 !bg-indigo-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-16 !bg-indigo-500"
      />
    </div>
  )
}

export const NodeView = memo(NodeComponent)
