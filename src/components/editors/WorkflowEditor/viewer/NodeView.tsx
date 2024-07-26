import React, { memo } from 'react'
import { Handle, Position } from '@xyflow/react'

import { ReactWorkflowNode } from '../types'
import { useTheme } from '@/services'
import { cn } from '@/lib/utils'

function NodeComponent({ data }: ReactWorkflowNode) {
  const theme = useTheme()
  return (
    <div
      className={cn(
        `flex min-w-32 flex-col items-center justify-center border-2 px-4 py-2 shadow-md`
      )}
      style={{
        backgroundColor: theme.workflow.node.bgColor || '#ffffff',
        borderColor:
          theme.workflow.node.borderColor ||
          theme.defaultBorderColor ||
          '#eeeeee',
        borderRadius: theme.workflow.node.radius || '0px',
        color:
          theme.workflow.node.textPrimaryColor ||
          theme.defaultTextColor ||
          '#000000',
      }}
    >
      <div className="flex w-full flex-col items-center justify-center text-center">
        <div className="text-lg">{data?.name || ''}</div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="-mt-0.5 w-8 rounded-t-full opacity-90"
        style={{
          backgroundColor: theme.workflow.handle.inputColor || '#ccffcc',
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="-mb-0.5 w-8 rounded-b-full opacity-90"
        style={{
          backgroundColor: theme.workflow.handle.outputColor || '#ffcccc',
        }}
      />
    </div>
  )
}

export const NodeView = memo(NodeComponent)
